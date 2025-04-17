'use server';

import axios from 'axios';
import { ENTRATA_API, ENTRATA_API_KEY } from 'src/config-global';

const ENTRATA_BASE_URL = `${ENTRATA_API.baseUrl}/v1/vendors`;
const VENDOR_ADD = 'add';
const VENDOR_FETCH = 'fetch';
const VENDOR_UPDATE = 'update';

export default async function addVendor(data) {
  const upperCaseVendorValue = data.vendor
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  try {
    const newVendorId = await fetchVendor(upperCaseVendorValue, VENDOR_ADD);
    const {entityId, locationId} = await fetchVendor(newVendorId, VENDOR_FETCH);
    const newVendorObject = {
      name: upperCaseVendorValue, 
      id: locationId, 
      vendorId: newVendorId, 
      defaultGl: null
    };
    
    const finalFetchSucceeded = await fetchVendor({ 
      entityId, 
      newVendorId, 
      entityType: data.entityType, 
      informationReturn: data.informationReturn 
    }, VENDOR_UPDATE);

    console.log(finalFetchSucceeded);
    if (finalFetchSucceeded !== 200) {
      console.error('Error: Failed to add vendor: final fetch did not occur');
      return null;
    }

    return newVendorObject;
  } catch (error) {
    console.error('Error fetching data: ', error);
    return null;
  }
}

async function fetchVendor(data, type) {
  let postData;

  switch (type) {
    case VENDOR_ADD:
      postData = await buildAddVendor(data);
      break;
    case VENDOR_FETCH:
      postData = await buildFetchNewVendor(data);
      break;
    case VENDOR_UPDATE:
      postData = await buildUpdateVendor(data);
      break;
    default:
      throw new Error(`Invalid vendor type: ${type}`);
  }

  try {
    const response = await axios.post(ENTRATA_BASE_URL, postData, {
      headers: {
        'X-Api-Key': ENTRATA_API_KEY
      }
    });

    console.log(JSON.stringify(response.data));

    if (type === VENDOR_ADD) return response.data.response.result.vendors.vendor[0]['@attributes'].vendorId;
    if (type === VENDOR_FETCH) return {
      entityId: response.data.response.result.vendors.vendor[0].legalEntities.legalEntity[0].id, 
      locationId: response.data.response.result.vendors.vendor[0].locations.location[0].id
    };
    if (type === VENDOR_UPDATE) return response.data.response.code;

    return null;
  } catch (error) {
    console.error('Error: Failed to add vendor:', error);
    throw error;
  }
}

async function buildAddVendor(vendor) {
  const vendorCode = vendor.replace(/\s/g, '-');

  return {
    auth: {
      type: 'apikey',
    },
    requestId: '15',
    method: {
      name: 'sendVendors',
      params: {
        vendors: {
          vendor: [
            {
              businessName: vendor,
              nameOnTaxReturn: vendor,
              externalId: vendor,
              isOnSite: '0',
              isConsolidated: '0',
              isRequirePoForInvoice: '0',
              locations: {
                location: [
                  {
                    name: 'Corporate',
                    vendorCode: vendorCode,
                    isPrimary: '1',
                    approvedForAllProperties: '1',
                    remittances: {
                      remittance: [
                        {
                          apPaymentTypeId: '4',
                          remittanceName: 'Credit Card',
                          isDefault: '1',
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    },
  };
}

async function buildFetchNewVendor(vendorId) {
  return {
    auth: {
      type: 'apikey',
    },
    requestId: '15',
    method: {
      name: 'getVendors',
      params: {
        vendorIds: vendorId,
      },
    },
  };
}

async function buildUpdateVendor(data) {
  return {
    auth: {
      type: 'apikey',
    },
    requestId: '15',
    method: {
      name: 'updateVendors',
      params: {
        vendors: {
          vendor: {
            vendorId: data.newVendorId,
            legalEntities: {
              legalEntity: [
                {
                  id: data.entityId,
                  ownerTypeId: data.entityType,
                  receives1099: data.informationReturn ? "1" : "0"
                },
              ],
            },
          },
        },
      },
    },
  };
}
