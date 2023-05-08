import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import serverless from "serverless-http";
import express, { Request, Response } from "express";
import { middyfy } from "@libs/lambda";
import { getProductDetail, searchProducts } from "./items.service";

const app = express();

app.get("/items/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { author, item } = await getProductDetail(id);

    res.json({
      author,
      item,
    });
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || error.message);
  }
});

app.get("/items", async (req: Request, res: Response) => {
  try {
    const query = req.query.q;
    if (!query) {
      res.status(400).json({ message: "Query parameter missing" });
      return;
    }
    const offset = Number(req.query.offset) || 0;
    const limit = Number(req.query.limit) || 4;

    const { author, categories, items } = await searchProducts(
      query,
      offset,
      limit
    );

    res.json({
      author,
      categories,
      items,
    });
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || error.message);
  }
});

app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

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
