export const adjustData = (data) => {

const gasExists = Boolean(transformed.gasMeterNumber.value);
const electricExists = Boolean(transformed.electricMeterNumber.value);

  const calculateSalesTax = () => {
 
    let gasBeforeTax = transformed.totalNaturalGas.value;
    let electricBeforeTax = transformed.totalElectric.value;
    let totalAfterTax = transformed.totalAmount.value;

    const setTaxValues = (type, taxAmount) => {
      transformed[type].value = fTwoDecimals(taxAmount + (type === 'totalNaturalGas' ? gasBeforeTax : electricBeforeTax));
      transformed[type + 'Tax'] = {
        value: fTwoDecimals(taxAmount),
        confidence: Math.min(transformed.totalAmount.confidence, transformed[type].confidence),
      };
    };
  
    if (gasExists && electricExists) {
      const totalBeforeTax = gasBeforeTax + electricBeforeTax;
      const totalSalesTax = totalAfterTax - totalBeforeTax;
      const gasTax = (gasBeforeTax / totalBeforeTax) * totalSalesTax;
      const electricTax = (electricBeforeTax / totalBeforeTax) * totalSalesTax;
  
      setTaxValues('totalNaturalGas', gasTax);
      setTaxValues('totalElectric', electricTax);
    } else if (gasExists) {
      const gasTax = totalAfterTax - gasBeforeTax;
      setTaxValues('totalNaturalGas', gasTax);
    } else if (electricExists) {
      const electricTax = totalAfterTax - electricBeforeTax;
      setTaxValues('totalElectric', electricTax);
    }
  };



  calculateSalesTax();
}