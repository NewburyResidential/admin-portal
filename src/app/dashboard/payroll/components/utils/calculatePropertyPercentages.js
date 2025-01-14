import Big from 'big.js';

export const calculatePropertyPercentages = (propertiesByEmployee) => {
  const propertiesByPercent = {};
  const totalEmployees = Object.keys(propertiesByEmployee).length;

  // Initialize property totals
  Object.values(propertiesByEmployee).forEach(({ properties }) => {
    Object.keys(properties).forEach(propertyId => {
      if (!propertiesByPercent[propertyId]) {
        propertiesByPercent[propertyId] = {
          breakout: {},
          totalPercent: 0
        };
      }
    });
  });

  // Calculate percentages for each employee
  Object.values(propertiesByEmployee).forEach(({ properties, account }) => {
    const employeePropertyIds = Object.keys(properties);

    if (employeePropertyIds.length === 1) {
      // If employee only has one property, give it full weight
      const propertyId = employeePropertyIds[0];
      const percentage = (1 / totalEmployees) * 100;
      
      propertiesByPercent[propertyId].breakout[account] = 
        (propertiesByPercent[propertyId].breakout[account] || 0) + percentage;
      propertiesByPercent[propertyId].totalPercent += percentage;
    } else {
      // If employee has multiple properties, split based on amounts
      const totalAmount = Object.values(properties)
        .reduce((sum, amount) => sum.plus(amount), new Big(0));

      employeePropertyIds.forEach(propertyId => {
        const propertyAmount = properties[propertyId];
        const percentage = (propertyAmount.div(totalAmount).times(1 / totalEmployees) * 100);
        
        propertiesByPercent[propertyId].breakout[account] = 
          (propertiesByPercent[propertyId].breakout[account] || 0) + percentage;
        propertiesByPercent[propertyId].totalPercent += percentage;
      });
    }
  });

  // Round all numbers to 2 decimal places
  Object.keys(propertiesByPercent).forEach(propertyId => {
    Object.keys(propertiesByPercent[propertyId].breakout).forEach(account => {
      propertiesByPercent[propertyId].breakout[account] = 
        Math.round(propertiesByPercent[propertyId].breakout[account] * 100) / 100;
    });
    propertiesByPercent[propertyId].totalPercent = 
      Math.round(propertiesByPercent[propertyId].totalPercent * 100) / 100;
  });

  return propertiesByPercent;
}; 