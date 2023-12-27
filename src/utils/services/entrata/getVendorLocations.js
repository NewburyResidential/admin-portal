import fetchData from "./fetch";

function condenseVendorData(vendorsObject) {
    const vendorsArray = Object.values(vendorsObject);
    const vendorIdMap = new Map();
    const nameCount = {};

    vendorsArray.forEach(vendor => {
        const vendorId = vendor.VendorId;
        vendorIdMap.set(vendorId, (vendorIdMap.get(vendorId) || []).concat(vendor));
        nameCount[vendor.VendorName] = (nameCount[vendor.VendorName] || 0) + 1;
    });

    return vendorsArray.map(vendor => {
        const condensedVendor = {
            name: vendor.VendorName,
            id: vendor['@attributes'].Id,
            vendorId: vendor.VendorId,
            defaultGl: vendor.Accounts?.Account?.[0]?.GlAccountId || null
        };

        if (nameCount[vendor.VendorName] > 1) {
            condensedVendor.name += ` (${condensedVendor.id})`;
        }

        return condensedVendor;
    });
}

export default async function getVendorLocations() {
    const data = await fetchData('/api/v1/vendors', "getVendorLocations");
    const vendorObjects = data.response.result.Locations.Location;
    return condenseVendorData(vendorObjects);
}

