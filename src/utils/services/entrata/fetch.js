import { ENTRATA_API } from "src/config-global";

export default async function fetchData(endpoint, bodyMethod) {
    const url = `${ENTRATA_API.baseUrl}${endpoint}`;
    const basicAuth = Buffer.from(`${ENTRATA_API.username}:${ENTRATA_API.password}`).toString('base64');
    const body = {
        auth: { type: "basic" },
        requestId: "15",
        method: { name: bodyMethod }
    };

    try {
        const response = await fetch(url, {
            cache: 'no-store', 
            //cache: 'force-cache',
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
        return await response.json();
    } catch (error) {
        console.error(`Fetch ${bodyMethod} failed:`, error);
        throw error;
    }
}
