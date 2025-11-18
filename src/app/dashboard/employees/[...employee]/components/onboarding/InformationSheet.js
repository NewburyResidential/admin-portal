'use client';

import React, { useState, useMemo } from 'react';
import { Box, Button, Paper, Typography, Chip, Divider } from '@mui/material';
import {
  Print as PrintIcon,
  PhoneAndroid as PhoneAndroidIcon,
  Computer as ComputerIcon,
  Apartment as ApartmentIcon,
  ShoppingCart as ShoppingCartIcon,
  ContentCopy as ContentCopyIcon,
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
    categories[category].push({ ...request, type: 'access' });
  });

  // Add size selections
  sizeSelections.forEach((selection) => {
    const category = selection.category;
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push({ ...selection, type: 'size', followUpConfiguration: { selectedSize: selection.size } });
  });

  return categories;
};

// Updated print styles for multi-page support with better page break controls
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
      min-height: 100vh !important;
      max-height: 100vh !important;
      padding: 0.5in !important;
      box-sizing: border-box !important;
      page-break-after: always !important;
      position: relative !important;
      overflow: hidden !important;
    }
    
    .page-container:last-child {
      page-break-after: avoid !important;
    }
    
    .page-content {
      height: calc(100vh - 1in) !important;
      overflow: hidden !important;
      display: flex !important;
      flex-direction: column !important;
    }
    
    .page-header {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
    
    .page-footer {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
      margin-top: auto !important;
    }
    
    .section-container {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
    
    .section-container.allow-break {
      page-break-inside: auto !important;
      break-inside: auto !important;
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
    
    /* Prevent orphaned content */
    .orphan-control {
      orphans: 3 !important;
      widows: 3 !important;
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
        return new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
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
            return new Date(dateValue).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
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

// Helper function to format phone number
const formatPhoneNumber = (phone) => {
  if (!phone) return 'Not specified';
  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  // Format as XXX-XXX-XXXX
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  // If not 10 digits, return original
  return phone;
};

// Header component for reuse on each page
const PageHeader = ({ isFirstPage = false, employee, formattedData }) => (
  <Box sx={{ mb: 2 }}>
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
          sx={{ fontSize: isFirstPage ? '38px' : '24px', whiteSpace: 'nowrap', textDecoration: 'underline' }}
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
        Generated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} by Newbury Residential,
        Inc
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
        <strong>Phone Number:</strong> {formatPhoneNumber(getEmployeeValue(employee, 'personalPhone'))}
      </Typography>
      <Typography sx={{ mb: 1, fontSize: '12px' }}>
        <strong>Job Title:</strong>{' '}
        {formattedData.position ? findPositionLabel(formattedData.position) : getEmployeeValue(employee, 'jobTitle')}
      </Typography>
      <Typography sx={{ mb: 2, fontSize: '12px' }}>
        <strong>Supervisor:</strong> {getEmployeeValue(employee, 'supervisor')}
      </Typography>

      {/* Information Note */}
      <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1, border: '1px solid #e0e0e0' }}>
        <Typography sx={{ fontSize: '11px', fontStyle: 'italic', color: '#555' }}>
          <strong>Note:</strong> Below is a comprehensive list of your access to Newbury applications, systems, and properties. If you are
          switching properties or believe anything is missing, please submit a support ticket at www.NewburyPortal.com.
        </Typography>
      </Box>
    </Box>
  </Box>
);

const PaylocitySection = () => {
  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ fontSize: '16px', color: '#333', borderBottom: '2px solid #7f7f7f', pb: 0.5, mr: 2 }}
        >
          Step 1: Complete Paylocity Onboarding
        </Typography>
      </Box>

      <Box sx={{ ml: 0 }}>
        {/* Step description */}
        <Typography sx={{ fontSize: '11px', mb: 2, lineHeight: 1.4, color: '#555' }}>
          You should have received an email from do-not-reply@paylocity.com with instructions to begin your onboarding. This email includes
          your username and a temporary password. Please log in using those credentials to complete your onboarding steps.
        </Typography>

        <Typography sx={{ fontSize: '11px', mb: 2, lineHeight: 1.4, color: '#555' }}>
          If you have already created your account, your login information should look like the example below. If you run into any issues or
          need a password reset, please don&apos;t hesitate to reach out to us at Recruiting@newburyresidential.com.
        </Typography>

        {/* Login information */}
        <Box sx={{ mb: 2 }}>
          <Typography sx={{ fontSize: '11px', mb: 0.25, lineHeight: 1.4 }}>
            <strong>Login URL:</strong> https://onboarding.paylocity.com/onboarding/
          </Typography>
          <Typography sx={{ fontSize: '11px', mb: 0.25, lineHeight: 1.4 }}>
            <strong>Company ID:</strong> 319245
          </Typography>
          <Typography sx={{ fontSize: '11px', mb: 0.25, lineHeight: 1.4 }}>
            <strong>Username:</strong> Firstname.Lastname
          </Typography>
          <Typography sx={{ fontSize: '11px', mb: 0.25, lineHeight: 1.4 }}>
            <strong>Password:</strong> [created by you]
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

