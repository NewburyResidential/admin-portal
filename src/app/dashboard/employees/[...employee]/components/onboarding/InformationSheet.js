'use client';

import React, { useState, useMemo } from 'react';
import { Box, Button, Paper, Typography, Chip, Divider } from '@mui/material';
import {
  Print as PrintIcon,
  PhoneAndroid as PhoneAndroidIcon,
  Computer as ComputerIcon,
  Apartment as ApartmentIcon,
  Key as KeyIcon,
  ShoppingCart as ShoppingCartIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import dayjs from 'dayjs';

// Helper function to find position label
const findPositionLabel = (positionId) => {
  const positions = [
    { id: 'community_manager', label: 'Community Manager' },
    { id: 'assistant_manager', label: 'Assistant Manager' },
    { id: 'leasing_agent', label: 'Leasing Agent' },
    { id: 'maintenance_supervisor', label: 'Maintenance Supervisor' },
    { id: 'maintenance_technician', label: 'Maintenance Technician' },
    { id: 'carpenter_make_ready', label: 'Carpenter and Make Ready Technician' },
    { id: 'painter', label: 'Painter' },
    { id: 'lead_carpenter', label: 'Lead Carpenter' },
  ];

  return positions.find((p) => p.id === positionId)?.label || positionId;
};

// Helper function to format follow-up data
const formatFollowUpData = (followUpData, itemId) => {
  if (!followUpData) return '';

  if (itemId === 'entrata') {
    return followUpData.selectedRoles?.map((role) => role.label).join(', ') || '';
  }

  if (itemId === 'notify_hellospoke') {
    return followUpData.selectedAccessType?.label || '';
  }

  if (itemId === 'lowes' || itemId === 'credit_card') {
    if (followUpData.selectedLimit?.value === 'custom') {
      return `Custom: $${followUpData.customAmount}`;
    }
    return followUpData.selectedLimit?.label || '';
  }

  if (itemId === 'glove_size' || itemId === 'shirt_size') {
    return followUpData.selectedSize?.label || '';
  }

  if (itemId === 'shared_email_groups') {
    return followUpData.selectedEmailGroups?.map((email) => email.label).join(', ') || '';
  }

  return '';
};

// Helper function to generate shared email addresses
const generateSharedEmails = (formattedData) => {
  // Find shared email groups configuration
  const sharedEmailRequest = formattedData.accessRequests?.find((req) => req.itemId === 'shared_email_groups');
  if (!sharedEmailRequest?.followUpConfiguration?.selectedEmailGroups) {
    return [];
  }

  const selectedEmailTypes = sharedEmailRequest.followUpConfiguration.selectedEmailGroups;
  const properties = formattedData.properties || [];
  const emails = [];

  // For each property, generate emails for selected types
  properties.forEach((property) => {
    if (property.domain) {
      selectedEmailTypes.forEach((emailType) => {
        let emailPrefix = '';
        switch (emailType.value) {
          case 'leasing_email':
            emailPrefix = 'leasing';
            break;
          case 'maintenance_email':
            emailPrefix = 'maintenance';
            break;
          case 'manager_email':
            emailPrefix = 'manager';
            break;
        }
        if (emailPrefix) {
          emails.push(`${emailPrefix}@${property.domain}`);
        }
      });
    }
  });

  return emails;
};

// Helper function to group access requests by category
const groupAccessRequestsByCategory = (accessRequests, sizeSelections) => {
  const categories = {};

  // Add access requests
  accessRequests.forEach((request) => {
    const category = request.category;
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push({
      ...request,
      type: 'access',
    });
  });

  // Add size selections
  sizeSelections.forEach((selection) => {
    const category = selection.category;
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push({
      ...selection,
      type: 'size',
      followUpConfiguration: { selectedSize: selection.size },
    });
  });

  return categories;
};

// Updated print styles for multi-page support
const printStyles = `
  @media print {
    @page {
      size: letter;
      margin: 0;
    }
    
    body * {
      visibility: hidden;
    }
    
    .printable-document, .printable-document * {
      visibility: visible;
    }
    
    .printable-document {
      position: absolute;
      left: 0;
      top: 0;
      width: 100% !important;
      height: auto !important;
      max-width: none !important;
      box-shadow: none !important;
      margin: 0 !important;
      padding: 0 !important;
    }
    
    .no-print {
      display: none !important;
    }
    
    .page-container {
      width: 100% !important;
      height: 100vh !important;
      padding: 32px !important;
      box-sizing: border-box !important;
      page-break-after: always !important;
      position: relative !important;
    }
    
    .page-container:last-child {
      page-break-after: avoid !important;
    }
    
    /* Ensure corners reach absolute edges on each page */
    .corner-triangle-top-left {
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      border-left: 140px solid #7f7f7f !important;
      border-bottom: 140px solid transparent !important;
      opacity: 0.9 !important;
    }
    
    .corner-triangle-bottom-right {
      position: absolute !important;
      bottom: 0 !important;
      right: 0 !important;
      border-right: 90px solid #7f7f7f !important;
      border-top: 90px solid transparent !important;
      opacity: 0.9 !important;
    }
  }
`;

// Helper function to safely access employee data with new structure
const getEmployeeValue = (employee, field) => {
  if (!employee) return null;

  // Check if the field is in the onboarding object
  if (employee.onboarding && employee.onboarding[field]) {
    const value = employee.onboarding[field];

    // Format expectedHireDate as string
    if (field === 'expectedHireDate' && value) {
      try {
        return new Date(value).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      } catch (error) {
        return value; // Return original value if parsing fails
      }
    }

    return value;
  }

  // Check if employee has the new nested structure with DynamoDB-style attributes
  if (employee.expectedHireDate && typeof employee.expectedHireDate === 'object') {
    // New structure with DynamoDB-style attributes
    switch (field) {
      case 'fullName':
        return employee.fullName?.S || employee.fullName || 'New Employee';
      case 'jobTitle':
        return employee.jobTitle?.S || employee.jobTitle || 'Community Manager';
      case 'workEmail':
        return employee.workEmail?.S || employee.workEmail || 'Not specified';
      case 'personalEmail':
        return employee.personalEmail?.S || employee.personalEmail || 'Not specified';
      case 'personalPhone':
        return employee.personalPhone?.S || employee.personalPhone || 'Not specified';
      case 'compensation':
        return employee.compensation?.S || employee.compensation || 'Not specified';
      case 'supervisor':
        return employee.supervisor?.S || employee.supervisor || 'Not specified';
      case 'expectedHireDate': {
        const dateValue = employee.expectedHireDate?.S || employee.expectedHireDate;
        if (dateValue) {
          try {
            return new Date(dateValue).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            });
          } catch (error) {
            return dateValue;
          }
        }
        return 'Not specified';
      }
      default:
        return employee[field]?.S || employee[field] || 'Not specified';
    }
  }

  // Fallback to direct access for backward compatibility
  return employee[field] || 'Not specified';
};

