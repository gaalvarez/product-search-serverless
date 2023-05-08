import express, { Request, Response } from "express";
import { getProductDetail, searchProducts } from "./items.service";

const app = express();

const errorHandler = (
  res: express.Response<any, Record<string, any>>,
  error: any
) => {
  res
    .status(error.response?.status || 500)
    .json(error.response?.data || error.message);
};

app.get("/items/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { author, item } = await getProductDetail(id);

    res.json({
      author,
      item,
    });
  } catch (error) {
    errorHandler(res, error);
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
    errorHandler(res, error);
  }
});

app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

export { app };
