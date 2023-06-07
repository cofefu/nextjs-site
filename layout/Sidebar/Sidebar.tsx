import {
  AimOutlined,
  ClockCircleOutlined,
  CoffeeOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  ReadOutlined
} from "@ant-design/icons";
import { Menu, MenuProps } from "antd";
import { ReactElement, useState } from "react";

import cn from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./Sidebar.module.css";
import { SidebarProps } from "./Sidebar.props";
import LogoIcon from "./logo.svg";

function getItem(label: ReactElement, key: string, icon: ReactElement) {
  return {
    key,
    icon,
    label,
  };
}

const items = [
  getItem(<Link href={"/map"}>Карта</Link>, "/map", <AimOutlined />),
  getItem(<Link href="/menu">Меню</Link>, "/menu", <CoffeeOutlined />),
  getItem(<Link href="/cart">Корзина</Link>, "/cart", <ShoppingCartOutlined />),
  getItem(<Link href="/order">Заказ</Link>, "/order", <ClockCircleOutlined />),
  getItem(<Link href="/profile">Профиль</Link>, "/profile", <UserOutlined />),
  getItem(<Link href="/news">Новости</Link>, "/news", <ReadOutlined />),
];

export const Sidebar = ({ className }: SidebarProps) => {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [current, setCurrent] = useState(router.asPath);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const onClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);
  };

  return (
    <div className={cn(className, styles.sidebar)}>
      <div className={styles.logoWrapper}>
        <LogoIcon className={styles.logo} />
      </div>
      <Menu
        onClick={onClick}
        selectedKeys={[current]}
        mode="inline"
        theme="dark"
        inlineCollapsed={collapsed}
        items={items}
        className={styles.menu}
      />
    </div>
  );
};
