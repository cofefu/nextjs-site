import React from "react";

import cn from "classnames";

import { Alert } from "../../components/Alert/Alert";

import { AlertingServiceProps } from "./AlertingService.props";
import styles from "./AlertingService.module.css";

import { onAlert, onClosed } from "./AlertingFunctions";
import { useEffect, useState } from "react";

interface IAlert {
  timeout: number;
  id: any;
  status: any;
  message: any;
}

const AlertingService = ({ horizontal, vertical }: AlertingServiceProps) => {
  const [alerts, setAlerts] = useState<IAlert[]>([]);

  useEffect(() => {
    const onAlertSubscription$ = onAlert().subscribe((v: any) => {
      setAlerts([...alerts, v]);
    });
    const onClosedSubscription$ = onClosed().subscribe((id) => {
      setAlerts(alerts.filter((alert) => alert.id !== id));
    });

    return () => {
      onAlertSubscription$.unsubscribe();
      onClosedSubscription$.unsubscribe();
    };
  }, [alerts]);

  const alertsContent = alerts.map((alert: IAlert) => {
    return <Alert key={alert.id} {...alert} />;
  });

  return (
    <div className={cn(styles.default, styles[horizontal], styles[vertical])}>
      {alertsContent}
    </div>
  );
};

export default AlertingService;
