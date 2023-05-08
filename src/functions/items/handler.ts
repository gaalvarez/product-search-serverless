import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import serverless from "serverless-http";
import { middyfy } from "@libs/lambda";
import { app } from "./items.controller";

const productSearch: APIGatewayProxyHandler = async (
  event,
  context
): Promise<APIGatewayProxyResult> => {
  try {
    const result = await serverless(app)(event, context);
    return {
      statusCode: 200,
      body: JSON.stringify(result),
      ...result,
    };
  } catch (error) {
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify(error),
    };
  }
};

export const main = middyfy(productSearch);
