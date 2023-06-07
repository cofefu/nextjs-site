import { IOrder } from "../pages/cart";
import getConfig from "next/config";

export default async function callApi(
  endpoint: string,
  method?: string,
  payload?: { [key: string]: string } | IOrder | string,
  options?: { [key: string]: string },
  jwt: string = ""
) {
  const { publicRuntimeConfig } = getConfig();
  const config: RequestInit = {
    method: method || "get",
    headers: {
      "Content-Type": "application/json",
    },
    body: payload && JSON.stringify(payload),
    ...options,
  };

  if (jwt) {
    config.headers = {
      "Content-Type": "application/json",
      "jwt-token": jwt,
    };
  }

  const res = await fetch(
    `${publicRuntimeConfig.NEXT_PUBLIC_DOMAIN}` + endpoint,
    config
  )
    .then((response) => {
      if (!response.ok) {
        throw response.json();
      }
      return response.json();
    })
    .then((json) => {
      return json;
    })
    .catch((json) => {
      return json;
    });

  return await res;
}
