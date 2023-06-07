import { IProduct, ITopping } from "./../../interfaces/product.interface";
import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface ICartProduct extends IProduct {
  price: number,
  topping: ITopping[]
}

export interface CartCardProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  product: ICartProduct;
  toppings: ITopping[];
  deleteItem: (item: ICartProduct) => void;
}
