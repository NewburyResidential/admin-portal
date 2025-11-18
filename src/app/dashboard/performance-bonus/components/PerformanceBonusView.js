'use client';

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { Search, Close, EmojiEvents } from '@mui/icons-material';

// Professional data structure
const performanceData = [
  {
    id: 1,
    rank: 1,
    property: 'The Overlook at Ashland',
    location: 'Ashland City, TN',
    q1Bonus: 50,
    q2Bonus: 75,
    q3Bonus: 75,
    q4Bonus: null,
    isTopPerformer: true,
  },
  {
    id: 2,
    rank: 2,
    property: '2100 Springport',
    location: 'Jackson, MI',
    q1Bonus: 25,
    q2Bonus: 50,
    q3Bonus: 75,
    q4Bonus: null,
    isTopPerformer: false,
  },
  {
    id: 3,
    rank: 3,
    property: 'Meadows of Lebanon',
    location: 'Lebanon, TN',
    q1Bonus: 25,
    q2Bonus: 50,
    q3Bonus: 50,
    q4Bonus: null,
    isTopPerformer: false,
  },
  {
    id: 4,
    rank: 4,
    property: 'Beason Well Apartments',
    location: 'Kingsport, TN',
    q1Bonus: 0,
    q2Bonus: 50,
    q3Bonus: 30,
    q4Bonus: null,
    isTopPerformer: false,
  },
  {
    id: 5,
    rank: 5,
    property: 'Edge at 1010',
    location: 'Lansing, MI',
    q1Bonus: 0,
    q2Bonus: 25,
    q3Bonus: 25,
    q4Bonus: null,
    isTopPerformer: false,
  },
];

