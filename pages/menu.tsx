import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import styles from "../styles/Menu.module.css";

import { UpOutlined } from "@ant-design/icons";
import { Tabs } from "antd";
import { motion, useAnimation } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { ProductCard } from "../components/ProductCard/ProductCard";
import { withLayout } from "../layout/Layout";
import { AppDispatch, RootState } from "../store";
import { fetchMenu, fetchToppings } from "../store/features/menuSlice";

function Menu() {
  const { TabPane } = Tabs;

  const menu = useSelector((state: RootState) => state.menu.products).slice().sort((a: any,b: any) => a.name.localeCompare(b.name));
  const toppings = useSelector((state: RootState) => state.menu.toppings);
  const dispatch = useDispatch<AppDispatch>();
  const [favorites, setFavorites] = useState<any>([]);

  useEffect(() => {
    if (menu.length === 0) {
      dispatch(fetchMenu());
    }
    if (toppings.length === 0) {
      dispatch(fetchToppings());
    }
    if (isBrowser) {
      const json = localStorage.getItem('favorites');
      if (json) {
        setFavorites(JSON.parse(json))
      }
    }
  }, []);

  const contentRef = useRef<HTMLDivElement>(null);

  const controls = useAnimation();
  const [scrollY, setScrollY] = useState<number>(0);
  const isBrowser = typeof window !== undefined;

  const handleScroll = () => {
    if (contentRef.current) {
      const currentScrollY = isBrowser ? contentRef.current.scrollTop : 0;
      setScrollY(currentScrollY);
    }
  };

  useEffect(() => {
    if (contentRef.current) {
      controls.start({ opacity: scrollY / contentRef.current.scrollHeight });
    }
  }, [scrollY, controls]);

  const scrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const [activeTab, setActiveTab] = useState("Кофе");
  const onChange = (key: string) => {
    setActiveTab(key);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title> Cofefu - Заказ </title>
        <meta
          name="description"
          content="Закажи кофе удаленно и забери в удобное время"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.filters}>
          <div >

          </div>
        </div>
        <div
          className={styles.content}
          ref={contentRef}
          onScroll={handleScroll}
        >
          <Tabs
            onChange={onChange}
            activeKey={activeTab}
            className={styles.tabs}
          >
            <TabPane tab="КОФЕ" key="Кофе">
              {menu &&
                menu
                  .sort((a: any, b: any) => {
                    if (favorites.includes(a.id)) {
                      return -1;
                    }

                    return a.name.localeCompare(b.name)
                  })
                  .filter((product: any) => product.type === "Кофе")
                  .map((product: any) => (
                    <ProductCard
                      key={product.id}
                      product={{
                        ...product,
                        variations: product.variations
                          .slice()
                          .sort((a: any, b: any) => a.price - b.price),
                      }}
                      toppings={toppings}
                      setFavorites={setFavorites}
                    />
                  ))}
            </TabPane>
            <TabPane tab="НЕКОФЕ" key="Не кофе">
              {menu &&
                menu
                  .sort((a: any, b: any) => {
                    if (favorites.includes(a.id)) {
                      return 1;
                    }

                    return a.name.localeCompare(b.name)
                  })
                  .filter((product: any) => product.type === "Не кофе")
                  .map((product: any) => (
                    <ProductCard
                      key={product.id}
                      product={{
                        ...product,
                        variations: product.variations
                          .slice()
                          .sort((a: any, b: any) => a.price - b.price),
                      }}
                      toppings={toppings}
                      setFavorites={setFavorites}
                    />
                  ))}
            </TabPane>
          </Tabs>
        </div>

        <motion.div animate={controls} initial={{ opacity: 0 }}>
          <button className={styles.upButton} onClick={scrollToTop}>
            <UpOutlined />
          </button>
        </motion.div>
      </main>
    </div>
  );
}

export default withLayout(Menu);
