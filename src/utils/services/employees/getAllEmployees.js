import { departments } from 'src/assets/data/departments';
import { dynamoQueryWithIndex, dynamoScan } from '../sdk-config/aws/dynamo-db';

export async function getAllEmployees() {
  try {
    // Fetch employee data
    const employeeData = await dynamoQueryWithIndex({
      pkValue: '#EMPLOYEE',
      pkName: 'sk',
      tableName: 'newbury_employees',
      index: 'sk-status-index',
    });

    // Fetch property data
    const rawPropertyData = await dynamoScan({ tableName: 'newbury_assets' });
    const propertyData = rawPropertyData.Items;

    // Map property data by pk for quick lookup
    const propertyMap = propertyData.reduce((acc, property) => {
      acc[property.pk] = property.label;
      return acc;
    }, {});

    // Process employee data
    const processedEmployees = employeeData.map((employee) => {
      const { costCenter1, costCenter2 } = employee;

      return {
        ...employee,
        costCenter1Label: costCenter1 === '1' ? 'Home Office' : propertyMap[costCenter1] || '',
        costCenter2Label: departments[costCenter2] || '',
        jobTitle: employee.jobTitle || 'N/A',
      };
    });

    return processedEmployees;
  } catch (error) {
    console.error('Error processing employees and properties:', error);
    throw new Error('Failed to process employee and property data.');
  }
}