const PerformanceBonusView = () => {
  const [selectedProperty, setSelectedProperty] = useState(null);

  const getBonusStyle = (bonus, isTopPerformer = false) => {
    let baseStyle;
    
    if (bonus >= 75) {
      baseStyle = { bgcolor: '#66bb6a', color: 'white' }; // Green for 75%+
    } else if (bonus >= 50) {
      baseStyle = { bgcolor: '#ffb74d', color: 'white' }; // Orange for 50-74%
    } else if (bonus >= 1) {
      baseStyle = { bgcolor: '#ef5350', color: 'white' }; // Red for 1-49%
    } else {
      baseStyle = { bgcolor: '#ef5350', color: 'white' }; // Red for 0% too
    }

    // Add subtle gold border for top performer, but keep the main colors
    if (isTopPerformer) {
      baseStyle.border = '2px solid #ffc107';
      baseStyle.boxShadow = '0 0 0 1px rgba(255, 193, 7, 0.2)';
    }

    return baseStyle;
  };

  const handleQuarterClick = (property, quarter, bonus) => {
    console.log(`Viewing details for ${quarter} - ${property.property}: ${bonus}%`);
  };

  return (
    <Box sx={{ bgcolor: '#fafafa', minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 500, mb: 1, color: '#212121' }}>
            Property Performance Dashboard
          </Typography>
          <Typography variant="body1" sx={{ color: '#757575', fontSize: '1rem' }}>
            Quarterly Performance Bonus Analysis • 2025
          </Typography>
        </Box>

        {/* Summary Statistics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Card elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="h3" sx={{ fontWeight: 300, color: '#424242', mb: 1 }}>
                  {performanceData.length}
                </Typography>
                <Typography variant="body2" sx={{ color: '#757575', textTransform: 'uppercase', letterSpacing: 1.5, fontSize: '0.75rem' }}>
                  Properties
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="h3" sx={{ fontWeight: 300, color: '#66bb6a', mb: 1 }}>
                  {performanceData.filter((p) => p.q3Bonus >= 75).length}
                </Typography>
                <Typography variant="body2" sx={{ color: '#757575', textTransform: 'uppercase', letterSpacing: 1.5, fontSize: '0.75rem' }}>
                  Excellent
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="h3" sx={{ fontWeight: 300, color: '#ffb74d', mb: 1 }}>
                  {Math.round(performanceData.reduce((acc, p) => acc + (p.q3Bonus || 0), 0) / performanceData.length)}%
                </Typography>
                <Typography variant="body2" sx={{ color: '#757575', textTransform: 'uppercase', letterSpacing: 1.5, fontSize: '0.75rem' }}>
                  Average
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="h3" sx={{ fontWeight: 300, color: '#616161', mb: 1 }}>
                  Q3
                </Typography>
                <Typography variant="body2" sx={{ color: '#757575', textTransform: 'uppercase', letterSpacing: 1.5, fontSize: '0.75rem' }}>
                  Current
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Performance Table */}
        <Card elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
          <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
            <Typography variant="h6" sx={{ fontWeight: 500, color: '#212121', mb: 0.5 }}>
              Performance Rankings
            </Typography>
            <Typography variant="body2" sx={{ color: '#757575' }}>
              Click on any performance indicator to view detailed metrics
            </Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 500, fontSize: '0.875rem', color: '#616161', py: 2.5, border: 0 }}>Rank</TableCell>
                  <TableCell sx={{ fontWeight: 500, fontSize: '0.875rem', color: '#616161', py: 2.5, border: 0 }}>Property Name</TableCell>
                  <TableCell sx={{ fontWeight: 500, fontSize: '0.875rem', color: '#616161', py: 2.5, border: 0 }}>Location</TableCell>
                  <TableCell sx={{ fontWeight: 500, fontSize: '0.875rem', color: '#616161', py: 2.5, textAlign: 'center', border: 0 }}>
                    Q1 2025
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500, fontSize: '0.875rem', color: '#616161', py: 2.5, textAlign: 'center', border: 0 }}>
                    Q2 2025
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500, fontSize: '0.875rem', color: '#616161', py: 2.5, textAlign: 'center', border: 0 }}>
                    Q3 2025
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500, fontSize: '0.875rem', color: '#616161', py: 2.5, textAlign: 'center', border: 0 }}>
                    Q4 2025
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {performanceData.map((property, index) => (
                  <TableRow
                    key={property.id}
                    sx={{
                      '&:hover': { bgcolor: '#f9f9f9' },
                      bgcolor: property.rank === 1 ? '#fffbf0' : 'white',
                      borderBottom: '1px solid #f0f0f0',
                    }}
                  >
                    <TableCell sx={{ py: 3, border: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: property.rank === 1 ? 600 : 400,
                            fontSize: '0.95rem',
                            color: property.rank === 1 ? '#ff8f00' : '#424242',
                          }}
                        >
                          {property.rank}
                        </Typography>
                        {property.rank === 1 && <EmojiEvents sx={{ color: '#ff8f00', fontSize: 18 }} />}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 3, border: 0 }}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: property.rank === 1 ? 600 : 500,
                          fontSize: '0.875rem',
                          color: property.rank === 1 ? '#ff8f00' : '#212121',
                          lineHeight: 1.4,
                        }}
                      >
                        {property.property}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 3, border: 0 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#757575',
                          fontSize: '0.875rem',
                        }}
                      >
                        {property.location}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center', py: 3, border: 0 }}>
                      <Box
                        onClick={() => handleQuarterClick(property, 'Q1', property.q1Bonus)}
                        sx={{
                          ...getBonusStyle(property.q1Bonus, property.rank === 1),
                          px: 1.5,
                          py: 0.75,
                          borderRadius: 0.5,
                          fontWeight: 500,
                          fontSize: '0.8rem',
                          minWidth: 70,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 0.75,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          '&:hover': {
                            transform: 'translateY(-1px)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                            opacity: 0.9,
                          },
                        }}
                      >
                        {property.q1Bonus}%
                        <Search sx={{ fontSize: 11 }} />
                      </Box>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center', py: 3, border: 0 }}>
                      <Box
                        onClick={() => handleQuarterClick(property, 'Q2', property.q2Bonus)}
                        sx={{
                          ...getBonusStyle(property.q2Bonus, property.rank === 1),
                          px: 1.5,
                          py: 0.75,
                          borderRadius: 0.5,
                          fontWeight: 500,
                          fontSize: '0.8rem',
                          minWidth: 70,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 0.75,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          '&:hover': {
                            transform: 'translateY(-1px)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                            opacity: 0.9,
                          },
                        }}
                      >
                        {property.q2Bonus}%
                        <Search sx={{ fontSize: 11 }} />
                      </Box>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center', py: 3, border: 0 }}>
                      <Box
                        onClick={() => handleQuarterClick(property, 'Q3', property.q3Bonus)}
                        sx={{
                          ...getBonusStyle(property.q3Bonus, property.rank === 1),
                          px: 1.5,
                          py: 0.75,
                          borderRadius: 0.5,
                          fontWeight: 500,
                          fontSize: '0.8rem',
                          minWidth: 70,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 0.75,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          '&:hover': {
                            transform: 'translateY(-1px)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                            opacity: 0.9,
                          },
                        }}
                      >
                        {property.q3Bonus}%
                        <Search sx={{ fontSize: 11 }} />
                      </Box>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center', py: 3, border: 0 }}>
                      <Box
                        sx={{
                          bgcolor: '#f5f5f5',
                          color: '#9e9e9e',
                          px: 1.5,
                          py: 0.75,
                          borderRadius: 0.5,
                          fontWeight: 500,
                          fontSize: '0.8rem',
                          minWidth: 70,
                          display: 'inline-block',
                          border: '1px solid #e0e0e0',
                        }}
                      >
                        TBD
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* Property Details Dialog */}
        <Dialog open={!!selectedProperty} onClose={() => setSelectedProperty(null)} maxWidth="md" fullWidth>
          {selectedProperty && (
            <>
              <DialogTitle sx={{ pb: 2, borderBottom: '1px solid #e0e0e0' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 500, color: selectedProperty.rank === 1 ? '#ff8f00' : '#212121' }}>
                    {selectedProperty.property}
                    {selectedProperty.rank === 1 && <EmojiEvents sx={{ color: '#ff8f00', fontSize: 20, ml: 1 }} />}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#757575', mt: 0.5 }}>
                  {selectedProperty.location} • Ranked #{selectedProperty.rank}
                </Typography>
              </DialogTitle>
              <DialogContent sx={{ pt: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 3, fontWeight: 500, color: '#424242' }}>
                  Quarterly Performance Overview
                </Typography>
                <Grid container spacing={2}>
                  {[
                    { quarter: 'Q1 2025', bonus: selectedProperty.q1Bonus },
                    { quarter: 'Q2 2025', bonus: selectedProperty.q2Bonus },
                    { quarter: 'Q3 2025', bonus: selectedProperty.q3Bonus },
                    { quarter: 'Q4 2025', bonus: selectedProperty.q4Bonus },
                  ].map((item, index) => (
                    <Grid item xs={3} key={index}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2.5,
                          textAlign: 'center',
                          border: '1px solid #e0e0e0',
                          borderRadius: 0.5,
                          ...(item.bonus !== null
                            ? getBonusStyle(item.bonus, selectedProperty.rank === 1)
                            : { bgcolor: '#f5f5f5', color: '#9e9e9e' }),
                          cursor: item.bonus !== null ? 'pointer' : 'default',
                          transition: 'all 0.15s ease',
                          '&:hover':
                            item.bonus !== null
                              ? {
                                  transform: 'translateY(-1px)',
                                  boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                                }
                              : {},
                        }}
                        onClick={() => item.bonus !== null && handleQuarterClick(selectedProperty, item.quarter, item.bonus)}
                      >
                        <Typography variant="h5" sx={{ fontWeight: 400, mb: 1 }}>
                          {item.bonus !== null ? `${item.bonus}%` : 'TBD'}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.75rem', opacity: 0.8 }}>
                          {item.quarter}
                        </Typography>
                        {item.bonus !== null && <Search sx={{ fontSize: 12, mt: 1, opacity: 0.7 }} />}
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </DialogContent>
              <Divider />
              <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={() => setSelectedProperty(null)} variant="outlined" sx={{ textTransform: 'none' }}>
                  Close
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Container>
    </Box>
  );
};

export default PerformanceBonusView;
