import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Checkbox,
  TextField,
  Chip,
  Grid,
  Button,
  Paper,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  CheckCircle as CheckCircleIcon,
  ContentCopy as ContentCopyIcon,
  Email as EmailIcon,
  Warning as WarningIcon,
  CalendarMonth as CalendarMonthIcon,
  Send as SendIcon,
  OpenInNew as OpenInNewIcon,
  Mail as MailIcon, // Add this import for the email icon
} from '@mui/icons-material';
import dayjs from 'dayjs';
import InformationSheet from './InformationSheet';
import cancelOnboardingTeamsMeeting from 'src/utils/services/employees/cancel-onboarding-teams-meeting';
import updateOnboardingTeamsMeeting from 'src/utils/services/employees/update-onboarding-teams-meeting';
import updateEmployee from 'src/utils/services/employees/update-employee';
import TeamsInviteDialog from './TeamsInviteDialog';
import { ACCESS_STATES, CHECKLIST_DATA, findItemDetails, getPositionPreset } from './checklist-data';
import AutocompleteSelectEmployees from 'src/components/form-inputs/common/AutocompleteSelectEmployees';
import { sendOnboardingRemindEmail } from 'src/utils/services/employees/sendOnboardingRemindEmail';
import { LoadingButton } from '@mui/lab';
import { sendOnboardingPermissionsSaved } from 'src/utils/services/employees/sendOnboardingPermissionsSaved';
import { s3GetSignedUrl } from 'src/utils/services/sdk-config/aws/S3';

// Position card component for single selection - PILL STYLE
const PositionCard = ({ item, isSelected, onSelect }) => {
  return (
    <Box
      onClick={() => onSelect(item.id)}
      sx={{
        cursor: 'pointer',
        px: 2,
        py: 1,
        borderRadius: 25,
        border: '2px solid',
        borderColor: isSelected ? 'primary.main' : 'grey.300',
        bgcolor: isSelected ? 'primary.main' : 'transparent',
        color: isSelected ? 'white' : 'text.primary',
        transition: 'all 0.3s ease',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        '&:hover': {
          borderColor: 'primary.main',
          bgcolor: isSelected ? 'primary.dark' : 'primary.lighter',
          transform: 'translateY(-1px)',
        },
      }}
    >
      {isSelected && <CheckCircleIcon sx={{ fontSize: 18 }} />}
      <Typography
        variant="body2"
        fontWeight={isSelected ? 'bold' : 'medium'}
        sx={{
          fontSize: '0.875rem',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {item.label}
      </Typography>
    </Box>
  );
};

// Properties section component - WITH DELIVERY ADDRESS AND START DATE
const PropertiesSection = ({ title, control, newburyAssets, hasScheduledMeeting, handleTimeChange, handleTimeAccept, handleTimeClose }) => {
  const propertyOptions = newburyAssets?.filter((asset) => asset.category === 'Properties') || [];

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight="bold">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Selected properties will be automatically associated with all applicable access accounts
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Controller
            name="selectedProperties"
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <Autocomplete
                multiple
                value={field.value || []}
                onChange={(event, newValue) => field.onChange(newValue)}
                options={propertyOptions}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                disableCloseOnSelect={true}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Properties For Access"
                    placeholder={field.value && field.value.length > 0 ? '' : 'Search properties...'}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        minHeight: 80,
                        padding: 2,
                      },
                    }}
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => {
                    const { key, onDelete, ...tagProps } = getTagProps({ index });
                    return (
                      <Box
                        key={key}
                        onClick={onDelete}
                        {...tagProps}
                        sx={{
                          cursor: 'pointer',
                          px: 1.5,
                          py: 0.75,
                          borderRadius: 20,
                          border: '2px solid',
                          borderColor: 'primary.main',
                          bgcolor: 'primary.main',
                          color: 'white',
                          transition: 'all 0.3s ease',
                          textAlign: 'center',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 0.5,
                          m: 0.3,
                          '&:hover': {
                            borderColor: 'success.dark',
                            bgcolor: 'primary.dark',
                            transform: 'translateY(-1px)',
                          },
                        }}
                      >
                        <CheckCircleIcon sx={{ fontSize: 16 }} />
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          sx={{
                            fontSize: '0.8rem',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: 180,
                          }}
                        >
                          {option.label}
                        </Typography>
                      </Box>
                    );
                  })
                }
                renderOption={(props, option) => (
                  <Box component="li" {...props} key={option.id} sx={{ py: 1.5 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <Typography variant="body2" fontWeight="medium">
                        {option.label}
                      </Typography>
                      {option.address && (
                        <Typography variant="caption" color="text.secondary">
                          {option.address.city}, {option.address.state}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                )}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    flexWrap: 'wrap',
                    gap: 1,
                    '& .MuiAutocomplete-tag': {
                      margin: 0,
                    },
                    '& .MuiAutocomplete-input': {
                      minWidth: 200,
                      flexGrow: 1,
                      margin: 0.5,
                    },
                  },
                }}
              />
            )}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            First Week Start & Delivery Address for PPE, Shirts, P-Cards & Physical Items
          </Typography>
          <Controller
            name="selectedDeliveryAddress"
            control={control}
            render={({ field }) => (
              <Autocomplete
                value={field.value || null}
                onChange={(event, newValue) => field.onChange(newValue)}
                options={propertyOptions}
                getOptionLabel={(option) => option.label || ''}
                isOptionEqualToValue={(option, value) => option?.id === value?.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Property for Start & Delivery"
                    placeholder="Search properties..."
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        minHeight: 56,
                      },
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props} key={option.id} sx={{ py: 1.5 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <Typography variant="body2" fontWeight="medium">
                        {option.label}
                      </Typography>
                      {option.address && (
                        <Typography variant="caption" color="text.secondary">
                          {option.address.street && `${option.address.street}, `}
                          {option.address.city}, {option.address.state} {option.address.zip}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                )}
              />
            )}
          />
        </Box>

        {/* Start Date and Time - Full width */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Employee Start Date & Time
            </Typography>
            {hasScheduledMeeting && (
              <Chip
                label="Added to Calendar"
                size="small"
                color="success"
                variant="outlined"
                icon={<CalendarMonthIcon />}
                sx={{ fontSize: '0.75rem' }}
              />
            )}
          </Box>
          <Controller
            name="startDateTime"
            control={control}
            render={({ field }) => (
              <DateTimePicker
                label="Start Date & Time"
                value={field.value}
                onChange={handleTimeChange}
                onAccept={handleTimeAccept}
                onClose={handleTimeClose}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',

                    sx: {
                      '& .MuiOutlinedInput-root': {
                        minHeight: 56,
                      },
                    },
                  },
                }}
                minDateTime={field.value ? undefined : dayjs()}
              />
            )}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

