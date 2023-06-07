import {
  ClockCircleOutlined,
  CoffeeOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import cn from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactElement, useState } from "react";

import styles from "./Bottombar.module.css";
import { BottombarProps } from "./Bottombar.props";

function getItem(label: string, key: string, icon: ReactElement) {
  return {
    key,
    icon,
    label,
  };
}

const items = [
  getItem("Меню", "/menu", <CoffeeOutlined />),
  getItem("Корзина", "/cart", <ShoppingCartOutlined />),
  getItem("Заказ", "/order", <ClockCircleOutlined />),
  getItem("Профиль", "/profile", <UserOutlined />),
];

export const Bottombar = ({ className }: BottombarProps) => {
  const router = useRouter();
  const [current, setCurrent] = useState(router.asPath);

  return (
    <div className={cn(styles.bottombar, className)}>
      <div className={styles.border}>
        {items &&
          items.map((item) => (
            <Link
              key={item.key}
              href={item.key}
            >
              <div className={cn(styles.link, {
                [styles.active]: item.key === current,
              })}>
                <span className={styles.icon}>
                  {item.icon}
                  </span>
                  {item.label}
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};
