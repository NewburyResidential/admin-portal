import Table from "./components/Table";
import {fetchVendorLocations}  from "../../../utils/services/Entrata";

export default async function page () {

  const vendors = await fetchVendorLocations();
  //console.log(vendors)

  return (
    <div>
      <Table vendors={vendors}/>
    </div>
  )
}