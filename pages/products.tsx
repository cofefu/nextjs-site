import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import styles from "../styles/Menu.module.css";

import { ProductCard } from "../components/ProductCard/ProductCard";
import { Tabs } from "antd";
import { UpOutlined } from "@ant-design/icons";
import { useAnimation, motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { fetchMenu } from "../store/features/menuSlice";
import { useRouter } from "next/router";

const  Products = () => {
  const { TabPane } = Tabs;

  const router = useRouter();
  const menu = useSelector((state: RootState) => state.menu.products);
  const dispatch = useDispatch<AppDispatch>();
  
  useEffect(() => {
    if (menu.length === 0) {
      dispatch(fetchMenu());
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
        <title> Cofefu - Меню </title>
        <meta
          name="description"
          content="Закажи кофе удаленно и забери в удобное время"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div onClick={() => router.back()} className={styles.back}>
          На главную
        </div>
        <div
          className={styles.preview}
          ref={contentRef}
          onScroll={handleScroll}
        >
          <Tabs
            onChange={onChange}
            activeKey={activeTab}
          >
            <TabPane tab="КОФЕ" key="Кофе">
              {menu.length > 0 &&
                menu
                  .filter((product) => product.type === "Кофе")
                  .map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                    />
                  ))}
            </TabPane>
            <TabPane tab="НЕКОФЕ" key="Не кофе">
              {menu.length > 0 &&
                menu
                  .filter((product) => product.type === "Не кофе")
                  .map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
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

export default Products;