// Header component for reuse on each page
const PageHeader = ({ isFirstPage = false, employee, formattedData }) => (
  <Box sx={{ mb: isFirstPage ? 5 : 3 }}>
    {/* Corner triangles */}
    <Box
      className="corner-triangle-top-left"
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        borderLeft: '140px solid #7f7f7f',
        borderBottom: '140px solid transparent',
        opacity: 0.9,
      }}
    />
    <Box
      className="corner-triangle-bottom-right"
      sx={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 0,
        height: 0,
        borderRight: '90px solid #7f7f7f',
        borderTop: '90px solid transparent',
        opacity: 0.9,
      }}
    />

    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <Box sx={{ flex: 1 }} />

      <Box sx={{ textAlign: 'center', flex: 1, mt: isFirstPage ? 4 : 2 }}>
        <Typography
          variant="h3"
          fontWeight="bold"
          sx={{
            fontSize: isFirstPage ? '38px' : '24px',
            whiteSpace: 'nowrap',
            textDecoration: 'underline',
          }}
        >
          Employee Information Sheet
        </Typography>
        {!isFirstPage && (
          <Typography sx={{ fontSize: '12px', mt: 1, color: '#666' }}>
            {getEmployeeValue(employee, 'fullName')} -{' '}
            {formattedData.position ? findPositionLabel(formattedData.position) : getEmployeeValue(employee, 'jobTitle')}
          </Typography>
        )}
      </Box>

      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', pr: 2 }}>
        <img src="/favicon/android-chrome-512x512.png" alt="Newbury Logo" style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
      </Box>
    </Box>
  </Box>
);

