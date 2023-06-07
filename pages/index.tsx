import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Login from "../components/Login/Login";
import { Registration } from "../components/Registration/Registration";
import { useCookies } from "react-cookie";
import callApi from "../common/callApi";
import { add } from "date-fns";
import { useRouter } from "next/router";
import Link from "next/link";

const Home: NextPage = () => {
  const [activeType, setActiveType] = useState("login");
  const [cookies, setCookie] = useCookies(["jwt"]);
  const router = useRouter();

  useEffect(() => {
    const updateToken = async () => {
      const response = await callApi(
        `/update_token`,
        "POST",
        {},
        {},
        cookies.jwt
      );
      if (response.detail !== "Не удалось проверить учетные данные.") {
        setCookie("jwt", response, {
          path: "/",
          expires: new Date(add(new Date(), { days: 15 })),
        });
        router.push("/menu");
      }
    };

    if (cookies.jwt) {
      updateToken();
    }
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Cofefu - сервис заказа кофе</title>
        <meta
          name="description"
          content="Новый удобный сервис для студентов. Закажи кофе на паре и не стой в очереди!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.bgWrap}>
        <Image
          alt="Order coffee"
          src="/main-bg.jpg"
          layout="fill"
          objectFit="cover"
          quality={100}
          priority
        />
      </div>

      <header className={styles.header}>
        <Link href={'/products'}>
          Меню
        </Link>
        <Link href={'/map'}>
          Карта
        </Link>
      </header>


      <main className={styles.main}>
        <div className={styles.description}>
          <h1 className={styles.h1}>
            Кофе теперь
            <br /> легко взять с<br /> собой
          </h1>
          <p className={styles.p}>
            Зарегистрируйся на сайте
            <br />
            Выбери любимое кофе
            <br />
            Оформи заказ на удобное тебе время
            <br />
            Приди в кофейню и оплати свой заказ
            <br />
          </p>
        </div>
        <div className={styles.authFormWrapper}>
          {activeType === "login" ? (
            <Login setActiveType={setActiveType} />
          ) : (
            <Registration setActiveType={setActiveType} />
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
