import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface AlertProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  timeout: number;
  id: any;
  status: any;
  message: any;
}