// Footer component for reuse on each page
const PageFooter = ({ pageNumber, totalPages }) => (
  <Box sx={{ mt: 'auto', pt: 2 }}>
    <Divider sx={{ mb: 1, borderColor: '#ccc', mr: 6.5 }} />
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mr: 7 }}>
      <Typography sx={{ fontSize: '9px', color: '#888' }}>
        Generated on{' '}
        {new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}{' '}
        by Newbury Residential, Inc
      </Typography>
      <Typography sx={{ fontSize: '9px', color: '#888' }}>
        Page {pageNumber} of {totalPages}
      </Typography>
    </Box>
  </Box>
);

// Individual section components
const EmployeeDetailsSection = ({ formattedData, employee }) => (
  <Box sx={{ mb: 3 }}>
    <Box sx={{ ml: 0 }}>
      <Typography sx={{ mb: 1, fontSize: '12px' }}>
        <strong>Employee Name:</strong> {getEmployeeValue(employee, 'fullName')}
      </Typography>
      <Typography sx={{ mb: 1, fontSize: '12px' }}>
        <strong>Job Title:</strong>{' '}
        {formattedData.position ? findPositionLabel(formattedData.position) : getEmployeeValue(employee, 'jobTitle')}
      </Typography>
      <Typography sx={{ mb: 2, fontSize: '12px' }}>
        <strong>Supervisor:</strong> {getEmployeeValue(employee, 'supervisor')}
      </Typography>

      <Typography sx={{ mb: 1, fontSize: '12px' }}>
        <strong>Start Date and Time:</strong>{' '}
        {formattedData.startDateTime ? dayjs(formattedData.startDateTime).format('dddd, MMMM D, YYYY [at] h:mm A') : 'Not specified'}
      </Typography>
      <Typography sx={{ mb: 1, fontSize: '12px' }}>
        <strong>Address to Start:</strong>{' '}
        {formattedData.deliveryAddress ? (
          <>
            {formattedData.deliveryAddress.label}
            {formattedData.deliveryAddress.address && (
              <>
                {' - '}
                {formattedData.deliveryAddress.address.street && `${formattedData.deliveryAddress.address.street}, `}
                {formattedData.deliveryAddress.address.city}, {formattedData.deliveryAddress.address.state}{' '}
                {formattedData.deliveryAddress.address.zip}
              </>
            )}
          </>
        ) : (
          'Not specified'
        )}
      </Typography>

      {/* Information Note */}
      <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1, border: '1px solid #e0e0e0' }}>
        <Typography sx={{ fontSize: '11px', fontStyle: 'italic', color: '#555' }}>
          <strong>Note:</strong> Below is a comprehensive list of your access to Newbury applications, systems, and properties. If you are
          switching properties or believe anything is missing, please submit a support ticket at www.NewburyPortal.com. The NewburyPortal
          serves as your central hub for all Newbury-related resources and information!
        </Typography>
      </Box>
    </Box>
  </Box>
);

