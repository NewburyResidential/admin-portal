import AllocationTable from './components/AllocationTable';
import GroupByInvoice from './components/GroupByInvoice';
import ItemCard from './components/ItemCard';

export default function page() {
  return (
    <div>
      <GroupByInvoice />
      <br></br>
      <br></br>
      <br></br>
      <ItemCard />
      <AllocationTable uncatalogedItems={[{ checked: false, id: '2' }]} />
    </div>
  );
}
