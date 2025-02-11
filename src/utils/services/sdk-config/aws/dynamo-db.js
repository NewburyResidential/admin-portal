import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand, UpdateCommand, DeleteCommand, ScanCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { AWS_CONFIG } from 'src/config-global';
import * as Sentry from '@sentry/nextjs';

const dynamoClient = new DynamoDBClient(AWS_CONFIG);
export const dynamoDocumentClient = DynamoDBDocumentClient.from(dynamoClient);

export async function dynamoScan({ tableName }) {
  try {
    const params = {
      TableName: tableName,
    };

    const response = await dynamoDocumentClient.send(new ScanCommand(params));
    Sentry.addBreadcrumb({
      category: 'response',
      message: 'Dynamo scan operation successful:',
      level: 'info',
      data: response,
    });
    return response;
  } catch (error) {
    error.message = `(Error scanning items from DynamoDB) ${error.message}`;
    Sentry.captureException(error);
    throw error;
  }
}

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

    const response = await dynamoDocumentClient.send(new QueryCommand(params));
    Sentry.addBreadcrumb({
      category: 'response',
      message: 'Dynamo query operation successful:',
      level: 'info',
      data: response,
    });
    return response.Items;
  } catch (error) {
    error.message = `(Error querying item from DynamoDB) ${error.message}`;
    throw error;
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

    const response = await dynamoDocumentClient.send(new QueryCommand(params));
    Sentry.addBreadcrumb({
      category: 'response',
      message: 'Dynamo query index operation successful:',
      level: 'info',
      data: response,
    });

    return response.Items;
  } catch (error) {
    error.message = `(Error querying item with index from DynamoDB) ${error.message}`;
    throw error;
  }
}

// UPDATE OR ADD ITEM TO DYNAMODB

// tableName: table name
// pk: partition key
// sk: sort key (optional)
// attributes: object with response to update or add

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
    Key: { pk, sk },
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: 'UPDATED_NEW',
  };

  try {
    const response = await dynamoDocumentClient.send(new UpdateCommand(params));
    Sentry.addBreadcrumb({
      category: 'response',
      message: 'Dynamo update operation successful:',
      level: 'info',
      data: response,
    });
    return response;
  } catch (error) {
    error.message = `(Error updating item in DynamoDB) ${error.message}`;
    throw error;
  }
}

export async function dynamoDeleteItem({ tableName, pk, sk }) {
  const params = {
    TableName: tableName,
    Key: { pk, sk },
  };

  try {
    const response = await dynamoDocumentClient.send(new DeleteCommand(params));
    Sentry.addBreadcrumb({
      category: 'response',
      message: 'Dynamo delete operation successful:',
      level: 'info',
      data: response,
    });
    return response;
  } catch (error) {
    error.message = `(Error deleting item from DynamoDB) ${error.message}`;
    throw error;
  }
}

export async function dynamoAdd({ tableName, item }) {
  try {
    const params = {
      TableName: tableName,
      Item: item,
    };

    const response = await dynamoDocumentClient.send(new PutCommand(params));
    Sentry.addBreadcrumb({
      category: 'response',
      message: 'Dynamo add operation successful:',
      level: 'info',
      data: response,
    });
    return response;
  } catch (error) {
    error.message = `(Error adding item to DynamoDB) ${error.message}`;
    Sentry.captureException(error);
    throw error;
  }
}

export async function dynamoIncrementAttribute({ tableName, pk, sk = null, attributeName, incrementBy = 1 }) {
  const params = {
    TableName: tableName,
    Key: sk ? { pk, sk } : { pk },
    UpdateExpression: 'ADD #attr :increment',
    ExpressionAttributeNames: {
      '#attr': attributeName,
    },
    ExpressionAttributeValues: {
      ':increment': incrementBy,
    },
    ReturnValues: 'UPDATED_NEW',
  };

  try {
    const response = await dynamoDocumentClient.send(new UpdateCommand(params));
    Sentry.addBreadcrumb({
      category: 'response',
      message: 'Dynamo increment operation successful:',
      level: 'info',
      data: response,
    });
    return response;
  } catch (error) {
    error.message = `(Error incrementing attribute in DynamoDB) ${error.message}`;
    Sentry.captureException(error);
    throw error;
  }
}
