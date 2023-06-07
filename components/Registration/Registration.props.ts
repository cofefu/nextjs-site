import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface RegistrationProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  setActiveType: (type: string) => void;
}
