import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { AWS_CONFIG } from 'src/config-global';

const dynamoClient = new DynamoDBClient(AWS_CONFIG);
export const dynamoDocumentClient = DynamoDBDocumentClient.from(dynamoClient);

// GET ITEM FORM DYNAMODB

// tableName: table name
// pk: partition key
// sk: sort key (optional)

export async function dynamoQuery({ tableName, pk, sk = null }) {
  try {
    const params = {
      TableName: tableName,
      KeyConditionExpression: sk ? 'pk = :pk AND sk = :sk' : 'pk = :pk',
      ExpressionAttributeValues: sk
        ? {
            ':pk': pk,
            ':sk': sk,
          }
        : { ':pk': pk },
    };

    const data = await dynamoDocumentClient.send(new QueryCommand(params));
    console.log(data.Items);
    return data.Items;
  } catch (error) {
    console.error('Error getting item from DynamoDB', error);
  }
}

export async function dynamoQueryWithIndex({ tableName, index, pkName, pkValue, skName = null, skValue = null }) {
  try {
    const expressionAttributeNames = {
      '#pk': pkName,
    };
    const expressionAttributeValues = {
      ':pk': pkValue,
    };
    let keyConditionExpression = '#pk = :pk';

    if (skName && skValue !== null) {
      expressionAttributeNames['#sk'] = skName;
      expressionAttributeValues[':sk'] = skValue;
      keyConditionExpression += ' AND #sk = :sk';
    }

    const params = {
      TableName: tableName,
      IndexName: index,
      KeyConditionExpression: keyConditionExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
    };

    const data = await dynamoDocumentClient.send(new QueryCommand(params));
    console.log(data.Items);
    return data.Items;
  } catch (error) {
    console.error('Error getting item from DynamoDB', error);
  }
}

// UPDATE OR ADD ITEM TO DYNAMODB

// tableName: table name
// pk: partition key
// sk: sort key (optional)
// attributes: object with data to update or add

//TO DO handle undefined values

export async function dynamoUpdateItemAttributes({ tableName, pk, sk, attributes }) {
  let updateExpression = 'SET';
  const expressionAttributeNames = {};
  const expressionAttributeValues = {};
  let firstItem = true;

  for (const [attributeName, attributeValue] of Object.entries(attributes)) {
    if (!firstItem) {
      updateExpression += ',';
    }
    const attributePlaceholder = `#${attributeName}`;
    const valuePlaceholder = `:${attributeName}`;
    updateExpression += ` ${attributePlaceholder} = ${valuePlaceholder}`;
    expressionAttributeNames[attributePlaceholder] = attributeName;
    expressionAttributeValues[valuePlaceholder] = attributeValue;
    firstItem = false;
  }

  const params = {
    TableName: tableName,
    Key: { pk: pk, sk: sk },
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: 'UPDATED_NEW',
  };

  try {
    const response = await dynamoDocumentClient.send(new UpdateCommand(params));
    console.log('Update operation successful:', response);
    return response;
  } catch (error) {
    console.error('Error updating item in DynamoDB:', error);
    throw error; // Propagate errors for proper handling.
  }
}
