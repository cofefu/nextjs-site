import { DetailedHTMLProps, HTMLAttributes, ReactElement } from "react";

export interface LayoutProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children: ReactElement;
}
