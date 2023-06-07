import React, { FunctionComponent, useEffect } from "react";
import { Bottombar } from "./Bottombar/Bottombar";
import styles from "./Layout.module.css";
import { LayoutProps } from "./Layout.props";
import { Sidebar } from "./Sidebar/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { setCancelTime } from "../store/features/orderSlice";
import { log } from "console";

const Layout = ({ children }: LayoutProps) => {

  const cancelTime = useSelector((state: RootState) => state.order.cancelTime);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (cancelTime !== 0) {
      const timer = setInterval(() => {
        dispatch(setCancelTime(cancelTime - 1000));
      }, 1000);
      return () => clearInterval(timer)
    }
  }, [cancelTime]);

  return (
    <div className={styles.wrapper}>
      <Sidebar className={styles.sidebar} />
      <div className={styles.body}>{children}</div>
      <Bottombar className={styles.bottombar} />
    </div>
  );
};

export const withLayout = <T extends Record<string, unknown>>(
  Component: FunctionComponent<T>
) => {
  return function withLayoutComponent(props: T): JSX.Element {
    return (
      <Layout>
        <Component {...props} />
      </Layout>
    );
  };
};
