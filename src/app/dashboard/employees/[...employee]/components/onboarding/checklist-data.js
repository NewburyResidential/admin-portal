// Access item states
export const ACCESS_STATES = {
  NOT_SELECTED: 'not_selected',
  REQUESTED: 'requested',
  ASSIGNED: 'assigned',
};

// Static data for the checklist
export const CHECKLIST_DATA = {
  position: {
    title: 'Position',
    type: 'single_select', // Special type for position
    items: [
      { id: 'community_manager', label: 'Community Manager', employeeLabel: 'Community Manager Position' },
      { id: 'assistant_manager', label: 'Assistant Manager', employeeLabel: 'Assistant Manager Position' },
      { id: 'leasing_agent', label: 'Leasing Agent', employeeLabel: 'Leasing Agent Position' },
      { id: 'maintenance_supervisor', label: 'Maintenance Supervisor', employeeLabel: 'Maintenance Supervisor Position' },
      { id: 'maintenance_technician', label: 'Maintenance Technician', employeeLabel: 'Maintenance Technician Position' },
      {
        id: 'carpenter_make_ready',
        label: 'Carpenter and Make Ready Technician',
        employeeLabel: 'Carpenter and Make Ready Technician Position',
      },
      { id: 'painter', label: 'Painter', employeeLabel: 'Painter Position' },
      { id: 'lead_carpenter', label: 'Lead Carpenter', employeeLabel: 'Lead Carpenter Position' },
    ],
  },
  properties: {
    title: 'Properties',
    // Properties will be dynamically populated from newburyAssets
    // No static items array - this will be handled in the component
  },
  systemAccess: {
    title: 'System and Software Access',
    category: 'System and Software Access',
    items: [
      {
        id: 'office_365',
        label: 'Microsoft Outlook & Teams',
        employeeLabel: 'Microsoft Teams, Outlook, SharePoint & OneDrive',
        url: 'https://office.com',
        loginLabel: 'Login with SSO',
        followUpOptions: [
          { value: 'no_desktop', label: 'Mobile and Web Version Only' },
          { value: 'with_desktop', label: 'Include Desktop Apps (Outlook, Excel, Word)' },
        ],
        mobileApp: ['Microsoft Teams', 'Outlook', 'OneDrive'],
      },
      {
        id: 'shared_email_groups',
        label: 'Shared Email Groups',
        showInPreview: false,
        url: 'https://outlook.office.com',
        loginLabel: 'Login with SSO',
        followUpOptions: [
          { value: 'leasing_email', label: 'Leasing Email' },
          { value: 'maintenance_email', label: 'Maintenance Email' },
          { value: 'manager_email', label: 'Manager Email' },
        ],
      },
      // {
      //   id: 'keeper',
      //   label: 'Keeper Password Manager',
      //   employeeLabel: 'Keeper Password Manager',
      //   url: 'https://launcher.myapps.microsoft.com/api/signin/f4945b1e-6fce-4c4a-8e1c-8e2df96573c3?tenantId=7d96eabe-af08-470d-ac00-18a43c240156',
      //   loginLabel: 'Login with SSO',
      //   mobileApp: ['Keeper'],
      // },
      {
        id: 'entrata',
        label: 'Entrata',
        employeeLabel: 'Entrata',
        url: 'https://newburyresidential.entrata.com',
        loginLabel: 'Login with SSO',
        hasFollowUp: true,
        followUpType: 'role_selection',
        followUpLabel: 'Entrata Role',
        followUpOptions: [
          { value: 'leasingAgent', label: 'Leasing Agent' },
          { value: 'assistantManager', label: 'Assistant Manager' },
          { value: 'communityManager', label: 'Community Manager' },
          { value: 'operationsStaff', label: 'Operations Staff' },
          { value: 'maintenanceSupervisor', label: 'Maintenance Supervisor' },
          { value: 'regionalOperations', label: 'Regional Operations' },
      
        ],
        mobileApp: ['Entrata Facilities'],
      },
      {
        id: 'teams_groups',
        label: 'Teams/Sharepoint Property Folders',
        employeeLabel: 'Teams & Sharepoint Property Folders',
        url: 'https://teams.microsoft.com',
        loginLabel: 'Login with SSO',
      },
      {
        id: 'notion',
        label: 'Notion Property Folders',
        employeeLabel: 'Notion',
        url: 'https://notion.so',
        loginLabel: 'Login with SSO',
        mobileApp: ['Notion'],
      },
      {
        id: 'notify_hellospoke',
        label: 'Notify (HelloSpoke)',
        employeeLabel: 'HelloSpoke On-Call (Notify)',
        url: 'https://hellospoke.com',
        loginLabel: 'Keeper',
        mobileApp: ['HelloSpoke Notify'],
        hasFollowUp: true,
        followUpType: 'role_selection',
        followUpLabel: 'Access Type',
        followUpOptions: [
          { value: 'on_call_only', label: 'On-call only' },
          { value: 'scheduler', label: 'Scheduler & On-call' },
        ],
      },
      {
        id: 'drivers_note',
        label: 'DriversNote.com',
        employeeLabel: 'DriversNote Mile Tracking',
        url: 'https://driversnote.com',
        loginLabel: 'Keeper',
        mobileApp: ['DriversNote'],
      },
      {
        id: 'unifi_camera',
        label: 'Unifi Camera Access',
        employeeLabel: 'Unifi Camera Access',
        url: 'https://unifi.ui.com',
        loginLabel: 'Keeper',
        mobileApp: ['UniFi'],
      },
    ],
  },
  procurement: {
    title: 'Procurement Accounts',
    category: 'Procurement Accounts',
    items: [
      {
        id: 'lowes',
        label: 'Lowes.com & Synchrony',
        employeeLabel: 'Lowes.com',
        url: 'https://lowes.com',
        loginLabel: 'Keeper',
        hasFollowUp: true,
        followUpType: 'purchase_limit',
        followUpLabel: 'Purchase Limit',
        followUpOptions: [
          { value: '2000', label: '$2,000' },
          { value: '5000', label: '$5,000' },
          { value: '10000', label: '$10,000' },
          { value: 'custom', label: 'Custom Amount' },
        ],
      },
      {
        id: 'amazon',
        label: 'Amazon.com',
        employeeLabel: 'Amazon.com',
        url: 'https://business.amazon.com',
        loginLabel: 'Keeper',
      },
      {
        id: 'supply_house',
        label: 'SupplyHouse.com',
        employeeLabel: 'SupplyHouse.com',
        url: 'https://supplyhouse.com',
        loginLabel: 'Keeper',
      },
      {
        id: 'credit_card',
        label: 'Purchasing Credit Card (Bank of America)',
        employeeLabel: 'Bank of America P-Card',
        url: 'https://bankofamerica.com',
        loginLabel: 'Keeper',
        hasFollowUp: true,
        followUpType: 'credit_limit_and_property',
        followUpLabel: 'Credit Limit & Delivery Property',
        followUpOptions: [
          { value: '2000', label: '$2,000' },
          { value: '3000', label: '$3,000' },
          { value: '5000', label: '$5,000' },
          { value: '10000', label: '$10,000' },
          { value: 'custom', label: 'Custom Amount' },
        ],
      },
    ],
  },
  ppe: {
    title: 'Personal Protective Equipment (PPE) and Shirts',
    category: 'Personal Protective Equipment and Uniforms',
    items: [
      {
        id: 'glove_size',
        label: 'Glove Size',
        employeeLabel: 'Work Gloves (Safety Equipment)',
        hasFollowUp: true,
        followUpType: 'size_selection',
        followUpLabel: 'Glove Size',
        followUpOptions: [
          { value: 'S', label: 'Small' },
          { value: 'M', label: 'Medium' },
          { value: 'L', label: 'Large' },
          { value: 'XL', label: 'X-Large' },
          { value: 'XXL', label: 'XX-Large' },
          { value: 'XXXL', label: 'XXX-Large' },
        ],
      },
      {
        id: 'shirt_size',
        label: 'Shirt Size',
        employeeLabel: 'Company Uniform Shirts',
        hasFollowUp: true,
        followUpType: 'size_selection',
        followUpLabel: 'Shirt Size',
        followUpOptions: [
          { value: 'S', label: 'Small' },
          { value: 'M', label: 'Medium' },
          { value: 'L', label: 'Large' },
          { value: 'XL', label: 'X-Large' },
          { value: 'XXL', label: 'XX-Large' },
          { value: 'XXXL', label: 'XXX-Large' },
        ],
      },
    ],
  },
};

