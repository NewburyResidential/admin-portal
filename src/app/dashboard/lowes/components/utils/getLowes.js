"use server";

import axios from 'axios';

export default async function fetchProducts() {

    const headers = {
        "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"",
        "Referer": "https://www.lowes.com/",
        "sec-ch-ua-mobile": "?0",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
        "sec-ch-ua-platform": "\"Windows\"",
        "Cookie": "EPID=807c6f51-8b65-4b68-8903-e8f654cc44f8; _abck=F69AD2F9862859D605C83B7EFADA7FC4~-1~YAAQhGjcFwOtOp+RAQAAK5A+uQwlk8mfqIg3AXJCapcohUDvrPem5U7HWcXg5Kafv0+aEryMyy50Fk7UwS1tOX8lBeg3pptJW5mjSETfhoPyRQrat/waAQBJt/YGhtFeUyQbEjXWLJgdiKTGyeTbtk1GnWvtuy3C4Pva1xyI0LpXNh8MY/Yk4ufbllbuD51shZ7qFhDiYVPDZ5j6W+C2aaOZIzf8Ahub86cZ4VFPkwLhz8D97HyGERh2NzXPofh7dNU0qNzI0htbg+nR+9sy9Pwye9vkTPwHBVxMLjkZoFIkenI0Q3yBAgt3iUrI7ZskQVHs6+LBPHX37DBPryO2e0HUksP/4DXA72Hw7jRGhhp1TQohcGHE8WlSZ0AfUhPOZE0O/WWwbtpdm/vZQJbc3EVySKbpSSsX9NB50a627qHx/3KFYAuORETc/F4KaTuid9Q6dMQP3+UUQnfE~-1~-1~-1; ak_bmsc=25C600D4AE407C9F4298C459B64AB2CE~000000000000000000000000000000~YAAQhGjcFwStOp+RAQAAK5A+uRixcRibEzQkVCTFQqoHsUKdzzbDkQSjUw6qmSBYKBVZqv7WeQ1jprjSz2oDYHdEqQ44o1mw4nnRbJk5+VmCN6LtjrgMJ5VfYJ6Ebg0g9TWI/HyOA1eSwLMoN6Wf+7WJhc80U6xdvmUJLEe6De4ymM/wzkYLCfkXpet80DHpVH3mIiX0qI/VZvcORuRBC6qgVMOi7JKQQ9GuqQmwLHMPnLAUgdOAoLWKEPxjA1/QaNW7wBb2PlVKiuKHbLfC22Pg542kxLqsMW2TeaAejJbO0KCemPPP9YgTywnmqBX8W81L2DRUzUhAPpP1NidTH47BYnoXVt8yD/nZCzuLqko5Jhas8UE2HEEWPw==; bm_mi=89416686ABBF9FBE50D1CBA722EEE562~YAAQhGjcFyCuOp+RAQAAGJY+uRjnQUX6fsJR64fXS/QSqi+dZtrxd4/3q6UnEWEXshqXmgfnYRx+CNVlv8xigz2w6v/DcbV1sfctp3MjWhgDaydhygXrOwq4MNSNdiQ6TgJXEp/dYfwFuQOcujO/JDavp6Vt47tb4vCg6uOPlHA8V/1dDY+lBEpQZHpzjVM3wNfw6M4yKYKVj/4MasKwRaZ3VyggTu6/ixfzXpU7zuDHcSzxTmSoBFZ/RhBMau2qQEKavEnF+QUtTKGjCJnBGcX5CeghsQSzKTIB2Iw3K2jC2Hj9YkcEoN4Tzvfu9yS3sLfJjvqVZ7x3vHvmmQj72oBHy+SYCh5KhjQBFWzFQwAtdYQ7UCgqLZzRT5xblvzYkvTc4b11khXVGV8IOFLnDmX1NNvrfHUOwnorsZButcKNCcB4+7s=~1; bm_sv=1B73AE83C72F767D8F99A67B94CE5F33~YAAQhGjcFyG1Op+RAQAAmLk+uRjQhFsJyotIszMlK+v02CsE6JuvXIOdBJrIE7I2cfpiuwPkJvfRG/H8DaSgUsrIigKHR05G4xYhfj3e/oD/7ZKF9QwGRfXn2/ZBO4oCpyDZBratgq1hNqug1SVn/qNqBECfQ0+lCTs516QHTnPMQXSOnjssK/Qxfi/+8BF3eoOdhwluqIN/OFH/y2/NkbxWmbH7HC0UqTKkXPgJJkF4LoGMEwxnjJgPwisgdcCE~1; bm_sz=C1CD741B0BC5E7D7CCF6B4C1E7AA70D3~YAAQhGjcFwWtOp+RAQAAK5A+uRg6k9sUvbFN+06laGNbBX/W5ugSk8sna8F9oF6MudK/yd5jhg7gG6FZVs7EYPITkhaNlc17y0ULwacNTRC0uqAGYQdSbc32I4PyBK0MD8tPDv3bQ378T4TFMdfIYZc2V48vxVZDWtEnDmrdmuve1IkZVoxBNkvjqhFZWZ2986Fu1m8UooggEUO98lsFnl9WZC7t6J9i1lS75EBm+WAQZaj5nXXArwK6iYrte4lFsJnTXwp9LJ+cx1MQLd9p73E/HZuo+9WXiGpms/lBFDByOjPs18+GrPOFqnqFnTLOJJr8bOOYzwFfIYuzNcEv35QDMfPCVKUfESLC~3356726~3490369; dbidv2=807c6f51-8b65-4b68-8903-e8f654cc44f8; sbsd=saEIC1wKsU0rIVPOncpuutMsAnnVdtLu7xOE0hQWjFpsrVcYIYz9jMCo+Y0WdgWylTl+sCFX3ADMePoEsyBWH7ENQQGfhTmc7PRwq2ml29cQzwNrHwC+zrYq5/yyGrj4rHc/O0Llcjc2z73S63mrFl3CZjFqiuTcaisNYj3nkiDx85licbWLATIGDZ3RTgIZO; sbsd_ss=ab8e18ef4e; akaalb_prod_dual=1725476178~op=PROD_GCP_EAST_CTRL_DFLT:PROD_DEFAULT_EAST|~rv=72~m=PROD_DEFAULT_EAST:0|~os=352fb8a62db4e37e16b221fb4cefd635~id=88352ec4e575b5fc2562a604ce3ffbc3; akavpau_default=1725390078~id=8b7aec4092c6e5034bb10067fa26b972; al_sess=brukgPJGNBK59A5xZcXk0Zo8vhAnUY3ANxCJ73Mj/SpHGtgVS5ML35TWM+f28q8U; grs_search_token=HEAD:I3:1:NA:NA:a149b8167dfed803dae9916cb5c1b141; region=east; seo-partner=6QMPgDwfNilyECcyILvVuFJUkS00wvCy"
      };

        const url = 'https://www.lowes.com/search?searchTerm=999305';
    
       try {
        const response = await axios.get(url, { headers });
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        console.log('Data:', response.data);
        return response.data;
      } catch (error) {
        console.error('Error fetching data:',error);
        return null;
      }
      
}