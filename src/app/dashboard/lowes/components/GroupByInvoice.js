'use client';
import React, { useState } from 'react';
import Papa from 'papaparse';
import getUncatalogedItems from 'src/utils/services/supply-stores/getUncatalogedItems';
import lowesItemScraper from './utils/lowes-item-scraper';

const GroupByInvoice = () => {
  const [groupedInvoices, setGroupedInvoices] = useState({});
  const [uncatalogedItems, setUncatalogedItems] = useState([{}]);
  const [catalogItems, setCatalogItems] = useState({});

  const fetchUncatalogedItems = async (items) => {
    let data = await getUncatalogedItems(items);
    let missingLowesDataArray = data?.missingLowesDataArray || null;
    let missingGlDataArray = data?.missingGlDataArray || null;
    let catalogItems = data?.completeCatalogItems || null;

    while (missingLowesDataArray.length > 0 && missingLowesDataArray !== null) {
      await lowesItemScraper(missingLowesDataArray);
      data = await getUncatalogedItems(items);
      missingLowesDataArray = data.missingCatalogArray;
    }
    console.log(data);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      header: true,
      transform: (value, column) => {
        if (column === 'SKU') {
          return value.replace(/^0+/, '');
        }
        return value;
      },
      complete: (results) => {
        const grouped = results.data.reduce((acc, curr) => {
          const invoiceNum = curr['Invoice#'];
          if (!acc[invoiceNum]) {
            if (invoiceNum === '' || invoiceNum === null || invoiceNum === undefined) return acc;
            acc[invoiceNum] = {
              lineItems: [],
              totalInvoice: curr['Total Invoice'],
              jobName: curr['PO#'],
              buyerName: curr['Buyer Name'],
              store: curr['Store'],
            };
          }

          //add ignore promotional

          if (curr['Total Invoice'] !== '' && curr['Total Invoice'] !== null && curr['Total Invoice'] !== ' ') {
            acc[invoiceNum].totalInvoice = curr['Total Invoice'];
          }
          if (curr['Tax'] !== '' && curr['Total Invoice'] !== null && curr['Total Invoice'] !== ' ') {
            acc[invoiceNum].tax = curr['Tax'];
            return acc;
          } else if (curr['SkuDesc'] === 'DELIVERY') {
            acc[invoiceNum].tax = curr['Ex Price'];
            return acc;
          } else if (curr['SKU'] === null || curr['SKU'] === '' || curr['SKU'] === ' ' || curr['SkuDesc'] === 'PROMOTIONAL DISCOUNT APPL') {
            return acc;
          } else {
            acc[invoiceNum].lineItems.push({
              sku: curr['SKU'],
              skuDescription: curr['SkuDesc'],
              cost: curr['Price'],
              totalCost: curr['Ex Price'],
              qty: curr['Quantity'],
            });
          }
          return acc;
        }, {});
        setGroupedInvoices(grouped);
        const items = Object.values(grouped).reduce((result, entry) => {
          entry.lineItems.forEach((item) => {
            result[item.sku] = item;
          });
          return result;
        }, {});

        const allUniqueItems = Object.values(items);
        fetchUncatalogedItems(allUniqueItems);
      },
    });
  };

  console.log(groupedInvoices);

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
    </div>
  );
};

export default GroupByInvoice;