const EmailSection = ({ formattedData, employee }) => {
  const sharedEmails = generateSharedEmails(formattedData);

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <EmailIcon sx={{ fontSize: '16px', color: '#666' }} />
        <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '14px' }}>
          Email
        </Typography>
      </Box>

      <Box sx={{ ml: 0 }}>
        {(() => {
          const hasOffice365 = formattedData.accessRequests?.some((req) => req.itemId === 'office_365');

          return (
            <Typography sx={{ fontSize: '11px', mb: 2, lineHeight: 1.4 }}>
              {hasOffice365
                ? 'Your Newbury Email will be used for your login usernames and access any work related mail. In addition, anywhere you see Single Sign-On (SSO) such as Entrata or Paylocity, you can use your Newbury email to sign you in. If it asks for a domain use "newburyresidential".'
                : 'Your Newbury email will be used for login purposes only and does not have an associated mailbox. You can also use this email for Single Sign-On (SSO) applications such as Entrata or Paylocity. If prompted for a domain, enter "newburyresidential."'}
            </Typography>
          );
        })()}

        <Typography sx={{ fontSize: '11px', mb: 1 }}>
          <strong>Domain:</strong> newburyresidential
        </Typography>

        <Typography sx={{ fontSize: '11px', mb: 1 }}>
          <strong>Microsoft Email:</strong> {getEmployeeValue(employee, 'workEmail')}
        </Typography>

        <Typography sx={{ fontSize: '11px', mb: 2 }}>
          <strong>Temporary Password:</strong> rainy-horror-jon!
        </Typography>

        {/* Shared Email Groups */}
        {sharedEmails.length > 0 && (
          <>
            <Typography sx={{ fontSize: '11px', mb: 1, lineHeight: 1.4 }}>
              You have access to the following shared email inboxes. You may need to manually add the inboxes in Outlook in addition to your
              work email. To send from these accounts, you will need to add the shared email address to the &quot;From&quot; field. Reach
              out to your supervisor if you experience any issues.
            </Typography>

            <Box sx={{ ml: 1, mb: 1 }}>
              {sharedEmails.map((email, index) => (
                <Typography key={`shared-email-${email}-${index}`} sx={{ fontSize: '11px', mb: 0.25 }}>
                  • {email}
                </Typography>
              ))}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

const PasswordsSection = ({ formattedData }) => {
  // Check if Keeper is selected
  const hasKeeper = formattedData.accessRequests?.some((req) => req.itemId === 'keeper');

  // Don't render the section if Keeper is not selected
  if (!hasKeeper) return null;

  return (
    <Box sx={{ mb: 3 }}>
      {/* Entire section with QR code on the right */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
        {/* Left side - All content */}
        <Box sx={{ flex: 1 }}>
          {/* Title */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <KeyIcon sx={{ fontSize: '16px', color: '#666' }} />
            <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '14px' }}>
              Passwords and Logins
            </Typography>
          </Box>

          {/* Description */}
          <Box sx={{ ml: 0 }}>
            <Typography sx={{ fontSize: '11px', mb: 2, lineHeight: 1.4 }}>
              We use a password management tool called Keeper to store and organize all your login credentials, making it much easier to
              access the websites and systems you&apos;ll need for work. You can use Keeper on your phone, computer, or web. Either scan the
              QR code or go to KeeperSecurity.com and &quot;Use Enterprise SSO Login&quot;.
              <strong> Please familiarize yourself with this application</strong>
            </Typography>
          </Box>
        </Box>

        {/* Right side - QR Code spanning full height */}
        <Box sx={{ flexShrink: 0, alignSelf: 'stretch', display: 'flex', alignItems: 'center' }}>
          <img
            src="/assets/onboarding/keeper-url.png"
            alt="Keeper URL QR Code"
            style={{
              width: '85px',
              height: '85px',
              objectFit: 'contain',
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

const PropertiesSection = ({ formattedData }) => {
  if (!formattedData.properties || formattedData.properties.length === 0) return null;

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <ApartmentIcon sx={{ fontSize: '16px', color: '#666' }} />
        <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '14px' }}>
          Property Access
        </Typography>
      </Box>

      <Box
        sx={{
          ml: 0,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          alignItems: 'flex-start',
        }}
      >
        {formattedData.properties.map((property, index) => (
          <Chip
            key={`property-${property.label}-${index}`}
            label={property.label}
            size="small"
            variant="outlined"
            sx={{
              fontSize: '10px',
              height: 'auto',
              minHeight: '24px',
              '& .MuiChip-label': {
                fontSize: '10px',
                lineHeight: 1.3,
                padding: '4px 8px',
              },
              borderColor: '#e0e0e0',
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

const AccessRequestsCategorySection = ({ category, items }) => (
  <Box sx={{ mb: 3 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
      {category === 'System and Software Access' && <ComputerIcon sx={{ fontSize: '16px', color: '#666' }} />}
      {category === 'Procurement Accounts' && <ShoppingCartIcon sx={{ fontSize: '16px', color: '#666' }} />}
      <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '14px' }}>
        {category === 'System and Software Access'
          ? 'System and Software Access'
          : category === 'Procurement Accounts'
            ? 'Procurement Accounts'
            : category.toUpperCase()}
      </Typography>
    </Box>

    {category === 'System and Software Access' || category === 'Procurement Accounts' ? (
      <Box
        sx={{
          ml: 0,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          alignItems: 'flex-start',
        }}
      >
        {items.map((item, index) => {
          // For procurement accounts, include credit limit in the label
          let chipLabel = item.employeeLabel || item.label;

          if (item.itemId === 'shared_email_groups') {
            return null; // Fix: return null instead of undefined
          }

          return (
            <Chip
              key={`access-item-${item.itemId || item.label}-${index}`}
              label={chipLabel}
              size="small"
              variant="outlined"
              sx={{
                fontSize: '10px',
                height: 'auto',
                minHeight: '24px',
                '& .MuiChip-label': {
                  fontSize: '10px',
                  lineHeight: 1.3,
                  padding: '4px 8px',
                },
                borderColor: '#e0e0e0',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                },
              }}
            />
          );
        })}
      </Box>
    ) : (
      <Box sx={{ ml: 2 }}>
        {items.map((item, index) => (
          <Box key={`access-detail-${item.itemId || item.label}-${index}`} sx={{ mb: 1.5 }}>
            {/* Main label */}
            <Typography sx={{ fontSize: '11px', mb: 0.5, fontWeight: 'medium' }}>• {item.employeeLabel || item.label}</Typography>

            {/* URL and Login info - displayed on separate lines with indentation */}
            {(item.url || item.loginLabel) && (
              <Box sx={{ ml: 2, mb: 0.5 }}>
                {item.url && (
                  <Typography sx={{ fontSize: '10px', color: '#555', mb: 0.25 }}>
                    <strong>URL:</strong> {item.url}
                  </Typography>
                )}
                {item.loginLabel && (
                  <Typography sx={{ fontSize: '10px', color: '#555', mb: 0.25 }}>
                    <strong>Login:</strong> {item.loginLabel}
                  </Typography>
                )}
              </Box>
            )}

            {/* Configuration info */}
            {item.followUpConfiguration && (
              <Typography sx={{ fontSize: '10px', color: '#666', ml: 2 }}>
                {item.type === 'size'
                  ? `Size: ${item.size.label}`
                  : formatFollowUpData(item.followUpConfiguration, item.itemId) &&
                    `Configuration: ${formatFollowUpData(item.followUpConfiguration, item.itemId)}`}
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    )}
  </Box>
);

const MobileAppsSection = ({ formattedData }) => {
  if (!formattedData.mobileApps || formattedData.mobileApps.length === 0) return null;

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <PhoneAndroidIcon sx={{ fontSize: '16px', color: '#666' }} />
        <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '14px' }}>
          Mobile Apps{' '}
        </Typography>
      </Box>

      <Typography sx={{ fontSize: '11px', fontStyle: 'italic', color: '#666', mb: 2, ml: 0 }}>
        Download these apps on your mobile device to streamline your workflow. We recommend creating a &quot;Newbury Apps&quot; folder to
        keep all work-related applications organized and easily accessible.
      </Typography>

      <Box
        sx={{
          ml: 0,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          alignItems: 'flex-start',
        }}
      >
        {formattedData.mobileApps.map((app, index) => (
          <Chip
            key={`mobile-app-${app}-${index}`}
            label={app}
            size="small"
            variant="outlined"
            sx={{
              fontSize: '10px',
              height: 'auto',
              minHeight: '24px',
              '& .MuiChip-label': {
                fontSize: '10px',
                lineHeight: 1.3,
                padding: '4px 8px',
              },
              borderColor: '#e0e0e0',
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

// Multi-page Document component
const DocumentView = React.forwardRef(({ formattedData, employee }, ref) => {
  const groupedRequests = groupAccessRequestsByCategory(formattedData.accessRequests || [], formattedData.sizeSelections || []);

  // Calculate content sections and their estimated heights for pagination
  const sections = useMemo(() => {
    const sectionsArray = [];

    // Core sections that always appear
    sectionsArray.push({ id: 'employee-details', component: EmployeeDetailsSection, height: 200 });
    sectionsArray.push({ id: 'email', component: EmailSection, height: 180 });

    // Conditional passwords section - only if Keeper is selected
    const hasKeeper = formattedData.accessRequests?.some((req) => req.itemId === 'keeper');
    if (hasKeeper) {
      sectionsArray.push({ id: 'passwords', component: PasswordsSection, height: 160 });
    }

    // Optional sections
    if (formattedData.properties && formattedData.properties.length > 0) {
      sectionsArray.push({ id: 'properties', component: PropertiesSection, height: 100 });
    }

    // Access request categories (excluding PPE)
    Object.entries(groupedRequests)
      .filter(([category]) => category !== 'Personal Protective Equipment and Uniforms')
      .forEach(([category, items]) => {
        // Estimate height based on category type and number of items
        let estimatedHeight = 120; // Base height for header
        if (category === 'System and Software Access' || category === 'Procurement Accounts') {
          estimatedHeight += Math.ceil(items.length / 4) * 30; // Chips layout
        } else {
          estimatedHeight += items.length * 45; // List layout
        }

        sectionsArray.push({
          id: `category-${category}`,
          component: AccessRequestsCategorySection,
          height: estimatedHeight,
          props: { category, items },
        });
      });

    // Mobile apps section
    if (formattedData.mobileApps && formattedData.mobileApps.length > 0) {
      sectionsArray.push({ id: 'mobile-apps', component: MobileAppsSection, height: 120 });
    }

    return sectionsArray;
  }, [formattedData, groupedRequests]);

  // Paginate sections based on available space
  const pages = useMemo(() => {
    const pagesArray = [];
    let currentPage = [];
    let currentPageHeight = 0;
    const maxPageHeight = 850;
    const firstPageMaxHeight = 850;

    sections.forEach((section, index) => {
      const isFirstPage = pagesArray.length === 0 && currentPage.length === 0;
      const pageLimit = isFirstPage ? firstPageMaxHeight : maxPageHeight;

      // If adding this section would exceed the page limit, start a new page
      if (currentPageHeight + section.height > pageLimit && currentPage.length > 0) {
        pagesArray.push([...currentPage]);
        currentPage = [section];
        currentPageHeight = section.height;
      } else {
        currentPage.push(section);
        currentPageHeight += section.height;
      }
    });

    // Add the last page if it has content
    if (currentPage.length > 0) {
      pagesArray.push(currentPage);
    }

    return pagesArray;
  }, [sections]);

  return (
    <Box ref={ref} className="printable-document">
      {pages.map((pageSections, pageIndex) => (
        <Box
          key={`page-${pageIndex}`}
          className="page-container"
          sx={{
            width: '8.5in',
            minHeight: '11in',
            bgcolor: 'white',
            p: 4,
            fontFamily: '"Helvetica", "Arial", sans-serif',
            fontSize: '11px',
            lineHeight: 1.4,
            position: 'relative',
            mx: 'auto',
            mb: pageIndex < pages.length - 1 ? 2 : 0,
            boxShadow: '0 0 20px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            '@media print': {
              boxShadow: 'none',
              width: '100%',
              height: '100vh',
              mb: 0,
            },
          }}
        >
          <PageHeader isFirstPage={pageIndex === 0} employee={employee} formattedData={formattedData} />

          {/* Content area */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {pageSections.map((section) => {
              const Component = section.component;
              return <Component key={section.id} formattedData={formattedData} employee={employee} {...(section.props || {})} />;
            })}

            {/* Spacer to push footer to bottom */}
            <Box sx={{ flex: 1 }} />
          </Box>

          <PageFooter pageNumber={pageIndex + 1} totalPages={pages.length} />
        </Box>
      ))}
    </Box>
  );
});

DocumentView.displayName = 'DocumentView';

// Main Information Sheet Component
const InformationSheet = ({ formattedData, employee, onClose, onEmailAfterPrint, showEmailOption = false }) => {
  const [_isPrinting, setIsPrinting] = useState(false);

  const handlePrintPDF = () => {
    setIsPrinting(true);

    // Add print styles to the document
    const styleElement = document.createElement('style');
    styleElement.textContent = printStyles;
    document.head.appendChild(styleElement);

    // Open print dialog
    window.print();

    // Clean up after a delay
    setTimeout(() => {
      document.head.removeChild(styleElement);
      setIsPrinting(false);

      // If this is in email mode, show email dialog after print
      if (showEmailOption && onEmailAfterPrint) {
        setTimeout(() => {
          onEmailAfterPrint();
        }, 500);
      }
    }, 1000);
  };

  return (
    <Box sx={{ maxWidth: 'lg', mx: 'auto', p: 3 }}>
      {/* Controls */}
      <Paper className="no-print" sx={{ p: 3, mb: 3, bgcolor: 'primary.50' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" fontWeight="bold">
            {showEmailOption ? 'Generate PDF & Email' : 'Information Sheet Preview'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {onClose && (
              <Button variant="outlined" onClick={onClose}>
                Back to Form
              </Button>
            )}
            <Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrintPDF} size="large">
              Save as PDF
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Document Preview */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <DocumentView formattedData={formattedData} employee={employee} />
      </Box>
    </Box>
  );
};

export default InformationSheet;
