'use server';

import { ENTRATA_API } from 'src/config-global';
import { authorization } from './authorization';

export default async function getVendorLocations() {
  const data = await fetchData();
  const vendorObjects = data.response.result.Locations.Location;
  return condenseVendorData(vendorObjects);
}

async function fetchData() {
  const endpoint = '/api/v1/vendors';
  const bodyMethod = 'getVendorLocations';
  const url = `${ENTRATA_API.baseUrl}${endpoint}`;
  const body = {
    auth: { type: 'basic' },
    requestId: '15',
    method: { name: bodyMethod },
  };

  try {
    const response = await fetch(url, {
      cache: 'no-store',
      next: { tags: ['vendors'] },
      method: 'POST',
      headers: {
        Authorization: authorization,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Fetch ${bodyMethod} failed:`, error);
    throw error;
  }
}

function condenseVendorData(vendorsObject) {
  const vendorsArray = Object.values(vendorsObject);
  const vendorIdMap = new Map();
  const nameCount = {};

  vendorsArray.forEach((vendor) => {
    const vendorId = vendor.VendorId;
    vendorIdMap.set(vendorId, (vendorIdMap.get(vendorId) || []).concat(vendor));
    nameCount[vendor.VendorName] = (nameCount[vendor.VendorName] || 0) + 1;
  });

  return vendorsArray.map((vendor) => {
    const condensedVendor = {
      name: vendor.VendorName,
      id: vendor['@attributes'].Id,
      vendorId: vendor.VendorId,
      defaultGl: vendor.Accounts?.Account?.[0]?.GlAccountId || null,
    };

    if (nameCount[vendor.VendorName] > 1) {
      condensedVendor.name += ` (${condensedVendor.id})`;
    }

    return condensedVendor;
  });
}
