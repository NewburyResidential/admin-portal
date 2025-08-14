'use client';

import { useState } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveLine } from '@nivo/line';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import UsageTableRow from './UsageTableRow';
import EditMeterDialog from './EditMeterDialog';
import { updateUtilityMeterAccount } from 'src/utils/services/utilities/update-utility-meter-account';
import Big from 'big.js';
import { ResponsiveBump } from '@nivo/bump';

export default function View({ usageBills, utilityMeterAccounts }) {
  const [editOpen, setEditOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [selectedMonths, setSelectedMonths] = useState([]); // Track selected months as array

  const utilityVendor = 'cityofhotsprings';

  // Generate last 12 months in MM/YYYY format to match pk structure
  const generateLast12Months = () => {
    const months = [];
    const currentDate = new Date();

    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthKey = `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`; // MM/YYYY format
      const monthLabel = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      months.push({ key: monthKey, label: monthLabel, date });
    }

    return months;
  };

  const monthOptions = generateLast12Months();

  // Add safeguards to ensure arrays exist
  const safeUsageBills = Array.isArray(usageBills) ? usageBills : [];
  const safeUtilityMeterAccounts = Array.isArray(utilityMeterAccounts) ? utilityMeterAccounts : [];

  // Filter usageBills for this utility and selected months
  const filteredBills = safeUsageBills.filter((bill) => {
    const matchesVendor = bill.sk && bill.sk.includes(`#${utilityVendor}#`);

    if (selectedMonths.length === 0) return matchesVendor; // Show all if no months selected

    // Check if bill's pk matches any of the selected months
    const billPk = bill.pk;
    return matchesVendor && selectedMonths.includes(billPk);
  });

  // Filter meter accounts for this utility
  const filteredMeterAccounts = safeUtilityMeterAccounts.filter((acc) => acc.sk && acc.sk.includes(`#${utilityVendor}#`));

  // Get all unique account numbers for this utility
  const allAccountNumbers = Array.from(
    new Set([
      ...filteredBills.map((bill) => bill.accountNumber),
      ...filteredMeterAccounts.map((acc) => acc.accountNumber || acc.sk.split('#')[2]),
    ])
  ).filter(Boolean);

  const [selectedMeters, setSelectedMeters] = useState(() => allAccountNumbers); // default: all selected

  // Helper to calculate days between two dates (inclusive)
  function daysBetween(startService, endService) {
    const start = new Date(startService);
    const end = new Date(endService);
    // Add 1 to include both start and end dates
    return Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1);
  }

  // Calculate data for each account - add safeguard
  const data = Array.isArray(allAccountNumbers)
    ? allAccountNumbers
        .map((accountNumber) => {
          const meterAccount = filteredMeterAccounts.find((acc) => (acc.accountNumber || acc.sk.split('#')[2]) === accountNumber);
          const billsForAccount = filteredBills.filter((bill) => bill.accountNumber === accountNumber);

          // Total usage in 100s of gallons (sum of all bills)
          const totalUsageHundreds = billsForAccount
            .reduce((sum, bill) => {
              if (bill.waterUsage != null) {
                return sum.plus(bill.waterUsage);
              }
              return sum;
            }, Big(0))
            .round(0)
            .toNumber();

          // Total days in all bills
          const totalDays = billsForAccount
            .reduce((sum, bill) => {
              if (bill.startService && bill.endService) {
                return sum.plus(daysBetween(bill.startService, bill.endService));
              }
              return sum;
            }, Big(0))
            .toNumber();

          // Daily average (100s of gallons per day)
          let dailyAvgHundreds = '-';
          if (totalDays > 0) {
            dailyAvgHundreds = Big(totalUsageHundreds).div(totalDays).round(0).toNumber();
          }

          // For amount, use the sum of waterSewerAmount (if available, still divide by 100 for dollars)
          const totalAmount = billsForAccount
            .reduce((sum, bill) => {
              if (bill.waterSewerAmount != null) {
                return sum.plus(bill.waterSewerAmount);
              }
              return sum;
            }, Big(0))
            .div(100)
            .round(2)
            .toNumber();

          return {
            ...(meterAccount || {}),
            accountNumber,
            meter: meterAccount?.meterLabel || accountNumber,
            usage: totalUsageHundreds, // for chart (100s of gallons)
            totalUsage: totalUsageHundreds, // for table (100s of gallons)
            dailyAvg: dailyAvgHundreds, // (100s of gallons per day)
            amount: totalAmount,
            sk: meterAccount?.sk || accountNumber, // for key
            pk: meterAccount?.pk || '#Account',
          };
        })
        .sort((a, b) => {
          // Sort alphabetically by meter name
          const nameA = (a.meter || '').toString().toLowerCase();
          const nameB = (b.meter || '').toString().toLowerCase();
          return nameA.localeCompare(nameB);
        })
    : [];

  // Helper: get month short name from pk (MM/YYYY format)
  function getMonthShortFromPk(pk) {
    // pk is in format MM/YYYY
    const [month, year] = pk.split('/');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleString('default', { month: 'short' });
  }

  // Get all months present in the data, sorted - add safeguard
  const allMonths = Array.from(new Set(filteredBills.map((bill) => getMonthShortFromPk(bill.pk)))).sort((a, b) => {
    // Sort by calendar order
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.indexOf(a) - months.indexOf(b);
  });

  // Group usage by meter and month
  const usageByMeterAndMonth = {};
  filteredBills.forEach((bill) => {
    const meter = bill.accountNumber;
    const month = getMonthShortFromPk(bill.pk);
    if (!usageByMeterAndMonth[meter]) usageByMeterAndMonth[meter] = {};
    if (!usageByMeterAndMonth[meter][month]) usageByMeterAndMonth[meter][month] = 0;
    usageByMeterAndMonth[meter][month] += bill.waterUsage || 0; // 100s of gallons
  });

  // Prepare data for line chart when multiple months are selected
  const prepareLineChartData = () => {
    if (selectedMonths.length <= 1) return [];

    const selectedMonthLabels = selectedMonths
      .map((monthKey) => {
        // monthKey is in MM/YYYY format
        const [month, year] = monthKey.split('/');
        const date = new Date(parseInt(year), parseInt(month) - 1, 1);
        return {
          monthKey,
          date,
          label: date.toLocaleString('default', { month: 'short' }),
        };
      })
      .sort((a, b) => a.date - b.date) // Sort by actual date, not month name
      .map((item) => item.label);

    const selectedMeterData = data.filter((row) => selectedMeters.includes(row.accountNumber));

    return selectedMeterData
      .map((meter) => {
        const series = selectedMonthLabels.map((month) => {
          const monthUsage = usageByMeterAndMonth[meter.accountNumber]?.[month];
          // Only include data points where we have actual usage data
          // This creates gaps (holes) in the line for missing data
          if (monthUsage === undefined || monthUsage === null) {
            return {
              x: month,
              y: null, // null values create gaps in the line
            };
          }
          return {
            x: month,
            y: Math.max(0, monthUsage), // Keep zero values as valid data points
          };
        });

        return {
          id: meter.meter,
          data: series,
          totalUsage: meter.totalUsage,
          dailyAvg: meter.dailyAvg,
          amount: meter.amount,
          accountNumber: meter.accountNumber, // Include account number for tooltip
          meterLabel: meter.meterLabel, // Include meter label for tooltip
        };
      })
      .sort((a, b) => {
        // Sort chart data alphabetically by meter name
        const nameA = (a.id || '').toString().toLowerCase();
        const nameB = (b.id || '').toString().toLowerCase();
        return nameA.localeCompare(nameB);
      });
  };

  // Prepare data for bump chart when multiple months are selected
  const prepareBumpChartData = () => {
    if (selectedMonths.length <= 1) return [];

    const selectedMonthLabels = selectedMonths
      .map((monthKey) => {
        // monthKey is in MM/YYYY format
        const [month, year] = monthKey.split('/');
        const date = new Date(parseInt(year), parseInt(month) - 1, 1);
        return {
          monthKey,
          date,
          label: date.toLocaleString('default', { month: 'short' }),
        };
      })
      .sort((a, b) => a.date - b.date) // Sort by actual date, not month name
      .map((item) => item.label);

    const selectedMeterData = data.filter((row) => selectedMeters.includes(row.accountNumber));

    return selectedMeterData.map((meter) => {
      const series = selectedMonthLabels.map((month) => {
        const monthUsage = usageByMeterAndMonth[meter.accountNumber]?.[month] || 0;
        return {
          x: month,
          y: Math.max(0, monthUsage), // Use actual value, ensure no negatives
        };
      });

      return {
        id: meter.meter,
        data: series,
        totalUsage: meter.totalUsage,
        dailyAvg: meter.dailyAvg,
        amount: meter.amount,
      };
    });
  };

  const handleEdit = (row) => {
    setEditRow(row);
    setEditOpen(true);
  };

  const handleSave = async (updatedFields) => {
    if (!editRow) return;
    const pk = editRow.pk;

    // Check if sk is already in the correct format (contains # separators)
    // Expected format: 2801#cityofhotsprings#accountNumber
    const sk = editRow.sk.includes('#') ? editRow.sk : `2801#${utilityVendor}#${editRow.sk}`;

    const attributes = {
      meterLabel: updatedFields.meterLabel,
      units: updatedFields.units,
      bedrooms: updatedFields.bedrooms,
      squareFeet: updatedFields.squareFeet,
      bathrooms: updatedFields.bathrooms,
    };
    await updateUtilityMeterAccount(pk, sk, attributes);
    setEditOpen(false);
  };

  const handleMonthToggle = (monthKey) => {
    setSelectedMonths((prev) => {
      if (prev.includes(monthKey)) {
        return prev.filter((month) => month !== monthKey);
      } else {
        return [...prev, monthKey];
      }
    });
  };

  const handleSelectAllMonths = () => {
    setSelectedMonths(monthOptions.map((month) => month.key));
  };

  const handleClearAllMonths = () => {
    setSelectedMonths([]);
  };

  // Determine if we should show bump chart (multiple months selected)
  const shouldShowBumpChart = selectedMonths.length > 1;
  const bumpChartData = prepareBumpChartData();
  const lineChartData = prepareLineChartData(); // Store this for use in tooltip

  return (
    <div>
      {/* Month Filter Buttons */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid #f1f5f9',
          marginBottom: '24px',
        }}
      >
        <div style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600', color: '#374151' }}>Filter by Month</div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
          <button
            onClick={handleSelectAllMonths}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              background: selectedMonths.length === monthOptions.length ? '#3b82f6' : '#ffffff',
              color: selectedMonths.length === monthOptions.length ? '#ffffff' : '#374151',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (selectedMonths.length !== monthOptions.length) {
                e.target.style.background = '#f3f4f6';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedMonths.length !== monthOptions.length) {
                e.target.style.background = '#ffffff';
              }
            }}
          >
            Select All
          </button>
          <button
            onClick={handleClearAllMonths}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              background: selectedMonths.length === 0 ? '#3b82f6' : '#ffffff',
              color: selectedMonths.length === 0 ? '#ffffff' : '#374151',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (selectedMonths.length !== 0) {
                e.target.style.background = '#f3f4f6';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedMonths.length !== 0) {
                e.target.style.background = '#ffffff';
              }
            }}
          >
            Clear All
          </button>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {monthOptions.map((month) => (
            <button
              key={month.key}
              onClick={() => handleMonthToggle(month.key)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                background: selectedMonths.includes(month.key) ? '#3b82f6' : '#ffffff',
                color: selectedMonths.includes(month.key) ? '#ffffff' : '#374151',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!selectedMonths.includes(month.key)) {
                  e.target.style.background = '#f3f4f6';
                }
              }}
              onMouseLeave={(e) => {
                if (!selectedMonths.includes(month.key)) {
                  e.target.style.background = '#ffffff';
                }
              }}
            >
              {month.label}
            </button>
          ))}
        </div>
        {selectedMonths.length > 0 && (
          <div style={{ marginTop: '12px', fontSize: '14px', color: '#6b7280' }}>
            Selected: {selectedMonths.length} month{selectedMonths.length !== 1 ? 's' : ''}
            {shouldShowBumpChart && <span style={{ marginLeft: '8px', color: '#3b82f6', fontWeight: '500' }}>(Showing line chart)</span>}
          </div>
        )}
      </div>

      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid #f1f5f9',
          marginBottom: '24px',
        }}
      >
        <TableContainer component={Paper} sx={{ mb: 0, boxShadow: 'none' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <input
                    type="checkbox"
                    checked={selectedMeters.length === allAccountNumbers.length && allAccountNumbers.length > 0}
                    onChange={() => {
                      if (selectedMeters.length === allAccountNumbers.length) {
                        setSelectedMeters([]);
                      } else {
                        setSelectedMeters(allAccountNumbers);
                      }
                    }}
                  />
                </TableCell>
                <TableCell>Meter</TableCell>
                <TableCell align="right">Total Usage</TableCell>
                <TableCell align="right">Daily Avg</TableCell>
                <TableCell align="right">Field 1</TableCell>
                <TableCell align="right">Field 2</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(data) &&
                data.map((row) => (
                  <UsageTableRow
                    key={row.sk}
                    row={row}
                    onEdit={handleEdit}
                    isSelected={selectedMeters.includes(row.accountNumber)}
                    onSelect={() => {
                      setSelectedMeters((prev) => {
                        if (prev.includes(row.accountNumber)) {
                          return prev.filter((meter) => meter !== row.accountNumber);
                        } else {
                          return [...prev, row.accountNumber];
                        }
                      });
                    }}
                  />
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <EditMeterDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSave={handleSave}
        initialValues={editRow || { accountNumber: '', meterLabel: '', units: '', bedrooms: '', squareFeet: '' }}
      />

      {/* Chart Container */}
      <div
        style={{
          height: 450,
          background: '#ffffff',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid #f1f5f9',
        }}
      >
        {shouldShowBumpChart ? (
          <ResponsiveLine
            data={lineChartData}
            margin={{ top: 60, right: 120, bottom: 90, left: 90 }}
            xScale={{
              type: 'point',
            }}
            yScale={{
              type: 'linear',
              min: 0,
              max: 'auto',
            }}
            curve="linear"  // Change from "monotoneX" to "linear"
            lineWidth={3}
            pointSize={8}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            enablePoints={false}
            enablePointLabel={false}
            colors={{ scheme: 'nivo' }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Month',
              legendPosition: 'middle',
              legendOffset: 32,
              tickComponent: ({ value, ...props }) => (
                <text
                  {...props}
                  style={{
                    fontSize: '13px',
                    fontWeight: '500',
                    fill: '#64748b',
                    fontFamily: 'Inter, system-ui, sans-serif',
                  }}
                >
                  {value}
                </text>
              ),
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Water Usage (100s of Gallons)',
              legendPosition: 'middle',
              legendOffset: -70,
              tickComponent: ({ value, ...props }) => (
                <text
                  {...props}
                  style={{
                    fontSize: '13px',
                    fontWeight: '500',
                    fill: '#64748b',
                    fontFamily: 'Inter, system-ui, sans-serif',
                  }}
                >
                  {value.toLocaleString()}
                </text>
              ),
            }}
            gridYValues={6}
            gridColor="#f1f5f9"
            gridOpacity={1}
            useMesh={true}
            enableSlices="x"
            layers={[
              'grid',
              'markers',
              'axes',
              'areas',
              'crosshair',
              'lines',
              'slices',
              'mesh',
              ({ series, xScale, yScale }) => {
                // Custom layer to render points at all data locations
                return series.map((serie) => {
                  return (
                    <g key={serie.id}>
                      {serie.data.map((point, index) => {
                        // Only render points where we have actual data (not null)
                        if (point.data.y === null || point.data.y === undefined) return null;
                        
                        return (
                          <circle
                            key={`${serie.id}-${index}`}
                            cx={xScale(point.data.x)}
                            cy={yScale(point.data.y)}
                            r={5}
                            fill={serie.color}
                            stroke="#ffffff"
                            strokeWidth={2}
                            style={{ cursor: 'pointer' }}
                          />
                        );
                      })}
                    </g>
                  );
                });
              },
              'legends',
            ]}
            legends={[
              {
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemBackground: 'rgba(0, 0, 0, .03)',
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
            sliceTooltip={({ slice }) => {
              // Sort points by value (largest to smallest)
              const sortedPoints = [...slice.points].sort((a, b) => (b.data.y || 0) - (a.data.y || 0));

              // Get the month and add year - we can extract year from the selected months
              const monthName = slice.points[0]?.data.x;
              let monthWithYear = monthName;

              // Try to find the year from selected months
              if (selectedMonths.length > 0) {
                const monthKey = selectedMonths.find((key) => {
                  const [month, year] = key.split('/');
                  const date = new Date(parseInt(year), parseInt(month) - 1, 1);
                  const shortMonth = date.toLocaleString('default', { month: 'short' });
                  return shortMonth === monthName;
                });

                if (monthKey) {
                  const [month, year] = monthKey.split('/');
                  const date = new Date(parseInt(year), parseInt(month) - 1, 1);
                  const fullMonth = date.toLocaleString('default', { month: 'long' });
                  monthWithYear = `${fullMonth} ${year}`;
                }
              }

              return (
                <div
                  style={{
                    padding: '12px 16px',
                    background: '#1e293b',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    fontSize: '13px',
                    lineHeight: '1.4',
                    color: '#ffffff',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    maxWidth: '250px',
                    minWidth: '180px',
                    zIndex: 1000,
                  }}
                >
                  <div
                    style={{
                      fontWeight: '600',
                      fontSize: '14px',
                      marginBottom: '8px',
                      color: '#ffffff',
                      textAlign: 'center',
                    }}
                  >
                    {monthWithYear}
                  </div>
                  {sortedPoints.map((point) => {
                    // Clean up building name - remove everything after the letter
                    let buildingName = point.id || 'Unknown Building';

                    // Extract just "Building X" part (remove .1, .0, etc.)
                    const match = buildingName.match(/Building\s+[A-Z]/i);
                    if (match) {
                      buildingName = match[0];
                    }

                    return (
                      <div
                        key={point.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: '4px',
                          alignItems: 'center',
                          gap: '12px',
                        }}
                      >
                        <span
                          style={{
                            color: '#94a3b8',
                            fontSize: '12px',
                            flexShrink: 0,
                          }}
                        >
                          {buildingName}:
                        </span>
                        <span
                          style={{
                            fontWeight: '500',
                            color: '#ffffff',
                            fontSize: '12px',
                            textAlign: 'right',
                          }}
                        >
                          {point.data.y?.toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            }}
            animate={true}
            motionStiffness={100}
            motionDamping={15}
            theme={{
              axis: {
                domain: {
                  line: {
                    stroke: '#e2e8f0',
                    strokeWidth: 1,
                  },
                },
                ticks: {
                  line: {
                    stroke: '#e2e8f0',
                    strokeWidth: 1,
                  },
                },
              },
              grid: {
                line: {
                  stroke: '#f1f5f9',
                  strokeWidth: 1,
                },
              },
            }}
          />
        ) : (
          <ResponsiveBar
            data={Array.isArray(data) ? data.filter((row) => selectedMeters.includes(row.accountNumber)) : []}
            keys={['usage']}
            indexBy="meter"
            margin={{ top: 60, right: 120, bottom: 90, left: 90 }}
            padding={0.5}
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            colors="#3b82f6"
            borderColor="#1d4ed8"
            borderWidth={0}
            borderRadius={2}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 0,
              tickPadding: 12,
              tickRotation: -30,
              legend: 'Water Meters',
              legendPosition: 'middle',
              legendOffset: 70,
              tickComponent: ({ value, ...props }) => (
                <text
                  {...props}
                  style={{
                    fontSize: '13px',
                    fontWeight: '500',
                    fill: '#64748b',
                    fontFamily: 'Inter, system-ui, sans-serif',
                  }}
                >
                  {value}
                </text>
              ),
            }}
            axisLeft={{
              tickSize: 0,
              tickPadding: 12,
              tickRotation: 0,
              legend: 'Water Usage (100s of Gallons)',
              legendPosition: 'middle',
              legendOffset: -70,
              tickComponent: ({ value, ...props }) => (
                <text
                  {...props}
                  style={{
                    fontSize: '13px',
                    fontWeight: '500',
                    fill: '#64748b',
                    fontFamily: 'Inter, system-ui, sans-serif',
                  }}
                >
                  {value.toLocaleString()}
                </text>
              ),
            }}
            gridYValues={6}
            gridColor="#f1f5f9"
            gridOpacity={1}
            tooltip={({ id, value, data }) => (
              <div
                style={{
                  padding: '16px',
                  background: '#1e293b',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  color: '#ffffff',
                  fontFamily: 'Inter, system-ui, sans-serif',
                }}
              >
                <div
                  style={{
                    fontWeight: '600',
                    fontSize: '15px',
                    marginBottom: '12px',
                    color: '#ffffff',
                  }}
                >
                  {data.meter}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#94a3b8' }}>Usage:</span>
                  <span style={{ fontWeight: '500', color: '#ffffff' }}>{data.totalUsage?.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#94a3b8' }}>Average:</span>
                  <span style={{ fontWeight: '500', color: '#ffffff' }}>{data.dailyAvg?.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Cost:</span>
                  <span style={{ fontWeight: '500', color: '#10b981' }}>${data.amount?.toLocaleString()}</span>
                </div>
              </div>
            )}
            labelSkipWidth={20}
            labelSkipHeight={20}
            labelTextColor="#ffffff"
            label={(d) => d.value?.toLocaleString()}
            animate={true}
            motionStiffness={100}
            motionDamping={15}
            enableLabel={true}
            labelComponent={({ value, ...props }) => (
              <text
                {...props}
                style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  fontFamily: 'Inter, system-ui, sans-serif',
                }}
              >
                {value?.toLocaleString()}
              </text>
            )}
            theme={{
              axis: {
                domain: {
                  line: {
                    stroke: '#e2e8f0',
                    strokeWidth: 1,
                  },
                },
                ticks: {
                  line: {
                    stroke: '#e2e8f0',
                    strokeWidth: 1,
                  },
                },
              },
              grid: {
                line: {
                  stroke: '#f1f5f9',
                  strokeWidth: 1,
                },
              },
              legends: {
                text: {
                  fontSize: 13,
                  fontWeight: 500,
                  fill: '#64748b',
                  fontFamily: 'Inter, system-ui, sans-serif',
                },
              },
            }}
          />
        )}
      </div>
    </div>
  );
}