// Helper function to resolve follow-up data values to full option objects
export const resolveFollowUpPreset = (itemId, presetFollowUpData) => {
  if (!presetFollowUpData) return null;

  const itemDetails = findItemDetails(itemId);
  if (!itemDetails?.followUpOptions) return presetFollowUpData;

  const resolved = { ...presetFollowUpData };

  // Handle different follow-up types
  if (resolved.selectedRoles && Array.isArray(resolved.selectedRoles)) {
    // For arrays of values (like Entrata roles, shared email groups)
    resolved.selectedRoles = resolved.selectedRoles.map((roleValue) => {
      if (typeof roleValue === 'string') {
        return itemDetails.followUpOptions.find((option) => option.value === roleValue) || { value: roleValue, label: roleValue };
      }
      return roleValue; // Already an object
    });
  }

  if (resolved.selectedEmailGroups && Array.isArray(resolved.selectedEmailGroups)) {
    resolved.selectedEmailGroups = resolved.selectedEmailGroups.map((emailValue) => {
      if (typeof emailValue === 'string') {
        return itemDetails.followUpOptions.find((option) => option.value === emailValue) || { value: emailValue, label: emailValue };
      }
      return emailValue;
    });
  }

  // Handle single selection types
  ['selectedAccessType', 'selectedLimit', 'selectedSize', 'selectedDesktopOption'].forEach((key) => {
    if (resolved[key] && typeof resolved[key] === 'string') {
      resolved[key] = itemDetails.followUpOptions.find((option) => option.value === resolved[key]) || {
        value: resolved[key],
        label: resolved[key],
      };
    }
  });

  return resolved;
};

