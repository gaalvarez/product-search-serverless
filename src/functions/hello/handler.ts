import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import serverless from "serverless-http";
import express, { Request, Response } from "express";
import { middyfy } from "@libs/lambda";

const app = express();

app.use((req: Request, res: Response) => {
  res.send({ message: "Server is running" });
});

const hello: APIGatewayProxyHandler = async (
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

export const main = middyfy(hello);
