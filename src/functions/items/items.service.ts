import axios from "axios";
import { author } from "./constants";

async function getProductDetail(id: string) {
  const [itemRes, descriptionRes] = await Promise.all([
    axios.get(`https://api.mercadolibre.com/items/${id}`),
    axios.get(`https://api.mercadolibre.com/items/${id}/description`),
  ]);

  const item = {
    id: itemRes.data.id,
    title: itemRes.data.title,
    price: {
      currency: itemRes.data.currency_id,
      amount: Math.floor(itemRes.data.price),
      decimals: itemRes.data.price - Math.floor(itemRes.data.price),
    },
    picture: itemRes.data.thumbnail,
    condition: itemRes.data.condition,
    free_shipping: itemRes.data.shipping.free_shipping,
    sold_quantity: itemRes.data.sold_quantity,
    description: descriptionRes.data.plain_text,
  };
  return { author, item };
}

async function searchProducts(query, offset: number, limit: number) {
  const searchRes = await axios.get(
    `https://api.mercadolibre.com/sites/MLA/search?q=${query}&offset=${offset}&limit=${limit}`
  );

  const categories = searchRes.data.filters
    ? searchRes.data.filters
        .find((filter: any) => filter.id === "category")
        ?.values.map((value: any) => value.path_from_root)
        .flat(2)
    : [];

  const items = searchRes.data.results.map((result: any) => ({
    id: result.id,
    title: result.title,
    price: {
      currency: result.currency_id,
      amount: Math.floor(result.price),
      decimals: result.price - Math.floor(result.price),
    },
    picture: result.thumbnail,
    condition: result.condition,
    free_shipping: result.shipping.free_shipping,
  }));
  return { author, categories, items };
}

export { getProductDetail, searchProducts };