// Position-based preselection configurations - SIMPLIFIED
export const POSITION_PRESETS = {
  assistant_manager: {
    accessStates: {},
  },
  community_manager: {
    accessStates: {},
  },
  leasing_agent: {
    accessStates: {},
  },
  maintenance_supervisor: {
    accessStates: {
      // System Access - Between technician and supervisor
      office_365: ACCESS_STATES.REQUESTED,
      shared_email_groups: ACCESS_STATES.REQUESTED,
      keeper: ACCESS_STATES.REQUESTED,
      entrata: ACCESS_STATES.REQUESTED,
      teams_groups: ACCESS_STATES.REQUESTED,
      notify_hellospoke: ACCESS_STATES.REQUESTED,
      lowes: ACCESS_STATES.REQUESTED,
      amazon: ACCESS_STATES.REQUESTED,
      supply_house: ACCESS_STATES.REQUESTED,
      credit_card: ACCESS_STATES.REQUESTED,
      drivers_note: ACCESS_STATES.REQUESTED,
      unifi_camera: ACCESS_STATES.REQUESTED,
    },
    followUpData: {
      office_365: {
        selectedDesktopOption: 'with_desktop',
      },
      entrata: {
        selectedRoles: ['maintenanceSupervisor'],
      },
      notify_hellospoke: {
        selectedAccessType: 'scheduler',
      },
      lowes: {
        selectedLimit: '5000',
      },
      credit_card: {
        selectedLimit: '5000',
      },
      shared_email_groups: {
        selectedEmailGroups: ['maintenance_email'],
      },
    },
  },
  maintenance_technician: {
    accessStates: {
      office_365: ACCESS_STATES.REQUESTED,
      entrata: ACCESS_STATES.REQUESTED,
      notify_hellospoke: ACCESS_STATES.REQUESTED,
    },
    followUpData: {
      office_365: {
        selectedDesktopOption: 'no_desktop',
      },
      entrata: {
        selectedRoles: ['operationsStaff'],
      },
      notify_hellospoke: {
        selectedAccessType: 'on_call_only',
      },
    },
  },
  carpenter_make_ready: {
    accessStates: {
      office_365: ACCESS_STATES.REQUESTED,
      entrata: ACCESS_STATES.REQUESTED,
      notify_hellospoke: ACCESS_STATES.REQUESTED,
    },
    followUpData: {
      office_365: {
        selectedDesktopOption: 'no_desktop',
      },
      entrata: {
        selectedRoles: ['operationsStaff'],
      },
      notify_hellospoke: {
        selectedAccessType: 'on_call_only',
      },
    },
  },
  painter: {
    accessStates: {
      office_365: ACCESS_STATES.REQUESTED,
      entrata: ACCESS_STATES.REQUESTED,
      notify_hellospoke: ACCESS_STATES.REQUESTED,
    },
    followUpData: {
      office_365: {
        selectedDesktopOption: 'no_desktop',
      },
      entrata: {
        selectedRoles: ['operationsStaff'],
      },
      notify_hellospoke: {
        selectedAccessType: 'on_call_only',
      },
    },
  },
  lead_carpenter: {
    accessStates: {
      // System Access - Between technician and supervisor
      office_365: ACCESS_STATES.REQUESTED,
      keeper: ACCESS_STATES.REQUESTED,
      entrata: ACCESS_STATES.REQUESTED,
      teams_groups: ACCESS_STATES.REQUESTED,
      notify_hellospoke: ACCESS_STATES.REQUESTED,
      lowes: ACCESS_STATES.REQUESTED,
      amazon: ACCESS_STATES.REQUESTED,
      supply_house: ACCESS_STATES.REQUESTED,
      credit_card: ACCESS_STATES.REQUESTED,
    },
    followUpData: {
      office_365: {
        selectedDesktopOption: 'no_desktop',
      },
      entrata: {
        selectedRoles: ['operationsStaff'],
      },
      notify_hellospoke: {
        selectedAccessType: 'on_call_only',
      },
      lowes: {
        selectedLimit: '2000',
      },
      credit_card: {
        selectedLimit: '2000',
      },
    },
  },
};

// Function to get preselected configuration for a position
export const getPositionPreset = (positionId) => {
  const preset = POSITION_PRESETS[positionId];
  if (!preset) return null;

  // Resolve follow-up data from values to full objects
  const resolvedFollowUpData = {};
  if (preset.followUpData) {
    Object.entries(preset.followUpData).forEach(([itemId, followUpData]) => {
      resolvedFollowUpData[itemId] = resolveFollowUpPreset(itemId, followUpData);
    });
  }

  return {
    ...preset,
    followUpData: resolvedFollowUpData,
  };
};

// Helper function to find item details
export const findItemDetails = (itemId) => {
  for (const [sectionKey, section] of Object.entries(CHECKLIST_DATA)) {
    if (sectionKey === 'position' || sectionKey === 'properties') continue;

    const item = section.items.find((item) => item.id === itemId);
    if (item) {
      return {
        ...item,
        category: section.category || section.title,
        sectionKey,
      };
    }
  }
  return null;
};
