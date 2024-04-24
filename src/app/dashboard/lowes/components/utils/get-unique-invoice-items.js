export default function getUniqueInvoiceItems(groupedInvoices) {
  const items = Object.values(groupedInvoices).reduce((result, entry) => {
    entry.lineItems.forEach((item) => {
      result[item.sku] = item;
    });
    return result;
  }, {});

  const allUniqueItems = Object.values(items);
  return allUniqueItems;
}
