'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  Chip,
  Grid,
  Divider,
} from '@mui/material';
import { Close as CloseIcon, Schedule as ScheduleIcon, Person as PersonIcon } from '@mui/icons-material';
import createOnboardingTeamsMeeting from 'src/utils/services/employees/create-onboarding-teams-meeting';
import updateEmployee from 'src/utils/services/employees/update-employee';

export default function TeamsInviteDialog({ open, onClose, onMeetingCreated, formData, selectedPosition, employee }) {
  const [description, setDescription] = useState('');
  const [attendees, setAttendees] = useState([
    'mike@newburyresidential.com',
    'brian@newburyresidential.com',
    'eric@newburyresidential.com',
    'sbrown@newburyresidential.com',
  ]);

  const [newAttendee, setNewAttendee] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const hasInitialized = useRef(false);

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
        case 'workEmail':
          return employee.workEmail?.S || employee.workEmail || '';
        case 'personalEmail':
          return employee.personalEmail?.S || employee.personalEmail || '';
        case 'personalPhone':
          return employee.personalPhone?.S || employee.personalPhone || '';
        case 'primaryEmail':
          return employee.primaryEmail?.S || employee.primaryEmail || '';
        default:
          return employee[field]?.S || employee[field] || '';
      }
    }

    // Fallback to direct access for backward compatibility
    return employee[field] || '';
  };

  // Get employee name
  const getEmployeeName = () => {
    return getEmployeeValue(employee, 'fullName');
  };

  // Get meeting title
  const getMeetingTitle = () => {
    const employeeName = getEmployeeName();
    const startProperty = formData?.selectedDeliveryAddress?.label || 'Office';
    return `${employeeName} starts at ${startProperty}`;
  };

  // Function to add property-specific emails based on domain
  const addPropertyEmails = (deliveryAddress) => {
    if (!deliveryAddress || !deliveryAddress.domain) {
      return;
    }

    const domain = deliveryAddress.domain;
    const propertyEmails = [`manager@${domain}`, `maintenance@${domain}`];

    // Add property emails if they're not already in the attendees list
    setAttendees((prevAttendees) => {
      const newAttendees = [...prevAttendees];
      propertyEmails.forEach((email) => {
        if (!newAttendees.includes(email)) {
          newAttendees.push(email);
        }
      });
      return newAttendees;
    });
  };

  // Function to convert plain text to HTML for Teams
  const convertToTeamsHTML = (text) => {
    return (
      text
        .split('\n')
        .map((line) => {
          if (line.trim() === '') {
            return '<br/>'; // Empty lines become line breaks
          }
          // Convert bullet points
          if (line.trim().startsWith('•')) {
            return `<div style="margin-left: 20px;">${line.trim()}</div>`;
          }
          // Regular lines become paragraphs
          return `<div>${line.trim()}</div>`;
        })
        .join('') + '<br/><br/>'
    ); // Add extra line spaces at the end
  };

  // Initialize description when dialog opens
  if (open && !hasInitialized.current && formData?.startDateTime && selectedPosition) {
    const employeeName = getEmployeeName();
    const startProperty = formData?.selectedDeliveryAddress?.label || 'Office';
    const startDate = formData.startDateTime.format('MMMM D, YYYY');
    const startTime = formData.startDateTime.format('h:mm A');
    const jobTitle = selectedPosition?.label || 'Team Member';

    // Create the description as plain text first
    const plainTextDescription = `Hi Team,

${employeeName} will be starting with us as a ${jobTitle} on ${startDate} at ${startTime} at ${startProperty}.

Please accept this invite to add it to your calendar and help ensure ${employeeName} has everything they need for their first day. In case you need to reach out, I've included his personal email and phone number below.

Email: ${getEmployeeValue(employee, 'personalEmail')}
Phone: ${getEmployeeValue(employee, 'personalPhone')}

Looking forward to having ${employeeName} on our team!`;

    setDescription(plainTextDescription);

    // Add property-specific emails if delivery address is selected
    // if (formData?.selectedDeliveryAddress) {
    //   addPropertyEmails(formData.selectedDeliveryAddress);
    // }

    hasInitialized.current = true;
  }

  // Reset when dialog closes
  if (!open && hasInitialized.current) {
    hasInitialized.current = false;
    setDescription('');
    setAttendees(['mike@newburyresidential.com', 'brian@newburyresidential.com', 'eric@newburyresidential.com', 'sbrown@newburyresidential.com']);
    setNewAttendee('');
  }

  // Effect to handle delivery address changes
  // useEffect(() => {
  //   if (open && formData?.selectedDeliveryAddress) {
  //     addPropertyEmails(formData.selectedDeliveryAddress);
  //   }
  // }, [open, formData?.selectedDeliveryAddress]);

  const handleAddAttendee = () => {
    if (newAttendee.trim() && !attendees.includes(newAttendee.trim())) {
      setAttendees([...attendees, newAttendee.trim()]);
      setNewAttendee('');
    }
  };

  const handleRemoveAttendee = (emailToRemove) => {
    setAttendees(attendees.filter((email) => email !== emailToRemove));
  };

  const handleCreateMeeting = async () => {
    if (!formData?.startDateTime) {
      console.error('No start date and time available');
      return;
    }

    setIsCreating(true);

    try {
      const endDateTime = formData.startDateTime.add(30, 'minutes');
      const subject = getMeetingTitle();

      // Convert the description to HTML for Teams
      const htmlDescription = convertToTeamsHTML(description);

      const result = await createOnboardingTeamsMeeting({
        subject,
        startDateTime: formData.startDateTime.toISOString(),
        endDateTime: endDateTime.toISOString(),
        attendees,
        description: htmlDescription, // Send the HTML version
        organizerEmail: 'calendarscheduler@newburyresidential.com',
      });

      if (result.success) {
        console.log('Teams meeting created successfully:', {
          eventId: result.eventId,
          joinUrl: result.teamsJoinUrl,
          conferenceId: result.teamsConferenceId,
        });

        // Update employee record with the scheduled meeting info
        if (employee?.pk && result.eventId) {
          try {
            console.log('Updating employee with meeting info:', {
              pk: employee.pk,
              eventId: result.eventId,
              existingOnboarding: employee.onboarding,
            });

            // Create onboarding update that preserves existing data
            const existingOnboarding = employee.onboarding || {};
            const onboardingUpdate = {
              ...existingOnboarding,
              scheduledMeeting: result.eventId,
              // Add the meeting date and time to the employee data
              meetingDateTime: formData.startDateTime.toISOString(),
              meetingEndDateTime: endDateTime.toISOString(),
            };

            // Also update the accessChecklist data to ensure the current form data is saved
            const existingAccessChecklist = existingOnboarding.accessChecklist || {};
            const accessChecklistUpdate = {
              ...existingAccessChecklist,
              startDateTime: formData.startDateTime.toISOString(),
              selectedProperties: formData.selectedProperties || [],
              selectedDeliveryAddress: formData.selectedDeliveryAddress,
            };

            const updateResult = await updateEmployee({
              pk: employee.pk,
              attributes: {
                onboarding: {
                  ...onboardingUpdate,
                  accessChecklist: accessChecklistUpdate,
                },
              },
            });

            console.log('Update result:', updateResult);

            // Check if the update was successful based on the snackbar response structure
            if (updateResult && updateResult.severity === 'success') {
              console.log('Employee updated with scheduled meeting info successfully');
            } else {
              console.error('Failed to update employee with meeting info:', updateResult);
            }
          } catch (updateError) {
            console.error('Error updating employee with meeting info:', updateError);
          }
        }

        // Call the onMeetingCreated callback if provided
        if (onMeetingCreated) {
          onMeetingCreated();
        } else {
          onClose();
        }
      } else {
        console.error('Failed to create Teams meeting:', result.error);
      }
    } catch (error) {
      console.error('Error creating Teams meeting:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddAttendee();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ScheduleIcon color="primary" />
            <Typography variant="h6">Create Teams Meeting</Typography>
          </Box>
          <IconButton onClick={onClose} disabled={isCreating}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {/* Meeting Date & Time - Read Only */}
          <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Meeting Schedule
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              <strong>Title:</strong> {getMeetingTitle()}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>Date:</strong> {formData?.startDateTime?.format('MMMM D, YYYY') || 'Not selected'}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>Time:</strong> {formData?.startDateTime?.format('h:mm A') || 'Not selected'}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2">
                  <strong>Duration:</strong> 30 minutes
                </Typography>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Attendees */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonIcon fontSize="small" />
              Attendees
            </Typography>

            {/* Current Attendees */}
            <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {attendees.map((email, index) => (
                <Chip
                  key={index}
                  label={email}
                  onDelete={() => handleRemoveAttendee(email)}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              ))}
            </Box>

            {/* Add Attendee */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                size="small"
                label="Add attendee email"
                value={newAttendee}
                onChange={(e) => setNewAttendee(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="email@example.com"
                type="email"
                fullWidth
              />
              <Button variant="outlined" onClick={handleAddAttendee} disabled={!newAttendee.trim()}>
                Add
              </Button>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Description */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Meeting Description
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={12}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter meeting description..."
              variant="outlined"
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} disabled={isCreating}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleCreateMeeting}
          disabled={isCreating || !formData?.startDateTime || attendees.length === 0}
          startIcon={<ScheduleIcon />}
        >
          {isCreating ? 'Creating...' : 'Create Teams Meeting'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
