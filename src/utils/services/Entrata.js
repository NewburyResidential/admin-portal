


export async function fetchVendorLocations() {

    function condenseVendorData(vendorsObject) {
        const vendorsArray = Object.values(vendorsObject); 
        const condensedVendors = vendorsArray.map(vendor => {
          return {
            vendorName: vendor.VendorName,
            locationId: vendor['@attributes'].Id,
            vendorId: vendor.VendorId
          };
        });
      
        return condensedVendors;
      }

    // const url = process.env.ENTRATA_DEV_URL;
    // const username = process.env.ENTRATA_DEV_USERNAME;
    // const password = process.env.ENTRATA_DEV_PASSWORD;

    const url = process.env.ENTRATA_URL;
    const username = process.env.ENTRATA_USERNAME;
    const password = process.env.ENTRATA_PASSWORD;

    const basicAuth = Buffer.from(`${username}:${password}`).toString('base64');

    const body = {
        auth: { type: "basic" },
        requestId: "15",
        method: { name: "getVendorLocations" }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${basicAuth}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        const vendorObjects = data.response.result.Locations.Location
        const condensedVendors = condenseVendorData(vendorObjects);
      

        return condensedVendors;
    } catch (error) {
        console.error('Fetch Vendor Locations failed:', error);
        throw error;
    }
}

