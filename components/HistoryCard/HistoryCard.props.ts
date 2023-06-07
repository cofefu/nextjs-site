import { IProduct, ITopping } from "./../../interfaces/product.interface";
import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface HistoryCardProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  item: any;
}
