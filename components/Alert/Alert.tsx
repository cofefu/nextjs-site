import { useEffect } from "react";
import { close } from "../../services/AlertingService/AlertingFunctions";

import cn from "classnames";
import styles from "./Alert.module.css";
import { AlertProps } from "./Alert.props";

export const Alert = ({ timeout, id, message, status }: AlertProps) => {
  useEffect(() => {
    if (timeout > 0) {
      const timer = setTimeout(() => {
        close(id);
      }, timeout * 1_000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [id, timeout]);

  return (
    <div className={cn(styles.default, styles[status])}>
      {message}
      <button onClick={() => close(id)}>X</button>
    </div>
  );
};