// Individual checklist item component
const ChecklistItem = ({ item, control, watch, setValue, getValues }) => {
  const accessStates = watch('accessStates') || {};
  const followUpData = watch('followUpData') || {};

  const status = accessStates[item.id] || ACCESS_STATES.NOT_SELECTED;
  const itemFollowUpData = followUpData[item.id];

  const handleStatusChange = (newStatus) => {
    const currentAccessStates = getValues('accessStates') || {};
    setValue('accessStates', {
      ...currentAccessStates,
      [item.id]: newStatus,
    });
  };

  const handleFollowUpChange = (data) => {
    const currentFollowUpData = getValues('followUpData') || {};
    setValue('followUpData', {
      ...currentFollowUpData,
      [item.id]: data,
    });
  };

  const toggleSelection = () => {
    if (item.id === 'glove_size' || item.id === 'shirt_size') return;

    const newStatus = status === ACCESS_STATES.REQUESTED ? ACCESS_STATES.NOT_SELECTED : ACCESS_STATES.REQUESTED;

    // Clear follow-up data when unchecking items that have sub-options
    if (hasSubOptions(item) && newStatus === ACCESS_STATES.NOT_SELECTED) {
      handleFollowUpChange(null);
    }

    handleStatusChange(newStatus);
  };

  const handleRoleToggle = (roleValue) => {
    const currentRoles = itemFollowUpData?.selectedRoles || [];
    const isSelected = currentRoles.some((role) => role.value === roleValue);

    let newRoles;
    if (isSelected) {
      newRoles = currentRoles.filter((role) => role.value !== roleValue);
    } else {
      const roleOption = item.followUpOptions.find((option) => option.value === roleValue);
      newRoles = [...currentRoles, roleOption];
    }

    const data = {
      selectedRoles: newRoles,
    };
    handleFollowUpChange(data);
  };

  const handleNotifyAccessTypeToggle = (accessValue) => {
    const currentSelection = itemFollowUpData?.selectedAccessType;
    const newSelection =
      currentSelection?.value === accessValue ? null : item.followUpOptions.find((option) => option.value === accessValue);

    const data = {
      selectedAccessType: newSelection,
    };
    handleFollowUpChange(data);
  };

  const handleLimitToggle = (limitValue) => {
    const currentSelection = itemFollowUpData?.selectedLimit;
    const newSelection = currentSelection?.value === limitValue ? null : item.followUpOptions.find((option) => option.value === limitValue);

    const data = {
      selectedLimit: newSelection,
      customAmount: limitValue === 'custom' ? itemFollowUpData?.customAmount || '' : '',
    };

    handleFollowUpChange(data);
  };

  const handleCustomAmountChange = (value) => {
    const data = {
      selectedLimit: itemFollowUpData?.selectedLimit || item.followUpOptions.find((option) => option.value === 'custom'),
      customAmount: value,
    };
    handleFollowUpChange(data);
  };

  const handleSizeToggle = (sizeValue) => {
    const currentSelection = itemFollowUpData?.selectedSize;
    const newSelection = currentSelection?.value === sizeValue ? null : item.followUpOptions.find((option) => option.value === sizeValue);

    const data = {
      selectedSize: newSelection,
    };
    handleFollowUpChange(data);
  };

  const handleOfficeDesktopToggle = (desktopValue) => {
    const currentSelection = itemFollowUpData?.selectedDesktopOption;
    const newSelection =
      currentSelection?.value === desktopValue ? null : item.followUpOptions.find((option) => option.value === desktopValue);

    const data = {
      selectedDesktopOption: newSelection,
    };
    handleFollowUpChange(data);
  };

  const handleNewItemToggle = (optionValue) => {
    const currentSelection = itemFollowUpData?.selectedNewItemOption;
    const newSelection =
      currentSelection?.value === optionValue ? null : item.followUpOptions.find((option) => option.value === optionValue);

    handleFollowUpChange({ selectedNewItemOption: newSelection });
  };

  const handleSharedEmailToggle = (emailValue) => {
    const currentRoles = itemFollowUpData?.selectedEmailGroups || [];
    const isSelected = currentRoles.some((email) => email.value === emailValue);

    let newRoles;
    if (isSelected) {
      newRoles = currentRoles.filter((email) => email.value !== emailValue);
    } else {
      const emailOption = item.followUpOptions.find((option) => option.value === emailValue);
      newRoles = [...currentRoles, emailOption];
    }

    const data = {
      selectedEmailGroups: newRoles,
    };
    handleFollowUpChange(data);
  };

  const isSelected = status === ACCESS_STATES.REQUESTED;

  // Helper function to identify items with sub-options
  const hasSubOptions = (item) => {
    return ['entrata', 'notify_hellospoke', 'lowes', 'credit_card', 'office_365', 'shared_email_groups'].includes(item.id);
  };

  const hasFollowUpSelection = (() => {
    if (!itemFollowUpData) return false;

    // Handle items with sub-options
    switch (item.id) {
      case 'office_365': {
        return itemFollowUpData.selectedDesktopOption?.value;
      }
      case 'entrata': {
        return itemFollowUpData.selectedRoles?.length > 0;
      }
      case 'notify_hellospoke': {
        return itemFollowUpData.selectedAccessType?.value;
      }
      case 'lowes':
      case 'credit_card': {
        const hasLimit = itemFollowUpData.selectedLimit?.value;
        if (itemFollowUpData.selectedLimit?.value === 'custom') {
          return hasLimit && itemFollowUpData.customAmount?.trim();
        }
        return hasLimit;
      }
      case 'glove_size':
      case 'shirt_size': {
        return itemFollowUpData.selectedSize?.value;
      }
      case 'shared_email_groups': {
        return itemFollowUpData.selectedEmailGroups?.length > 0;
      }
      default: {
        return false;
      }
    }
  })();

  const shouldHighlight = (() => {
    // Items with sub-options only highlight when sub-option is selected
    if (hasSubOptions(item) || item.id === 'glove_size' || item.id === 'shirt_size') {
      return hasFollowUpSelection;
    }

    // Regular items highlight when selected
    return isSelected;
  })();

  return (
    <>
      <Box
        sx={{
          py: 1.5,
          px: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          '&:hover': {
            bgcolor: 'action.hover',
          },
          ...(shouldHighlight && {
            borderLeft: '4px solid',
            borderLeftColor: 'primary.main',
          }),
        }}
      >
        {/* Main row with checkbox and service name */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Checkbox */}
          <Box sx={{ flexShrink: 0 }}>
            {item.id === 'glove_size' || item.id === 'shirt_size' ? null : (
              <Checkbox checked={isSelected} onChange={toggleSelection} color="primary" size="small" />
            )}
          </Box>

          {/* Service name and content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Service name - always aligned with checkbox */}
            <Typography variant="body2" fontWeight={shouldHighlight ? 'bold' : 'medium'}>
              {item.label}
            </Typography>

            {/* Note - if exists */}
            {item.note && (
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                {item.note}
              </Typography>
            )}

            {/* Entrata Roles - rendered below the main content */}
            {item.id === 'entrata' && isSelected && (
              <Box sx={{ mt: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
                    alignItems: 'center',
                  }}
                >
                  {item.followUpOptions.map((roleOption) => {
                    const isRoleSelected = itemFollowUpData?.selectedRoles?.some((role) => role.value === roleOption.value) || false;
                    return (
                      <Box
                        key={roleOption.value}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRoleToggle(roleOption.value);
                        }}
                        sx={{
                          cursor: 'pointer',
                          px: 2,
                          py: 0.75,
                          borderRadius: 25,
                          border: '2px solid',
                          borderColor: isRoleSelected ? 'primary.main' : 'grey.300',
                          bgcolor: isRoleSelected ? 'primary.main' : 'transparent',
                          color: isRoleSelected ? 'white' : 'text.primary',
                          transition: 'all 0.3s ease',
                          textAlign: 'center',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 0.5,
                          minWidth: 'fit-content',
                          userSelect: 'none',
                          '&:hover': {
                            borderColor: 'primary.main',
                            bgcolor: isRoleSelected ? 'primary.dark' : 'primary.lighter',
                            transform: 'translateY(-1px)',
                          },
                        }}
                      >
                        {isRoleSelected && <CheckCircleIcon sx={{ fontSize: 16 }} />}
                        <Typography
                          variant="body2"
                          fontWeight={isRoleSelected ? 'bold' : 'medium'}
                          sx={{
                            fontSize: '0.8rem',
                            whiteSpace: 'nowrap',
                            pointerEvents: 'none',
                          }}
                        >
                          {roleOption.label}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            )}

            {/* Notify (HelloSpoke) Access Type */}
            {item.id === 'notify_hellospoke' && isSelected && (
              <Box sx={{ mt: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
                    alignItems: 'center',
                  }}
                >
                  {item.followUpOptions.map((accessOption) => {
                    const isAccessSelected = itemFollowUpData?.selectedAccessType?.value === accessOption.value;
                    return (
                      <Box
                        key={accessOption.value}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNotifyAccessTypeToggle(accessOption.value);
                        }}
                        sx={{
                          cursor: 'pointer',
                          px: 2,
                          py: 0.75,
                          borderRadius: 25,
                          border: '2px solid',
                          borderColor: isAccessSelected ? 'primary.main' : 'grey.300',
                          bgcolor: isAccessSelected ? 'primary.main' : 'transparent',
                          color: isAccessSelected ? 'white' : 'text.primary',
                          transition: 'all 0.3s ease',
                          textAlign: 'center',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 0.5,
                          minWidth: 'fit-content',
                          userSelect: 'none',
                          '&:hover': {
                            borderColor: 'primary.main',
                            bgcolor: isAccessSelected ? 'primary.dark' : 'primary.lighter',
                            transform: 'translateY(-1px)',
                          },
                        }}
                      >
                        {isAccessSelected && <CheckCircleIcon sx={{ fontSize: 16 }} />}
                        <Typography
                          variant="body2"
                          fontWeight={isAccessSelected ? 'bold' : 'medium'}
                          sx={{
                            fontSize: '0.8rem',
                            whiteSpace: 'nowrap',
                            pointerEvents: 'none',
                          }}
                        >
                          {accessOption.label}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            )}

            {/* Lowes.com Purchase Limit */}
            {item.id === 'lowes' && isSelected && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" fontWeight="medium" color="primary.dark" sx={{ mb: 1 }}>
                  Purchase Limit:
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
                    alignItems: 'center',
                  }}
                >
                  {item.followUpOptions.map((limitOption) => {
                    const isLimitSelected = itemFollowUpData?.selectedLimit?.value === limitOption.value;
                    return (
                      <Box
                        key={limitOption.value}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLimitToggle(limitOption.value);
                        }}
                        sx={{
                          cursor: 'pointer',
                          px: 2,
                          py: 0.75,
                          borderRadius: 25,
                          border: '2px solid',
                          borderColor: isLimitSelected ? 'primary.main' : 'grey.300',
                          bgcolor: isLimitSelected ? 'primary.main' : 'transparent',
                          color: isLimitSelected ? 'white' : 'text.primary',
                          transition: 'all 0.3s ease',
                          textAlign: 'center',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 0.5,
                          minWidth: 'fit-content',
                          userSelect: 'none',
                          '&:hover': {
                            borderColor: 'primary.main',
                            bgcolor: isLimitSelected ? 'primary.dark' : 'primary.lighter',
                            transform: 'translateY(-1px)',
                          },
                        }}
                      >
                        {isLimitSelected && <CheckCircleIcon sx={{ fontSize: 16 }} />}
                        <Typography
                          variant="body2"
                          fontWeight={isLimitSelected ? 'bold' : 'medium'}
                          sx={{
                            fontSize: '0.8rem',
                            whiteSpace: 'nowrap',
                            pointerEvents: 'none',
                          }}
                        >
                          {limitOption.label}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>

                {itemFollowUpData?.selectedLimit?.value === 'custom' && (
                  <Box sx={{ mt: 2 }}>
                    <TextField
                      size="small"
                      label="Custom Amount"
                      value={itemFollowUpData?.customAmount || ''}
                      onChange={(e) => handleCustomAmountChange(e.target.value)}
                      placeholder="Enter custom amount"
                      sx={{ minWidth: 200 }}
                    />
                  </Box>
                )}
              </Box>
            )}

            {/* Credit Card Limit */}
            {item.id === 'credit_card' && isSelected && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" fontWeight="medium" color="primary.dark" sx={{ mb: 1 }}>
                  Credit Limit:
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
                    alignItems: 'center',
                  }}
                >
                  {item.followUpOptions.map((limitOption) => {
                    const isLimitSelected = itemFollowUpData?.selectedLimit?.value === limitOption.value;
                    return (
                      <Box
                        key={limitOption.value}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLimitToggle(limitOption.value);
                        }}
                        sx={{
                          cursor: 'pointer',
                          px: 2,
                          py: 0.75,
                          borderRadius: 25,
                          border: '2px solid',
                          borderColor: isLimitSelected ? 'primary.main' : 'grey.300',
                          bgcolor: isLimitSelected ? 'primary.main' : 'transparent',
                          color: isLimitSelected ? 'white' : 'text.primary',
                          transition: 'all 0.3s ease',
                          textAlign: 'center',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 0.5,
                          minWidth: 'fit-content',
                          userSelect: 'none',
                          '&:hover': {
                            borderColor: 'primary.main',
                            bgcolor: isLimitSelected ? 'primary.dark' : 'primary.lighter',
                            transform: 'translateY(-1px)',
                          },
                        }}
                      >
                        {isLimitSelected && <CheckCircleIcon sx={{ fontSize: 16 }} />}
                        <Typography
                          variant="body2"
                          fontWeight={isLimitSelected ? 'bold' : 'medium'}
                          sx={{
                            fontSize: '0.8rem',
                            whiteSpace: 'nowrap',
                            pointerEvents: 'none',
                          }}
                        >
                          {limitOption.label}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>

                {itemFollowUpData?.selectedLimit?.value === 'custom' && (
                  <Box sx={{ mt: 2 }}>
                    <TextField
                      size="small"
                      label="Custom Amount"
                      value={itemFollowUpData?.customAmount || ''}
                      onChange={(e) => handleCustomAmountChange(e.target.value)}
                      placeholder="Enter custom amount"
                      sx={{ minWidth: 200 }}
                    />
                  </Box>
                )}
              </Box>
            )}

            {/* Glove Size and Shirt Size */}
            {(item.id === 'glove_size' || item.id === 'shirt_size') && (
              <Box sx={{ mt: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
                    alignItems: 'center',
                  }}
                >
                  {item.followUpOptions.map((sizeOption) => {
                    const isSizeSelected = itemFollowUpData?.selectedSize?.value === sizeOption.value;
                    return (
                      <Box
                        key={sizeOption.value}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSizeToggle(sizeOption.value);
                        }}
                        sx={{
                          cursor: 'pointer',
                          px: 2,
                          py: 0.75,
                          borderRadius: 25,
                          border: '2px solid',
                          borderColor: isSizeSelected ? 'primary.main' : 'grey.300',
                          bgcolor: isSizeSelected ? 'primary.main' : 'transparent',
                          color: isSizeSelected ? 'white' : 'text.primary',
                          transition: 'all 0.3s ease',
                          textAlign: 'center',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 0.5,
                          minWidth: 'fit-content',
                          userSelect: 'none',
                          '&:hover': {
                            borderColor: 'primary.main',
                            bgcolor: isSizeSelected ? 'primary.dark' : 'primary.lighter',
                            transform: 'translateY(-1px)',
                          },
                        }}
                      >
                        {isSizeSelected && <CheckCircleIcon sx={{ fontSize: 16 }} />}
                        <Typography
                          variant="body2"
                          fontWeight={isSizeSelected ? 'bold' : 'medium'}
                          sx={{
                            fontSize: '0.8rem',
                            whiteSpace: 'nowrap',
                            pointerEvents: 'none',
                          }}
                        >
                          {sizeOption.label}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            )}

            {/* Microsoft Outlook & Teams Desktop Apps */}
            {item.id === 'office_365' && (isSelected || itemFollowUpData?.selectedDesktopOption) && (
              <Box sx={{ mt: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
                    alignItems: 'center',
                  }}
                >
                  {item.followUpOptions.map((desktopOption) => {
                    const isDesktopSelected = itemFollowUpData?.selectedDesktopOption?.value === desktopOption.value;
                    return (
                      <Box
                        key={desktopOption.value}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOfficeDesktopToggle(desktopOption.value);
                        }}
                        sx={{
                          cursor: 'pointer',
                          px: 2,
                          py: 0.75,
                          borderRadius: 25,
                          border: '2px solid',
                          borderColor: isDesktopSelected ? 'primary.main' : 'grey.300',
                          bgcolor: isDesktopSelected ? 'primary.main' : 'transparent',
                          color: isDesktopSelected ? 'white' : 'text.primary',
                          transition: 'all 0.3s ease',
                          textAlign: 'center',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 0.5,
                          minWidth: 'fit-content',
                          userSelect: 'none',
                          '&:hover': {
                            borderColor: 'primary.main',
                            bgcolor: isDesktopSelected ? 'primary.dark' : 'primary.lighter',
                            transform: 'translateY(-1px)',
                          },
                        }}
                      >
                        {isDesktopSelected && <CheckCircleIcon sx={{ fontSize: 16 }} />}
                        <Typography
                          variant="body2"
                          fontWeight={isDesktopSelected ? 'bold' : 'medium'}
                          sx={{
                            fontSize: '0.8rem',
                            whiteSpace: 'nowrap',
                            pointerEvents: 'none',
                          }}
                        >
                          {desktopOption.label}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            )}

            {/* Shared Email Groups */}
            {item.id === 'shared_email_groups' && isSelected && (
              <Box sx={{ mt: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
                    alignItems: 'center',
                  }}
                >
                  {item.followUpOptions.map((emailOption) => {
                    const isEmailSelected =
                      itemFollowUpData?.selectedEmailGroups?.some((email) => email.value === emailOption.value) || false;
                    return (
                      <Box
                        key={emailOption.value}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSharedEmailToggle(emailOption.value);
                        }}
                        sx={{
                          cursor: 'pointer',
                          px: 2,
                          py: 0.75,
                          borderRadius: 25,
                          border: '2px solid',
                          borderColor: isEmailSelected ? 'primary.main' : 'grey.300',
                          bgcolor: isEmailSelected ? 'primary.main' : 'transparent',
                          color: isEmailSelected ? 'white' : 'text.primary',
                          transition: 'all 0.3s ease',
                          textAlign: 'center',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 0.5,
                          minWidth: 'fit-content',
                          userSelect: 'none',
                          '&:hover': {
                            borderColor: 'primary.main',
                            bgcolor: isEmailSelected ? 'primary.dark' : 'primary.lighter',
                            transform: 'translateY(-1px)',
                          },
                        }}
                      >
                        {isEmailSelected && <CheckCircleIcon sx={{ fontSize: 16 }} />}
                        <Typography
                          variant="body2"
                          fontWeight={isEmailSelected ? 'bold' : 'medium'}
                          sx={{
                            fontSize: '0.8rem',
                            whiteSpace: 'nowrap',
                            pointerEvents: 'none',
                          }}
                        >
                          {emailOption.label}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            )}

            {/* New Item Options */}
            {item.id === 'new_item' && isSelected && (
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
                  {item.followUpOptions.map((option) => {
                    const isSelected = itemFollowUpData?.selectedNewItemOption?.value === option.value;
                    return (
                      <Box
                        key={option.value}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNewItemToggle(option.value);
                        }}
                        sx={{
                          cursor: 'pointer',
                          px: 2,
                          py: 0.75,
                          borderRadius: 25,
                          border: '2px solid',
                          borderColor: isSelected ? 'primary.main' : 'grey.300',
                          bgcolor: isSelected ? 'primary.main' : 'transparent',
                          color: isSelected ? 'white' : 'text.primary',
                          transition: 'all 0.3s ease',
                          textAlign: 'center',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 0.5,
                          minWidth: 'fit-content',
                          userSelect: 'none',
                          '&:hover': {
                            borderColor: 'primary.main',
                            bgcolor: isSelected ? 'primary.dark' : 'primary.lighter',
                            transform: 'translateY(-1px)',
                          },
                        }}
                      >
                        {isSelected && <CheckCircleIcon sx={{ fontSize: 16 }} />}
                        <Typography variant="body2">{option.label}</Typography>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            )}
          </Box>

          {/* Configuration chips - full width row */}
          {item.id === 'entrata' ||
          item.id === 'notify_hellospoke' ||
          item.id === 'lowes' ||
          item.id === 'credit_card' ||
          item.id === 'office_365' ||
          item.id === 'glove_size' ||
          item.id === 'shirt_size' ||
          item.id === 'new_item' ||
          item.id === 'shared_email_groups' ? null : item.hasFollowUp && itemFollowUpData ? (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1, ml: 6 }}>
              <Chip
                label={`${item.followUpLabel}: ${
                  itemFollowUpData.selectedOption === 'custom' ? itemFollowUpData.customValue : itemFollowUpData.selectedOption
                }`}
                size="small"
                color="secondary"
                variant="outlined"
              />
              {itemFollowUpData.deliveryProperty && (
                <Chip label={`Delivery: ${itemFollowUpData.deliveryProperty}`} size="small" color="secondary" variant="outlined" />
              )}
            </Box>
          ) : item.hasFollowUp ? (
            <Box sx={{ mt: 1, ml: 6 }}>
              <Typography variant="body2" color="text.secondary" fontStyle="italic">
                Configuration required
              </Typography>
            </Box>
          ) : null}
        </Box>
      </Box>
    </>
  );
};

// ChecklistSection component
const ChecklistSection = ({ title, items, control, watch, setValue, getValues }) => {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent sx={{ pb: 1 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {title}
          </Typography>
        </Box>

        <Box>
          {items.map((item) => (
            <ChecklistItem
              key={`access-item-${item.itemId || item.label}-${item.id}`}
              item={item}
              control={control}
              watch={watch}
              setValue={setValue}
              getValues={getValues}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

// Add this helper function at the top of the file, after the imports
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
        return employee.fullName?.S || employee.fullName || 'Not provided';
      case 'jobTitle':
        return employee.jobTitle?.S || employee.jobTitle || 'Not provided';
      case 'workEmail':
        return employee.workEmail?.S || employee.workEmail || 'Not provided';
      case 'personalEmail':
        return employee.personalEmail?.S || employee.personalEmail || 'Not provided';
      case 'personalPhone':
        return employee.personalPhone?.S || employee.personalPhone || 'Not provided';
      case 'compensation':
        return employee.compensation?.S || employee.compensation || 'Not provided';
      case 'supervisor':
        return employee.supervisor?.S || employee.supervisor || 'Not provided';
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
        return 'Not provided';
      }
      default:
        return employee[field]?.S || employee[field] || 'Not provided';
    }
  }

  // Fallback to direct access for backward compatibility
  return employee[field] || 'Not provided';
};

// Move CopyableField component outside of EmployeeInformation
const CopyableField = ({ label, value }) => {
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {});
  };

  return (
    <Box sx={{ mb: 1 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
        <strong>{label}:</strong>
      </Typography>
      <Box
        onClick={() => handleCopy(value || 'Not provided')}
        sx={{
          p: 1.5,
          bgcolor: 'grey.100',
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'grey.300',
          fontSize: '0.875rem',
          cursor: 'pointer',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          userSelect: 'none',
          '&:hover': {
            bgcolor: 'grey.200',
            '& .copy-icon': {
              opacity: 1,
            },
          },
        }}
      >
        <span>{value || 'Not provided'}</span>
        <Box
          className="copy-icon"
          sx={{
            opacity: 0,
            transition: 'opacity 0.2s',
            ml: 1,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ContentCopyIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
        </Box>
      </Box>
    </Box>
  );
};

// Update EmployeeInformation to remove the inner CopyableField definition
const EmployeeInformation = ({ employee, control }) => {
  if (!employee) return null;

  const formatPhoneNumber = (phone) => {
    if (!phone) return 'Not provided';
    // Remove any non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    // Format as XXX-XXX-XXXX
    if (cleaned.length === 10) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    // If not 10 digits, return original
    return phone;
  };

  return (
    <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <CopyableField label="Full Name" value={getEmployeeValue(employee, 'fullName')} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CopyableField label="Job Title" value={getEmployeeValue(employee, 'jobTitle')} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CopyableField label="Work Email" value={getEmployeeValue(employee, 'workEmail')} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CopyableField label="Compensation" value={getEmployeeValue(employee, 'compensation')} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CopyableField label="Personal Email" value={getEmployeeValue(employee, 'personalEmail')} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CopyableField label="Personal Phone" value={formatPhoneNumber(getEmployeeValue(employee, 'personalPhone'))} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CopyableField label="Supervisor" value={getEmployeeValue(employee, 'supervisor')} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CopyableField label="Expected Hire Date" value={getEmployeeValue(employee, 'expectedHireDate')} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="tempPassword"
            control={control}
            defaultValue={employee?.onboarding?.tempPassword || ''}
            render={({ field }) => (
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <strong>Temporary Password:</strong> <span style={{ color: '#d32f2f' }}>* Required</span>
                </Typography>
                <TextField
                  {...field}
                  placeholder="Enter temporary password (required for PDF)"
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      minHeight: 40,
                      ...((!field.value || field.value === '') && {
                        borderColor: 'warning.main',
                      }),
                    },
                  }}
                />
              </Box>
            )}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

// Offer Letter Viewer Component
const OfferLetterViewer = ({ employee }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check for the new structure with offerLetterBucket and offerLetterKey
  const offerLetterBucket = employee?.onboarding?.offerLetterBucket?.S || employee?.onboarding?.offerLetterBucket;
  const offerLetterKey = employee?.onboarding?.offerLetterKey?.S || employee?.onboarding?.offerLetterKey;

  // Check for Paylocity recruiting link
  const paylocityRecruitingLink = employee?.onboarding?.paylocityRecruitingLink?.S || employee?.onboarding?.paylocityRecruitingLink;

  const handleViewOfferLetter = async () => {
    if (!offerLetterBucket || !offerLetterKey) {
      setError('No offer letter found');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const signedUrl = await s3GetSignedUrl({
        bucket: offerLetterBucket,
        key: offerLetterKey,
        expiresIn: 3600, // 1 hour
      });

      console.log('signedUrl', signedUrl);
      window.open(signedUrl, '_blank');
    } catch (err) {
      console.error('Error getting offer letter:', err);
      setError('Failed to load offer letter');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewInRecruiting = () => {
    if (paylocityRecruitingLink) {
      window.open(paylocityRecruitingLink, '_blank');
    }
  };

  // Only render if either offer letter or recruiting link exists
  if (!offerLetterBucket && !offerLetterKey && !paylocityRecruitingLink) {
    return null;
  }

  return (
    <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
      <Grid container spacing={2}>
        {offerLetterBucket && offerLetterKey && (
          <Grid item xs={12} sm={6}>
            <Button
              variant="outlined"
              size="small"
              onClick={handleViewOfferLetter}
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={16} /> : <ContentCopyIcon />}
            >
              {isLoading ? 'Loading...' : 'View Offer Letter'}
            </Button>

            {error && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
          </Grid>
        )}

        {paylocityRecruitingLink && (
          <Grid item xs={12} sm={6}>
            <Button variant="outlined" size="small" onClick={handleViewInRecruiting} startIcon={<OpenInNewIcon />}>
              View in Recruiting
            </Button>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

// Main AccessChecklist component
export default function AccessChecklist({ newburyAssets, employee, employees = [] }) {
  console.log('employee', employee);
  const [showInformationSheet, setShowInformationSheet] = useState(false);
  const [formattedData, setFormattedData] = useState(null);
  const [showTeamsDialog, setShowTeamsDialog] = useState(false);
  const [showPresetDialog, setShowPresetDialog] = useState(false);
  const [pendingPreset, setPendingPreset] = useState(null);
  const [pendingPosition, setPendingPosition] = useState(null);
  const [showUpdateTimeDialog, setShowUpdateTimeDialog] = useState(false);
  const [pendingTimeChange, setPendingTimeChange] = useState(null);
  const [originalStartTime, setOriginalStartTime] = useState(null);
  const [showRemindDialog, setShowRemindDialog] = useState(false);
  const [selectedEmployeesToRemind, setSelectedEmployeesToRemind] = useState([]);
  const [isRemindingSending, setIsRemindingSending] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isRequestingPermissions, setIsRequestingPermissions] = useState(false);
  const [isUpdatingMeeting, setIsUpdatingMeeting] = useState(false);
  const [isCancelingMeeting, setIsCancelingMeeting] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors: _errors },
  } = useForm({
    defaultValues: {
      selectedPosition: null,
      selectedProperties: [],
      selectedDeliveryAddress: null,
      startDateTime: null,
      accessStates: {},
      followUpData: {},
      tempPassword: '', // Add temp password to form defaults
    },
  });

  // Load previously saved data on component mount
  React.useEffect(() => {
    if (employee?.onboarding?.accessChecklist) {
      const savedData = employee.onboarding.accessChecklist;

      if (savedData.selectedPosition) {
        setValue('selectedPosition', savedData.selectedPosition);
      }
      if (savedData.selectedProperties) {
        setValue('selectedProperties', savedData.selectedProperties);
      }
      if (savedData.selectedDeliveryAddress) {
        setValue('selectedDeliveryAddress', savedData.selectedDeliveryAddress);
      }
      if (savedData.startDateTime) {
        try {
          const parsedDate = dayjs(savedData.startDateTime);
          console.log('Raw startDateTime from DB:', savedData.startDateTime, typeof savedData.startDateTime);
          console.log('Parsed date:', parsedDate.format(), 'Is valid:', parsedDate.isValid());

          if (parsedDate.isValid()) {
            setValue('startDateTime', parsedDate);
            // Store the original time reference since this is now the new baseline
            setOriginalStartTime(parsedDate);
          } else {
            console.warn('Invalid saved startDateTime:', savedData.startDateTime);
            setValue('startDateTime', null); // Clear invalid date
            setOriginalStartTime(null);
          }
        } catch (error) {
          console.error('Error parsing saved startDateTime:', error, savedData.startDateTime);
          setValue('startDateTime', null); // Clear on error
          setOriginalStartTime(null);
        }
      }
      if (savedData.accessStates) {
        setValue('accessStates', savedData.accessStates);
      }
      if (savedData.followUpData) {
        setValue('followUpData', savedData.followUpData);
      }

      console.log('Successfully loaded previously saved access checklist data');
    } else {
      console.log('No saved access checklist data found');
    }

    // Load temp password if it exists
    if (employee?.onboarding?.tempPassword) {
      setValue('tempPassword', employee.onboarding.tempPassword);
    }
  }, [employee, setValue]);

  const selectedPosition = watch('selectedPosition');
  const selectedProperties = watch('selectedProperties');
  const selectedDeliveryAddress = watch('selectedDeliveryAddress');
  const startDateTime = watch('startDateTime');
  const hasScheduledMeeting = employee?.onboarding?.scheduledMeeting;

  // Check if basic required fields are completed (for calendar/PDF)
  const areBasicFieldsComplete = () => {
    const tempPassword = watch('tempPassword');
    return (
      selectedPosition && // Position must be selected
      selectedProperties &&
      selectedProperties.length > 0 && // At least one property selected
      selectedDeliveryAddress && // Delivery address selected
      startDateTime && // Start date and time selected
      tempPassword && // Temporary password must be set
      tempPassword.trim().length > 0 // Password must not be empty
    );
  };

  // Check if all required fields are completed (for request permissions)
  const areAllFieldsComplete = () => {
    const followUpData = watch('followUpData') || {};
    const gloveSize = followUpData['glove_size']?.selectedSize;
    const shirtSize = followUpData['shirt_size']?.selectedSize;

    return (
      areBasicFieldsComplete() && // All basic fields must be complete
      gloveSize && // Glove size must be selected
      shirtSize // Shirt size must be selected
    );
  };

  // Function to check if there are existing selections that would be overridden
  const hasExistingSelections = () => {
    const currentAccessStates = getValues('accessStates') || {};
    const currentFollowUpData = getValues('followUpData') || {};

    // Check if any access items are currently selected
    const hasSelectedAccess = Object.values(currentAccessStates).some((state) => state === ACCESS_STATES.REQUESTED);

    // Check if any follow-up data exists
    const hasFollowUpSelections = Object.keys(currentFollowUpData).some(
      (key) => currentFollowUpData[key] && Object.keys(currentFollowUpData[key]).length > 0
    );

    return hasSelectedAccess || hasFollowUpSelections;
  };

  // Function to apply preset configuration completely (override)
  const applyPresetConfiguration = (preset) => {
    // Get all possible access item IDs from CHECKLIST_DATA
    const allAccessItemIds = [];
    Object.entries(CHECKLIST_DATA).forEach(([sectionKey, section]) => {
      if (sectionKey !== 'position' && sectionKey !== 'properties' && section.items) {
        section.items.forEach((item) => {
          allAccessItemIds.push(item.id);
        });
      }
    });

    // Create a clean access states object
    const newAccessStates = {};
    allAccessItemIds.forEach((itemId) => {
      // Set to requested if in preset, otherwise set to not selected
      newAccessStates[itemId] = preset.accessStates?.[itemId] || ACCESS_STATES.NOT_SELECTED;
    });

    // Apply the new configuration (preset.followUpData is already resolved by getPositionPreset)
    setValue('accessStates', newAccessStates);
    setValue('followUpData', preset.followUpData || {});
  };

  // Handle position change with preset confirmation
  const handlePositionChange = (newPosition) => {
    if (newPosition) {
      const preset = getPositionPreset(newPosition);
      if (preset && hasExistingSelections()) {
        // Show confirmation dialog
        setPendingPreset(preset);
        setPendingPosition(newPosition);
        setShowPresetDialog(true);
      } else if (preset) {
        // Apply preset directly if no existing selections
        applyPresetConfiguration(preset);
      }
    }
  };

  // Handle preset dialog confirmation
  const handlePresetConfirm = () => {
    if (pendingPreset) {
      applyPresetConfiguration(pendingPreset);
    }
    setShowPresetDialog(false);
    setPendingPreset(null);
    setPendingPosition(null);
  };

  // Handle preset dialog cancellation
  const handlePresetCancel = () => {
    // Don't apply preset, but still allow position change
    setShowPresetDialog(false);
    setPendingPreset(null);
    setPendingPosition(null);
  };

  // Watch for position changes
  React.useEffect(() => {
    if (selectedPosition) {
      const preset = getPositionPreset(selectedPosition);
      if (preset && !hasExistingSelections()) {
        // Apply preset directly if no existing selections
        applyPresetConfiguration(preset);
      }
    }
  }, [selectedPosition, applyPresetConfiguration, hasExistingSelections]);

  // Modified onSubmit function for direct PDF generation
  const onSubmit = async (data) => {
    if (!areBasicFieldsComplete()) {
      console.error('Required fields not completed for PDF generation');
      return;
    }

    // Additional check for temp password
    if (!data.tempPassword || data.tempPassword.trim().length === 0) {
      console.error('Temporary password is required for PDF generation');
      return;
    }

    console.log('Form Data:', data);

    // Process and format the data for better readability
    const processedData = {
      position: selectedPosition,
      properties: selectedProperties,
      deliveryAddress: data.selectedDeliveryAddress,
      startDateTime: data.startDateTime,
      accessRequests: Object.entries(data.accessStates || {})
        .filter(([_, status]) => status === ACCESS_STATES.REQUESTED)
        .map(([itemId, _]) => {
          const followUp = data.followUpData?.[itemId];
          const itemDetails = findItemDetails(itemId);

          return {
            itemId,
            label: itemDetails?.label || itemId,
            employeeLabel: itemDetails?.employeeLabel || itemDetails?.label || itemId,
            category: itemDetails?.category || 'Unknown Category',
            url: itemDetails?.url || null,
            loginLabel: itemDetails?.loginLabel || null,
            followUpConfiguration: followUp || null,
          };
        }),
      sizeSelections: Object.entries(data.followUpData || {})
        .filter(([itemId, followUpData]) => (itemId === 'glove_size' || itemId === 'shirt_size') && followUpData?.selectedSize)
        .map(([itemId, followUpData]) => {
          const itemDetails = findItemDetails(itemId);

          return {
            type: itemId,
            label: itemDetails?.label || itemId,
            employeeLabel: itemDetails?.employeeLabel || itemDetails?.label || itemId,
            category: itemDetails?.category || 'Personal Protective Equipment and Uniforms',
            size: followUpData.selectedSize,
          };
        }),
      mobileApps: Object.entries(data.accessStates || {})
        .filter(([_, status]) => status === ACCESS_STATES.REQUESTED)
        .map(([itemId, _]) => {
          const itemDetails = findItemDetails(itemId);
          return itemDetails?.mobileApp || [];
        })
        .flat()
        .filter((app, index, self) => self.indexOf(app) === index) // Remove duplicates
        .sort(),
      sharedEmailConfig: data.followUpData?.shared_email_groups || null,
    };

    console.log('Formatted Data for Processing:', processedData);

    // Set the data and show the Information Sheet
    setFormattedData(processedData);
    setShowInformationSheet(true);
  };

  const handleCloseInformationSheet = () => {
    setShowInformationSheet(false);
    setFormattedData(null);
  };

  const handleOpenRemindDialog = () => {
    setShowRemindDialog(true);
    // Pre-select the employee's supervisor if available
    const supervisorName = getEmployeeValue(employee, 'supervisor');
    const supervisorEmployee = employees.find((emp) => {
      // Handle both old and new employee structures
      const empName = emp.fullName?.S || emp.fullName;
      return empName === supervisorName;
    });
    if (supervisorEmployee) {
      setSelectedEmployeesToRemind([supervisorEmployee.pk]); // Use the actual supervisor's pk
    }
  };

  const handleCloseRemindDialog = () => {
    setShowRemindDialog(false);
    setSelectedEmployeesToRemind([]);
  };

  const handleSendReminder = async () => {
    setIsRemindingSending(true);
    const selectedEmployees = employees.filter((emp) => selectedEmployeesToRemind.includes(emp.pk));
    console.log('Sending reminder to:', selectedEmployees);

    if (selectedEmployees.length === 0) {
      console.error('No employees selected for reminder');
      setIsRemindingSending(false);
      return;
    }

    try {
      // Extract email addresses from selected employees
      const emails = selectedEmployees
        .map((emp) => getEmployeeValue(emp, 'workEmail'))
        .filter((email) => email) // Filter out any null/undefined emails
        .filter((email, index, self) => self.indexOf(email) === index); // Remove duplicates

      if (emails.length === 0) {
        console.error('No valid email addresses found for selected employees');
        setIsRemindingSending(false);
        return;
      }

      console.log('Sending reminder emails to:', emails);

      // Send the reminder email
      await sendOnboardingRemindEmail({
        emails: emails,
        employee: employee,
      });

      console.log('Reminder emails sent successfully');

      // Close the dialog
      setShowRemindDialog(false);
      setSelectedEmployeesToRemind([]);

      // You could add a success notification here if you have a snackbar system
      // showSuccessSnackbar(`Reminder sent to ${emails.length} recipient(s)`);
    } catch (error) {
      console.error('Error sending reminder emails:', error);
      // You could add an error notification here
      // showErrorSnackbar('Failed to send reminder emails');
    } finally {
      setIsRemindingSending(false);
    }
  };

  const onSaveDraft = async () => {
    const currentData = getValues();
    console.log('Draft Data:', currentData);

    if (!employee?.pk) {
      console.error('Missing employee pk for saving draft');
      return;
    }

    setIsSavingDraft(true);

    try {
      // Prepare the access checklist data
      const accessChecklistData = {
        selectedPosition: currentData.selectedPosition,
        selectedProperties: currentData.selectedProperties || [],
        selectedDeliveryAddress: currentData.selectedDeliveryAddress,
        startDateTime: currentData.startDateTime ? currentData.startDateTime.toISOString() : null,
        accessStates: currentData.accessStates || {},
        followUpData: currentData.followUpData || {},
        lastUpdated: new Date().toISOString(),
      };

      console.log('Saving access checklist data:', accessChecklistData);

      // Create the nested onboarding structure properly
      const existingOnboarding = employee.onboarding || {};
      const onboardingUpdate = {
        ...existingOnboarding,
        accessChecklist: accessChecklistData,
        tempPassword: currentData.tempPassword || null, // Save temp password
      };

      console.log('Onboarding update being sent:', onboardingUpdate);

      // Update employee record with the complete onboarding object
      const updateResult = await updateEmployee({
        pk: employee.pk,
        attributes: {
          onboarding: onboardingUpdate,
        },
      });

      if (updateResult && updateResult.severity === 'success') {
        console.log('Access checklist draft saved successfully');
      } else {
        console.error('Failed to save access checklist draft:', updateResult);
      }
    } catch (error) {
      console.error('Error saving access checklist draft:', error);
    } finally {
      setIsSavingDraft(false);
    }
  };

  const onRequestPermissions = async () => {
    const currentData = getValues();
    console.log('Requesting Permissions Data:', currentData);

    if (!employee?.pk) {
      console.error('Missing employee pk for requesting permissions');
      return;
    }

    setIsRequestingPermissions(true);

    try {
      // First save the current state
      const accessChecklistData = {
        selectedPosition: currentData.selectedPosition,
        selectedProperties: currentData.selectedProperties || [],
        selectedDeliveryAddress: currentData.selectedDeliveryAddress,
        startDateTime: currentData.startDateTime ? currentData.startDateTime.toISOString() : null,
        accessStates: currentData.accessStates || {},
        followUpData: currentData.followUpData || {},
        lastUpdated: new Date().toISOString(),
      };

      console.log('Saving access checklist data for permissions request:', accessChecklistData);

      // Create the nested onboarding structure properly
      const existingOnboarding = employee.onboarding || {};
      const onboardingUpdate = {
        ...existingOnboarding,
        accessChecklist: accessChecklistData,
        tempPassword: currentData.tempPassword || null, // Save temp password
      };

      // Update employee record with the complete onboarding object
      const updateResult = await updateEmployee({
        pk: employee.pk,
        attributes: {
          onboarding: onboardingUpdate,
        },
      });

      if (updateResult && updateResult.severity === 'success') {
        console.log('Access checklist permissions saved successfully');

        // Send the email notification for permissions request
        try {
          await sendOnboardingPermissionsSaved({ employee });
          console.log('Onboarding permissions saved email sent successfully');
        } catch (emailError) {
          console.error('Error sending onboarding permissions saved email:', emailError);
          // Don't throw the error - the permissions were still saved successfully
        }
      } else {
        console.error('Failed to save access checklist permissions:', updateResult);
      }
    } catch (error) {
      console.error('Error requesting access checklist permissions:', error);
    } finally {
      setIsRequestingPermissions(false);
    }
  };

  const onDraftCalendarInvite = () => {
    if (!areBasicFieldsComplete()) {
      console.error('Required fields not completed for calendar invite');
      return;
    }

    setShowTeamsDialog(true);
  };

  const handleCloseTeamsDialog = () => {
    setShowTeamsDialog(false);
  };

  // Handle time change with update dialog if meeting exists
  const handleTimeChange = (newValue) => {
    // Always update the form value immediately for onChange events
    setValue('startDateTime', newValue);
  };

  // Handle time accept (when user confirms the date/time selection)
  const handleTimeAccept = (newValue) => {
    if (hasScheduledMeeting && newValue && originalStartTime && !dayjs(newValue).isSame(originalStartTime)) {
      // There's an existing meeting and the time is actually changing from the original
      console.log('Showing update dialog');
      setPendingTimeChange(newValue);
      setShowUpdateTimeDialog(true);
    } else {
      console.log('No dialog needed - no meeting or no change from original');
    }
  };

  // Handle time picker close (when user clicks outside or presses escape)
  const handleTimeClose = () => {
    // Check the current form value when the picker closes
    const currentValue = getValues('startDateTime');

    if (hasScheduledMeeting && currentValue && originalStartTime && !dayjs(currentValue).isSame(originalStartTime)) {
      // There's an existing meeting and the time has changed from the original
      console.log('Showing update dialog from close');
      setPendingTimeChange(currentValue);
      setShowUpdateTimeDialog(true);
    } else {
      console.log('No dialog needed from close - no meeting or no change from original');
    }
  };

  // Handle updating existing meeting time
  const handleUpdateExistingMeeting = async () => {
    if (!pendingTimeChange || !employee?.onboarding?.scheduledMeeting) {
      return;
    }

    setIsUpdatingMeeting(true);

    try {
      const eventId = employee.onboarding.scheduledMeeting;
      const startDateTime = pendingTimeChange.toISOString();
      const endDateTime = pendingTimeChange.add(30, 'minutes').toISOString(); // 30 minute meeting

      console.log('Updating existing calendar event:', { eventId, startDateTime, endDateTime });

      const updateResult = await updateOnboardingTeamsMeeting({
        eventId,
        startDateTime,
        endDateTime,
        organizerEmail: 'calendarscheduler@newburyresidential.com',
      });

      if (updateResult.success) {
        // Update the employee record with the new meeting time
        try {
          const existingOnboarding = employee.onboarding || {};
          const onboardingUpdate = {
            ...existingOnboarding,
            meetingDateTime: startDateTime,
            meetingEndDateTime: endDateTime,
          };

          // Also update the accessChecklist data to ensure the current form data is saved
          const existingAccessChecklist = existingOnboarding.accessChecklist || {};
          const currentFormData = getValues();
          const accessChecklistUpdate = {
            ...existingAccessChecklist,
            startDateTime: startDateTime,
            selectedProperties: currentFormData.selectedProperties || [],
            selectedDeliveryAddress: currentFormData.selectedDeliveryAddress,
          };

          const employeeUpdateResult = await updateEmployee({
            pk: employee.pk,
            attributes: {
              onboarding: {
                ...onboardingUpdate,
                accessChecklist: accessChecklistUpdate,
              },
            },
          });

          if (employeeUpdateResult && employeeUpdateResult.severity === 'success') {
            console.log('Employee updated with new meeting time successfully');
          } else {
            console.error('Failed to update employee with new meeting time:', employeeUpdateResult);
          }
        } catch (updateError) {
          console.error('Error updating employee with new meeting time:', updateError);
        }

        setValue('startDateTime', pendingTimeChange);
        // Update the original time reference since this is now the new baseline
        setOriginalStartTime(pendingTimeChange);
      } else {
        console.error('Failed to update calendar event:', updateResult.error);
        // Still update the form value even if the calendar update failed
        setValue('startDateTime', pendingTimeChange);
        // Update the original time reference since this is now the new baseline
        setOriginalStartTime(pendingTimeChange);
      }
    } catch (error) {
      console.error('Error updating calendar event:', error);
      // Still update the form value even if there was an error
      setValue('startDateTime', pendingTimeChange);
    } finally {
      setIsUpdatingMeeting(false);
      setShowUpdateTimeDialog(false);
      setPendingTimeChange(null);
    }
  };

  // Handle canceling the time change
  const handleCancelTimeChange = () => {
    // Revert to the original time
    setValue('startDateTime', originalStartTime);
    setShowUpdateTimeDialog(false);
    setPendingTimeChange(null);
  };

  const handleCancelMeeting = async () => {
    if (!hasScheduledMeeting || !employee?.pk) {
      console.error('No scheduled meeting to cancel or missing employee pk');
      return;
    }

    setIsCancelingMeeting(true);

    try {
      // First, cancel the actual calendar event in Microsoft Graph
      const eventId = employee.onboarding.scheduledMeeting;

      const cancelResult = await cancelOnboardingTeamsMeeting({
        eventId: eventId,
        organizerEmail: 'calendarscheduler@newburyresidential.com',
      });

      if (!cancelResult.success) {
        console.error('Failed to cancel calendar event:', cancelResult.error);
        // Continue anyway to remove the reference from the employee record
      }

      // Then, update the employee record to remove the scheduled meeting reference and meeting times
      const existingOnboarding = employee.onboarding || {};
      const onboardingUpdate = {
        ...existingOnboarding,
        scheduledMeeting: null, // Remove the scheduled meeting
        meetingDateTime: null, // Remove the meeting date/time
        meetingEndDateTime: null, // Remove the meeting end date/time
      };

      // Update employee record to remove the scheduled meeting
      const updateResult = await updateEmployee({
        pk: employee.pk,
        attributes: {
          onboarding: onboardingUpdate,
        },
      });

      if (updateResult && updateResult.severity === 'success') {
        console.log('Scheduled meeting reference removed from employee record successfully');
      } else {
        console.error('Failed to update employee record:', updateResult);
      }
    } catch (error) {
      console.error('Error cancelling scheduled meeting:', error);
    } finally {
      setIsCancelingMeeting(false);
    }
  };

  // Add this new useEffect to scroll to top when InformationSheet is shown
  React.useEffect(() => {
    if (showInformationSheet) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [showInformationSheet]);

  // If showing information sheet, render it instead of the form
  if (showInformationSheet && formattedData) {
    return <InformationSheet formattedData={formattedData} employee={employee} onClose={handleCloseInformationSheet} />;
  }

  // Move the email generation functions inside the component
  const generateFirstDayEmail = (employee, selectedProperties, selectedDeliveryAddress, startDateTime) => {
    const employeeName = getEmployeeValue(employee, 'fullName');
    const firstName = employeeName ? employeeName.split(' ')[0] : 'New Employee';
    const startTime = startDateTime ? dayjs(startDateTime).format('h:mm A') : 'TBD';
    const propertyName = selectedDeliveryAddress?.label || 'TBD';
    const employeeEmail = getEmployeeValue(employee, 'personalEmail');

    // Build the recipients list
    const recipients = [employeeEmail, 'brian@newburyresidential.com', 'eric@newburyresidential.com'];

    // Add property-specific emails if delivery address has a domain
    if (selectedDeliveryAddress?.domain) {
      const domain = selectedDeliveryAddress.domain;
      recipients.push(`manager@${domain}`, `maintenance@${domain}`);
    }

    const subject = `Welcome ${employeeName}!`;

    const body = `Good morning Team,

We're excited to welcome ${employeeName}, starting their role today at ${propertyName}. Please join me in welcoming ${firstName} to the team and help ensure they have everything they need for a smooth first day.

Use the attached IT Setup Sheet to get ${firstName} set up in our systems.
 
We're excited to welcome ${firstName} and look forward to their success with the team.

Thank you,`;

    return { subject, body, recipients };
  };

  const handleFirstDayEmail = () => {
    const { subject, body, recipients } = generateFirstDayEmail(employee, selectedProperties, selectedDeliveryAddress, startDateTime);

    // Create mailto link with recipients
    const mailtoLink = `mailto:${recipients.join(';')}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Open the email client
    window.open(mailtoLink, '_blank');
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ maxWidth: 'lg', mx: 'auto' }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Header */}

          {/* Offer Letter Viewer */}
          <OfferLetterViewer employee={employee} />

          {/* Employee Information */}
          <EmployeeInformation employee={employee} control={control} />

          {/* Position Section - Modified to use custom handler */}
          <Card sx={{ mb: 3, overflow: 'visible' }}>
            <CardContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  {CHECKLIST_DATA.position.title}
                </Typography>
              </Box>

              <Controller
                name="selectedPosition"
                control={control}
                render={({ field }) => (
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 1.5,
                      alignItems: 'center',
                    }}
                  >
                    {CHECKLIST_DATA.position.items.map((item) => (
                      <PositionCard
                        key={item.id}
                        item={item}
                        isSelected={selectedPosition === item.id}
                        onSelect={(id) => {
                          const newPosition = selectedPosition === id ? null : id;
                          field.onChange(newPosition);
                          if (newPosition) {
                            handlePositionChange(newPosition);
                          }
                        }}
                      />
                    ))}
                  </Box>
                )}
              />
            </CardContent>
          </Card>

          {/* Properties Section */}
          <PropertiesSection
            title={CHECKLIST_DATA.properties.title}
            control={control}
            newburyAssets={newburyAssets}
            hasScheduledMeeting={hasScheduledMeeting}
            handleTimeChange={handleTimeChange}
            handleTimeAccept={handleTimeAccept}
            handleTimeClose={handleTimeClose}
          />

          {/* Other Checklist Sections */}
          {Object.entries(CHECKLIST_DATA)
            .filter(([key]) => !['position', 'properties'].includes(key))
            .map(([sectionKey, section]) => (
              <ChecklistSection
                key={sectionKey}
                title={section.title}
                items={section.items}
                control={control}
                watch={watch}
                setValue={setValue}
                getValues={getValues}
              />
            ))}

          {/* Action Buttons */}
          <Paper sx={{ p: 3, borderRadius: 2, position: 'sticky', bottom: 0, zIndex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="outlined" size="large" onClick={handleOpenRemindDialog}>
                  Remind
                </Button>
                {hasScheduledMeeting ? (
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={handleCancelMeeting}
                    disabled={isCancelingMeeting}
                    startIcon={isCancelingMeeting ? <CircularProgress size={20} color="inherit" /> : <CalendarMonthIcon />}
                    sx={{
                      color: 'success.main',
                      borderColor: 'success.main',
                      '&:hover': {
                        color: 'error.main',
                        borderColor: 'error.main',
                        backgroundColor: 'error.lighter',
                      },
                    }}
                  >
                    {isCancelingMeeting ? 'Canceling...' : 'Cancel Scheduled Meeting'}
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={onDraftCalendarInvite}
                    startIcon={<CalendarMonthIcon />}
                    disabled={!areBasicFieldsComplete()}
                    sx={{
                      ...(areBasicFieldsComplete()
                        ? {}
                        : {
                            '&.Mui-disabled': {
                              color: 'text.disabled',
                              borderColor: 'divider',
                            },
                          }),
                    }}
                  >
                    Draft Calendar Invite
                  </Button>
                )}
                <Button variant="outlined" size="large" type="submit" disabled={!areBasicFieldsComplete()}>
                  Generate PDF
                </Button>
                <Button variant="outlined" size="large" onClick={handleFirstDayEmail} disabled={!areBasicFieldsComplete()}>
                  First Day Email
                </Button>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <LoadingButton variant="outlined" size="large" onClick={onSaveDraft} loading={isSavingDraft} loadingPosition="start">
                  Save
                </LoadingButton>
                <LoadingButton
                  variant="contained"
                  size="large"
                  onClick={onRequestPermissions}
                  disabled={!areAllFieldsComplete()}
                  loading={isRequestingPermissions}
                  loadingPosition="start"
                  sx={{
                    ...(areAllFieldsComplete()
                      ? {}
                      : {
                          '&.Mui-disabled': {
                            color: 'text.disabled',
                            bgcolor: 'action.disabledBackground',
                          },
                        }),
                  }}
                >
                  Ready/Email Mike
                </LoadingButton>
              </Box>
            </Box>
          </Paper>
        </form>

        {/* Teams Invite Dialog */}
        <TeamsInviteDialog
          open={showTeamsDialog}
          onClose={handleCloseTeamsDialog}
          onMeetingCreated={() => {
            handleCloseTeamsDialog();
            // No page refresh - let revalidatePath handle the update
          }}
          formData={{
            startDateTime: watch('startDateTime'),
            selectedProperties: watch('selectedProperties'),
            selectedDeliveryAddress: watch('selectedDeliveryAddress'),
          }}
          selectedPosition={CHECKLIST_DATA.position.items.find((item) => item.id === selectedPosition)}
          employee={employee}
        />

        {/* Preset Confirmation Dialog - SIMPLIFIED */}
        <Dialog open={showPresetDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WarningIcon color="warning" />
              <Typography variant="h6">Apply Position Defaults?</Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ mb: 2 }}>
              This will replace your current selections with the default access for{' '}
              <strong>{CHECKLIST_DATA.position.items.find((item) => item.id === pendingPosition)?.label}</strong>.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              You can still make changes after applying the defaults.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handlePresetCancel}>Keep Current</Button>
            <Button onClick={handlePresetConfirm} variant="contained" color="warning">
              Apply Defaults
            </Button>
          </DialogActions>
        </Dialog>

        {/* Update Time Dialog */}
        <Dialog open={showUpdateTimeDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarMonthIcon color="primary" />
              <Typography variant="h6">Update Scheduled Meeting?</Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ mb: 2 }}>
              You have a scheduled meeting on{' '}
              <strong>{startDateTime ? dayjs(startDateTime).format('MMMM D, YYYY [at] h:mm A') : ''}</strong>.
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Would you like to update the meeting to the new time:{' '}
              <strong>{pendingTimeChange ? dayjs(pendingTimeChange).format('MMMM D, YYYY [at] h:mm A') : ''}?</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This will send updated invitations to all attendees
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelTimeChange} disabled={isUpdatingMeeting}>
              Cancel
            </Button>
            <LoadingButton
              onClick={handleUpdateExistingMeeting}
              variant="contained"
              color="primary"
              loading={isUpdatingMeeting}
              loadingPosition="start"
              startIcon={<CalendarMonthIcon />}
            >
              Update Meeting
            </LoadingButton>
          </DialogActions>
        </Dialog>

        {/* Remind Dialog */}
        <Dialog open={showRemindDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EmailIcon color="primary" />
              <Typography variant="h6">Send Reminder</Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Who would you like to remind to complete the access checklist for <strong>{getEmployeeValue(employee, 'fullName')}</strong>?
            </Typography>

            <Box sx={{ mb: 3 }}>
              <AutocompleteSelectEmployees
                employees={employees}
                multiple={true}
                label="Select Employees to Remind"
                placeholder="Search for employees..."
                currentValue={selectedEmployeesToRemind}
                onChange={setSelectedEmployeesToRemind}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseRemindDialog}>Cancel</Button>
            <Button
              onClick={handleSendReminder}
              variant="outlined"
              disabled={selectedEmployeesToRemind.length === 0 || isRemindingSending}
              startIcon={isRemindingSending ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
            >
              {isRemindingSending ? 'Sending...' : `Send Reminder (${selectedEmployeesToRemind.length})`}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
}
