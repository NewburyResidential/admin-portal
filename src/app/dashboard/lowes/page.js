import getAllChartOfAccounts from 'src/utils/services/utility/getAllChartOfAccounts';
import AllocationTable from './components/AllocationTable';
import GroupByInvoice from './components/GroupByInvoice';
import ItemCard from './components/ItemCard';

const items = [
  {
    id: 1,
    sku: '36943',
    price: '$7.98',
    category: 'Outdoors',
    subCategory: 'Outdoor Tools & Equipment',
    title: 'Project Source 0.396-Gallons Plastic Sprayer',
    imageUrl: 'https://mobileimages.lowes.com/productimages/20f38d16-d685-407e-989b-c73950f3a16e/01188991.jpg?size=pdhism',
  },
  {
    id: 2,
    sku: '12881',
    price: '$15.49',
    category: 'Lighting',
    subCategory: 'Bulbs & Lamps',
    title: 'EcoSmart 60-Watt Equivalent A19 Non-Dimmable LED Light Bulb Soft White (4-Pack)',
    imageUrl: 'https://mobileimages.lowes.com/productimages/66275b94-05f4-4c66-adfd-1cd9d75b106a/05466196.jpg?size=xl',
  },
  {
    id: 3,
    sku: '49216',
    price: '$24.99',
    category: 'Hardware',
    subCategory: 'Door Knobs & Handles',
    title: 'Kwikset Polo Satin Nickel Passage Door Knob',
    imageUrl: 'https://mobileimages.lowes.com/product/converted/014045/014045324779.jpg?size=xl',
  },
];

export default async function page() {
  const [chartOfAccounts] = await Promise.all([getAllChartOfAccounts()]);

  return (
    <div>
      <GroupByInvoice />
      <br></br>
      <br></br>
      <br></br>
      <AllocationTable uncatalogedItems={items} chartOfAccounts={chartOfAccounts} />
    </div>
  );
}