const EmailSection = ({ formattedData, employee }) => {
  const sharedEmails = generateSharedEmails(formattedData);
  const hasOffice365 = formattedData.accessRequests?.some((req) => req.itemId === 'office_365');

  // Determine role type for shared email text
  const roleType = getRoleType(formattedData.position);

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ fontSize: '16px', color: '#333', borderBottom: '2px solid #7f7f7f', pb: 0.5, mr: 2 }}
        >
          Step 2: Email & Newbury Portal
        </Typography>
      </Box>

      <Box sx={{ ml: 0 }}>
        {/* Two-column layout: left content, right QR code */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mb: 2 }}>
          {/* Left column - all content */}
          <Box sx={{ flex: 1 }}>
            {/* Step description */}
            <Typography sx={{ fontSize: '11px', mb: 2, lineHeight: 1.4, color: '#555' }}>
              {hasOffice365
                ? 'Your Newbury Email will be used for your login usernames and access work related mail. In addition, anywhere you see Single Sign-On (SSO) such as Entrata or Paylocity, you can use your Newbury email to sign you in. The NewburyPortal serves as your central hub for all Newbury-related resources and information!'
                : 'Your Newbury email will be used for login purposes only and does not have an associated mailbox. You can also use this email for Single Sign-On (SSO) applications such as Entrata or Paylocity. If prompted for a domain, enter "newburyresidential."'}
            </Typography>

            {/* Credentials info */}
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ fontSize: '11px', mb: 0.25, lineHeight: 1.4 }}>
                <strong>Microsoft Email:</strong> {getEmployeeValue(employee, 'workEmail')}
              </Typography>
              <Typography sx={{ fontSize: '11px', mb: 0.25, lineHeight: 1.4 }}>
                <strong>Temporary Password:</strong> {employee?.onboarding?.tempPassword || ''}
              </Typography>
            </Box>
          </Box>

          {/* Right column - QR code only */}
          <Box sx={{ flexShrink: 0 }}>
            <img
              src="/assets/onboarding/Newburyportal.png"
              alt="Newbury Portal QR Code"
              style={{ width: '90px', height: '90px', objectFit: 'contain', border: '1px solid #e0e0e0', borderRadius: '9px' }}
            />
          </Box>
        </Box>

        {/* First checklist item - QR code scan */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
            <Box sx={{ width: '16px', height: '16px', border: '2px solid #ccc', borderRadius: '2px', mr: 1, mt: 0.25, flexShrink: 0 }} />
            <Typography sx={{ fontSize: '11px', lineHeight: 1.4 }}>
              Scan the QR code to go to www.newburyportal.com. Sign in with the above credentials and it will prompt you to set up a new
              password and phone authentication.
            </Typography>
          </Box>
        </Box>

        {/* Second checklist item - Bookmark for quick access */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
            <Box sx={{ width: '16px', height: '16px', border: '2px solid #ccc', borderRadius: '2px', mr: 1, mt: 0.25, flexShrink: 0 }} />
            <Typography sx={{ fontSize: '11px', lineHeight: 1.4 }}>
              For quick access, bookmark/save the Newbury Portal to your home screen.
            </Typography>
          </Box>

          {/* Images side by side */}
          <Box sx={{ display: 'flex', gap: 2, ml: 2, mt: 1 }}>
            <img
              src="/assets/onboarding/step1a.jpeg"
              alt="Desktop bookmarking guide"
              style={{ width: '250px', height: '100px', objectFit: 'cover', border: '1px solid #e0e0e0', borderRadius: '4px' }}
            />
            <img
              src="/assets/onboarding/step1b.jpeg"
              alt="Mobile home screen guide"
              style={{ width: '250px', height: '100px', objectFit: 'cover', border: '1px solid #e0e0e0', borderRadius: '4px' }}
            />
          </Box>

          {/* Third checklist item - Outlook app setup */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1, mt: 2 }}>
            <Box sx={{ width: '16px', height: '16px', border: '2px solid #ccc', borderRadius: '2px', mr: 1, mt: 0.25, flexShrink: 0 }} />
            <Typography sx={{ fontSize: '11px', lineHeight: 1.4 }}>
              Download the Outlook app on your phone. Click &quot;Add Accounts&quot;, Click &quot;Skip&quot; if your personal accounts show.
              And then sign in to your email with your updated password.
            </Typography>
          </Box>
        </Box>

        {/* Shared Email Groups - Updated to checkbox format with role-specific text */}
        {sharedEmails.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
              <Box sx={{ width: '16px', height: '16px', border: '2px solid #ccc', borderRadius: '2px', mr: 1, mt: 0.25, flexShrink: 0 }} />
              <Typography sx={{ fontSize: '11px', lineHeight: 1.4 }}>
                {roleType === 'maintenance'
                  ? `You have access to the following shared email inboxes: [${sharedEmails.join(', ')}]. Note that these emails will be directly forwarded to your work email: ${getEmployeeValue(employee, 'workEmail')}.`
                  : `You have access to the following shared email inboxes: [${sharedEmails.join(', ')}]. You will need to manually add the inboxes in your Outlook mobile app by clicking "Add Shared Mailbox". They will automatically appear in the desktop version. To send from these accounts, you will need to add the shared email address to the "From" field. Reach out to your supervisor if you experience any issues.`}
              </Typography>
            </Box>
          </Box>
        )}
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

      <Box sx={{ ml: 0, display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'flex-start' }}>
        {formattedData.properties.map((property, index) => (
          <Chip
            key={`property-${property.id || property.label}-${index}`}
            label={property.label}
            size="small"
            variant="outlined"
            sx={{
              fontSize: '10px',
              height: 'auto',
              minHeight: '24px',
              '& .MuiChip-label': { fontSize: '10px', lineHeight: 1.3, padding: '4px 8px' },
              borderColor: '#e0e0e0',
              '&:hover': { backgroundColor: '#f5f5f5' },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

const AccessRequestsCategorySection = ({ category, items }) => {
  // Helper function to get description for each category
  const getCategoryDescription = (categoryName) => {
    switch (categoryName) {
      case 'System and Software Access':
        return 'Company websites, systems, and software used for daily operations.';
      case 'Procurement Accounts':
        return 'Company accounts for purchasing supplies, equipment, and services';
      default:
        return '';
    }
  };

  const description = getCategoryDescription(category);

  return (
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

      {description && <Typography sx={{ fontSize: '11px', fontStyle: 'italic', color: '#666', mb: 2, ml: 0 }}>{description}</Typography>}

      {category === 'System and Software Access' || category === 'Procurement Accounts' ? (
        <Box sx={{ ml: 0, display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'flex-start' }}>
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
                  '& .MuiChip-label': { fontSize: '10px', lineHeight: 1.3, padding: '4px 8px' },
                  borderColor: '#e0e0e0',
                  '&:hover': { backgroundColor: '#f5f5f5' },
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
};

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

      <Box sx={{ ml: 0, display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'flex-start' }}>
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
              '& .MuiChip-label': { fontSize: '10px', lineHeight: 1.3, padding: '4px 8px' },
              borderColor: '#e0e0e0',
              '&:hover': { backgroundColor: '#f5f5f5' },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

const BenefitsSection = () => {
  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ fontSize: '16px', color: '#333', borderBottom: '2px solid #7f7f7f', pb: 0.5, mr: 2 }}
        >
          Step 4: Enroll or Deny Benefits
        </Typography>
      </Box>

      <Box sx={{ ml: 0 }}>
        {/* Step description */}
        <Typography sx={{ fontSize: '11px', mb: 2, lineHeight: 1.4, color: '#555' }}>
          We offer a comprehensive health package for Medical, Dental and Vision. You must{' '}
          <span style={{ textDecoration: 'underline' }}>either enroll or deny each coverage</span>. You will receive an email sometime
          during your first week of employment. Please try and complete this as soon as possible.
        </Typography>

        {/* Checklist item */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
            <Box sx={{ width: '16px', height: '16px', border: '2px solid #ccc', borderRadius: '2px', mr: 1, mt: 0.25, flexShrink: 0 }} />
            <Typography sx={{ fontSize: '11px', lineHeight: 1.4 }}>Enroll or Deny coverage from Lumity</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const AccessAccountsSection = ({ formattedData, employee }) => {
  const hasKeeper = formattedData.accessRequests?.some((req) => req.itemId === 'keeper');

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ fontSize: '16px', color: '#333', borderBottom: '2px solid #7f7f7f', pb: 0.5, mr: 2 }}
        >
          Step 5: Access Accounts & Software
        </Typography>
      </Box>

      <Box sx={{ ml: 0 }}>
        {/* Step description - different text based on whether Keeper is selected */}
        <Typography
          sx={{ fontSize: '11px', mb: 2, lineHeight: 1.4, color: '#555' }}
          dangerouslySetInnerHTML={{
            __html: hasKeeper
              ? "Accounts have been created for you across the following platforms. We use a password management tool called Keeper to store and organize all your login credentials, making it much easier to access the websites and systems you'll need for work. You can use Keeper on your phone, computer, or web. <strong>Please familiarize yourself with this application.</strong>"
              : 'Accounts have been created for you across the following platforms. A registration email has been sent to your Microsoft work email for each account. Please complete your registration as soon as possible, as the links will expire. If you need a reminder of where or how to log in, please visit the Newbury Portal.',
          }}
        />

        {/* Keeper setup instructions - only if Keeper is selected */}
        {hasKeeper && (
          <Box sx={{ mb: 2 }}>
            {/* Mobile setup */}
            <Box sx={{ mb: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                <Box
                  sx={{ width: '16px', height: '16px', border: '2px solid #ccc', borderRadius: '2px', mr: 1, mt: 0.25, flexShrink: 0 }}
                />
                <Typography sx={{ fontSize: '11px', lineHeight: 1.4 }}>
                  Download the Keeper app on your phone. Click &quot;Log In&quot;. Click &quot;Use Enterprise SSO Login&quot;
                </Typography>
              </Box>
            </Box>

            {/* Computer setup */}
            <Box sx={{ mb: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                <Box
                  sx={{ width: '16px', height: '16px', border: '2px solid #ccc', borderRadius: '2px', mr: 1, mt: 0.25, flexShrink: 0 }}
                />
                <Typography sx={{ fontSize: '11px', lineHeight: 1.4 }}>
                  Access Keeper at https://keepersecurity.com/vault/# click &quot;Log In&quot; Enter your email address and click
                  &quot;Next&quot;
                </Typography>
              </Box>
            </Box>

            {/* Chrome extension setup */}
            <Box sx={{ mb: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                <Box
                  sx={{ width: '16px', height: '16px', border: '2px solid #ccc', borderRadius: '2px', mr: 1, mt: 0.25, flexShrink: 0 }}
                />
                <Typography sx={{ fontSize: '11px', lineHeight: 1.4 }}>
                  Download the Keeper Chrome extension at https://chromewebstore.google.com/
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

// Helper function to determine role type (office vs maintenance)
const getRoleType = (positionId) => {
  const officeRoles = ['community_manager', 'assistant_manager', 'leasing_agent'];
  const maintenanceRoles = ['maintenance_supervisor', 'maintenance_technician', 'carpenter_make_ready', 'painter', 'lead_carpenter'];

  if (officeRoles.includes(positionId)) {
    return 'office';
  } else if (maintenanceRoles.includes(positionId)) {
    return 'maintenance';
  }
  return 'unknown';
};

const EntrataSection = ({ formattedData, employee }) => {
  // Check if Entrata is selected
  const hasEntrata = formattedData.accessRequests?.some((req) => req.itemId === 'entrata');

  // Don't render the section if Entrata is not selected
  if (!hasEntrata) return null;

  // Determine role type based on position
  const roleType = getRoleType(formattedData.position);

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ fontSize: '16px', color: '#333', borderBottom: '2px solid #7f7f7f', pb: 0.5, mr: 2 }}
        >
          Step 3: Entrata
        </Typography>
      </Box>

      <Box sx={{ ml: 0 }}>
        {/* Step description */}
        <Typography sx={{ fontSize: '11px', mb: 2, lineHeight: 1.4, color: '#555' }}>
          Entrata is our property management software for daily property operations. Please make sure you can access and bookmark these
          items.
        </Typography>

        {/* Web or Mobile Browser - Always shown */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Box sx={{ width: '16px', height: '16px', border: '2px solid #ccc', borderRadius: '2px', mr: 1, flexShrink: 0 }} />
            <Typography sx={{ fontSize: '12px', color: '#333' }}>Web or Mobile Browser:</Typography>
          </Box>
          <Box sx={{ ml: 2 }}>
            <Typography sx={{ fontSize: '11px', mb: 0.25, lineHeight: 1.4 }}>
              • Log into https://newburyresidential.entrata.com and use &quot;SSO Login&quot; to sign in.
            </Typography>
          </Box>
        </Box>

        {/* Entrata Facilities App - Only for maintenance roles */}
        {roleType === 'maintenance' && (
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box sx={{ width: '16px', height: '16px', border: '2px solid #ccc', borderRadius: '2px', mr: 1, flexShrink: 0 }} />
              <Typography sx={{ fontSize: '12px', color: '#333' }}>Entrata Facilities (Mobile App):</Typography>
            </Box>
            <Box sx={{ ml: 2 }}>
              <Typography sx={{ fontSize: '11px', mb: 0.25, lineHeight: 1.4 }}>
                <strong>Subdomain:</strong> newburyresidential
              </Typography>
              <Typography sx={{ fontSize: '11px', mb: 0.25, lineHeight: 1.4 }}>
                <strong>Username:</strong> {getEmployeeValue(employee, 'workEmail')}
              </Typography>
              <Typography sx={{ fontSize: '11px', mb: 0.25, lineHeight: 1.4 }}>
                • Click the checkbox for Terms & Conditions and then click &quot;Saml Login&quot;
              </Typography>
            </Box>
          </Box>
        )}

        {/* DocScan - Only for office roles */}
        {roleType === 'office' && (
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box sx={{ width: '16px', height: '16px', border: '2px solid #ccc', borderRadius: '2px', mr: 1, flexShrink: 0 }} />
              <Typography sx={{ fontSize: '12px', color: '#333' }}>DocScan (Desktop App):</Typography>
            </Box>
            <Box sx={{ ml: 2 }}>
              <Typography sx={{ fontSize: '11px', mb: 0.25, lineHeight: 1.4 }}>
                <strong>Subdomain:</strong> newburyresidential
              </Typography>
              <Typography sx={{ fontSize: '11px', mb: 0.25, lineHeight: 1.4 }}>
                <strong>Username:</strong> {getEmployeeValue(employee, 'workEmail')}
              </Typography>
              <Typography sx={{ fontSize: '11px', mb: 0.25, lineHeight: 1.4 }}>
                <strong>Password:</strong> [Microsoft Password]
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

// Multi-page Document component with improved pagination
const DocumentView = React.forwardRef(({ formattedData, employee }, ref) => {
  const groupedRequests = groupAccessRequestsByCategory(formattedData.accessRequests || [], formattedData.sizeSelections || []);

  // Calculate content sections with more accurate height estimates
  const sections = useMemo(() => {
    const sectionsArray = [];

    // Core sections that always appear
    sectionsArray.push({
      id: 'employee-details',
      component: EmployeeDetailsSection,
      height: 180,
      allowBreak: false,
    });
    sectionsArray.push({
      id: 'paylocity',
      component: PaylocitySection,
      height: 200,
      allowBreak: false,
    });
    sectionsArray.push({
      id: 'email',
      component: EmailSection,
      height: 250,
      allowBreak: false,
    });

    // Conditional Entrata section - only if Entrata is selected
    const hasEntrata = formattedData.accessRequests?.some((req) => req.itemId === 'entrata');
    if (hasEntrata) {
      sectionsArray.push({
        id: 'entrata',
        component: EntrataSection,
        height: 220,
        allowBreak: false,
      });
    }

    // Benefits section - always appears
    sectionsArray.push({
      id: 'benefits',
      component: BenefitsSection,
      height: 140,
      allowBreak: false,
    });

    // Access Accounts section - always appears (now includes Keeper setup if selected)
    const hasKeeper = formattedData.accessRequests?.some((req) => req.itemId === 'keeper');
    sectionsArray.push({
      id: 'access-accounts',
      component: AccessAccountsSection,
      height: hasKeeper ? 200 : 100, // Increased height when Keeper is included
      allowBreak: false,
    });

    // Optional sections
    if (formattedData.properties && formattedData.properties.length > 0) {
      sectionsArray.push({
        id: 'properties',
        component: PropertiesSection,
        height: 80 + Math.ceil(formattedData.properties.length / 6) * 30,
        allowBreak: false,
      });
    }

    // Access request categories (excluding PPE)
    Object.entries(groupedRequests)
      .filter(([category]) => category !== 'Personal Protective Equipment and Uniforms')
      .forEach(([category, items]) => {
        // More accurate height estimation
        let estimatedHeight = 80; // Base height for header
        if (category === 'System and Software Access' || category === 'Procurement Accounts') {
          estimatedHeight += Math.ceil(items.length / 5) * 35; // Chips layout
        } else {
          estimatedHeight += items.length * 50; // List layout with more space
        }

        sectionsArray.push({
          id: `category-${category}`,
          component: AccessRequestsCategorySection,
          height: estimatedHeight,
          allowBreak: true, // Allow breaks for long category lists
          props: { category, items },
        });
      });

    // Mobile apps section
    if (formattedData.mobileApps && formattedData.mobileApps.length > 0) {
      sectionsArray.push({
        id: 'mobile-apps',
        component: MobileAppsSection,
        height: 100 + Math.ceil(formattedData.mobileApps.length / 5) * 30,
        allowBreak: false,
      });
    }

    return sectionsArray;
  }, [formattedData, groupedRequests]);

  // Improved pagination with better space management
  const pages = useMemo(() => {
    const pagesArray = [];
    let currentPage = [];
    let currentPageHeight = 0;
    const maxPageHeight = 800;
    const firstPageMaxHeight = 0;

    sections.forEach((section, index) => {
      const isFirstPage = pagesArray.length === 0 && currentPage.length === 0;
      const pageLimit = isFirstPage ? firstPageMaxHeight : maxPageHeight;

      // Force a new page when we reach the "access-accounts" section (Step 5)
      if (section.id === 'access-accounts' && currentPage.length > 0) {
        pagesArray.push([...currentPage]);
        currentPage = [section];
        currentPageHeight = section.height;
      }
      // If adding this section would exceed the page limit, start a new page
      else if (currentPageHeight + section.height > pageLimit && currentPage.length > 0) {
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
              overflow: 'hidden',
            },
          }}
        >
          <Box className="page-content">
            <Box className="page-header">
              <PageHeader isFirstPage={pageIndex === 0} employee={employee} formattedData={formattedData} />
            </Box>

            {/* Content area */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {pageSections.map((section, sectionIndex) => {
                const Component = section.component;
                return (
                  <Box
                    key={`${section.id}-${pageIndex}-${sectionIndex}`}
                    className={`section-container ${section.allowBreak ? 'allow-break' : ''}`}
                    sx={{
                      pageBreakInside: section.allowBreak ? 'auto' : 'avoid',
                      breakInside: section.allowBreak ? 'auto' : 'avoid',
                    }}
                  >
                    <Component formattedData={formattedData} employee={employee} {...(section.props || {})} />
                  </Box>
                );
              })}
            </Box>

            <Box className="page-footer">
              <PageFooter pageNumber={pageIndex + 1} totalPages={pages.length} />
            </Box>
          </Box>
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
    // Check if password is set
    const tempPassword = employee?.onboarding?.tempPassword;
    if (!tempPassword || tempPassword.trim().length === 0) {
      alert('Warning: Please set a temporary password for the employee before generating the PDF.');
      return;
    }

    setIsPrinting(true);

    // Set the document title to include employee name and "Information Sheet"
    const employeeName = getEmployeeValue(employee, 'fullName');
    const formattedName = employeeName ? employeeName.toLowerCase().replace(/\s+/g, '.') : 'employee';
    const originalTitle = document.title;
    document.title = `${formattedName}.information.sheet`;

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

      // Restore original document title
      document.title = originalTitle;

      // If this is in email mode, show email dialog after print
      if (showEmailOption && onEmailAfterPrint) {
        setTimeout(() => {
          onEmailAfterPrint();
        }, 500);
      }
    }, 1000);
  };

  const handleCopyText = () => {
    const employeeName = getEmployeeValue(employee, 'fullName');
    const formattedName = employeeName ? employeeName.toLowerCase().replace(/\s+/g, '.') : 'employee';
    const textToCopy = `${formattedName} Information Sheet`;
    navigator.clipboard.writeText(textToCopy).then(() => {});
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

        {/* Copy Text Bubble */}
        <Box
          onClick={handleCopyText}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            p: 1.5,
            bgcolor: 'grey.100',
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'grey.300',
            cursor: 'pointer',
            userSelect: 'none',
            '&:hover': {
              bgcolor: 'grey.200',
            },
          }}
        >
          <Typography variant="body2" sx={{ fontSize: '14px' }}>
            {(() => {
              const employeeName = getEmployeeValue(employee, 'fullName');
              const formattedName = employeeName ? employeeName.toLowerCase().replace(/\s+/g, '.') : 'employee';
              return `${formattedName} Information Sheet`;
            })()}
          </Typography>
          <ContentCopyIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
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
