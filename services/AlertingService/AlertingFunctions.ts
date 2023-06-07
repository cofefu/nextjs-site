import { Subject } from "rxjs";

const alertsSubject = new Subject();

const alert = (status: string, message: string, timeout: number) => {
  alertsSubject.next({
    id: Math.round(window.performance.now() * 10),
    status,
    message,
    timeout,
  });
};

const success = (message: string, timeout = 0) => {
  alert("success", message, timeout);
};

const error = (message: string, timeout = 0) => {
  alert("error", message, timeout);
};

const warning = (message: string, timeout = 0) => {
  alert("warning", message, timeout);
};

const info = (message: string, timeout = 0) => {
  alert("info", message, timeout);
};

const onAlert = () => {
  return alertsSubject.asObservable();
};

const closedAlertsSubject = new Subject();

const close = (id: number) => {
  closedAlertsSubject.next(id);
};

const onClosed = () => {
  return closedAlertsSubject.asObservable();
};

export { success, warning, error, info, onAlert, close, onClosed };
