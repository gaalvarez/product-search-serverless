import axios from "axios";
import { author, meliAPIURL } from "./constants";

async function getProductDetail(id: string) {
  const [itemRes, descriptionRes] = await Promise.all([
    axios.get(`${meliAPIURL}/items/${id}`),
    axios.get(`${meliAPIURL}/items/${id}/description`),
  ]);

  const picture =
    itemRes.data.pictures && itemRes.data.pictures.length > 0
      ? itemRes.data.pictures[0].url
      : itemRes.data.thumbnail;

  const priceParts = itemRes.data.price.toString().split(".");
  const amount = Number(priceParts[0]);
  const decimals = priceParts.length > 1 ? Number(priceParts[1]) : 0;

  const item = {
    id: itemRes.data.id,
    title: itemRes.data.title,
    price: {
      currency: itemRes.data.currency_id,
      amount,
      decimals,
    },
    picture,
    condition: itemRes.data.condition,
    free_shipping: itemRes.data.shipping.free_shipping,
    sold_quantity: itemRes.data.sold_quantity,
    description: descriptionRes.data.plain_text,
  };
  return { author, item };
}

async function searchProducts(query, offset: number, limit: number) {
  const searchRes = await axios.get(
    `${meliAPIURL}/sites/MLA/search?q=${query}&offset=${offset}&limit=${limit}`
  );

  const categories =
    searchRes.data.filters && searchRes.data.filters.length > 0
      ? searchRes.data.filters
          .find((filter: any) => filter.id === "category")
          ?.values.map((value: any) => value.path_from_root)
          .flat(2)
      : [];
  console.log("si ingresa");

  const items = searchRes.data.results.map((result: any) => {
    const priceParts = result.price.toString().split(".");
    const amount = Number(priceParts[0]);
    const decimals = priceParts.length > 1 ? Number(priceParts[1]) : 0;

    return {
      id: result.id,
      title: result.title,
      price: {
        currency: result.currency_id,
        amount,
        decimals,
      },
      picture: result.thumbnail,
      condition: result.condition,
      free_shipping: result.shipping.free_shipping,
    };
  });
  return { author, categories, items };
}

export { getProductDetail, searchProducts };
