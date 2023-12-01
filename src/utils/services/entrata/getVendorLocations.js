import fetchData from "./fetch";

function condenseVendorData(vendorsObject) {
    const vendorsArray = Object.values(vendorsObject); 
    const condensedVendors = vendorsArray.map(vendor => {
        return {
            name: vendor.VendorName,
            id: vendor['@attributes'].Id,
            vendorId: vendor.VendorId
        };
    });
    return condensedVendors;
}

export default async function getVendorLocations() {
    const data = await fetchData('/api/v1/vendors', "getVendorLocations");
    const vendorObjects = data.response.result.Locations.Location;
    return condenseVendorData(vendorObjects);
    //return data;
}

