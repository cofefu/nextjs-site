import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface AlertingServiceProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  horizontal: string;
  vertical: string;
}
