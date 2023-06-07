import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface LoginProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  setActiveType: (type: string) => void;
}
