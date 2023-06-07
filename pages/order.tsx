import { useEffect, useState } from "react";
import Head from "next/head";
import styles from "../styles/Order.module.css";
import callApi from "../common/callApi";

import AlertingService from "../services/AlertingService/AlertingService";
import { withLayout } from "../layout/Layout";
import { Input, Tag } from "antd";
import { ICoffeehouse, ITopping } from "../interfaces/product.interface";
import Link from "next/link";
import { error, success } from "../services/AlertingService/AlertingFunctions";
import format from "dayjs";
import dayjs from "dayjs";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { setCancelTime } from "../store/features/orderSlice";

interface IOrderProduct {
  id: number;
  toppings: number[];
}

interface IOrder {
  status: string;
  order_number: number;
  time: string;
  coffee_house: number;
  products: IOrderProduct[];
  comment: string;
}

function formatSecondsToTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const minutesString = String(minutes).padStart(2, "0");
  const secondsString = String(remainingSeconds).padStart(2, "0");
  return `${minutesString}:${secondsString}`;
}

const { TextArea } = Input;

function Order() {
  const [order, setOrder] = useState<IOrder | null>(null);
  const [coffeeHouse, setCoffeeHouse] = useState<ICoffeehouse | null>(null);
  const [cookies, setCookie] = useCookies(["jwt"]);
  const router = useRouter();

  const [toppings, setToppings] = useState<ITopping[]>([]);
  const [coffeeHouses, setCoffeeHouses] = useState<ICoffeehouse[]>([]);

  const cancelTime = useSelector((state: RootState) => state.order.cancelTime);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const getData = async () => {
      const responseToppings = await callApi("/toppings", "GET", undefined, {});
      const responseCoffeehouses = await callApi(
        "/coffee_houses",
        "GET",
        undefined,
        {}
      );

      setToppings(responseToppings);
      setCoffeeHouses(responseCoffeehouses);
    };

    getData();
  }, []);

  useEffect(() => {
    if (
      !order ||
      order.status !== "Отдан покупателю" ||
      order.status !== "Готов" ||
      order.status !== "Не забран покупателем"
    ) {
      checkStatus();
      const interval = setInterval(() => {
        checkStatus();
      }, 60000);

      return () => clearInterval(interval);
    }
  }, []);

  const checkStatus = async () => {
    try {
      const res = await callApi(
        `/last_order`,
        "GET",
        undefined,
        {},
        cookies.jwt
      );

      if (res.detail === "Не удалось проверить учетные данные.") {
        router.push("/");
      }

      if (res && res.detail) {
        setOrder(null);
        error(res.detail);
        return;
      }

      setOrder(res);

      if (coffeeHouses) {
        setCoffeeHouse(
          coffeeHouses.filter((item) => item.id === res.coffee_house)[0]
        );
      }
    } catch (e) {
      // TODO: Function for handling errors
      console.log(e);
    }
  };

  const cancelOrder = async () => {
    if (order) {
      try {
        const res = await callApi(
          `/cancel_order?order_number=${order.order_number}`,
          "PUT",
          undefined,
          {},
          cookies.jwt
        );

        if (res === 'Ok') {
          dispatch(setCancelTime(0));
          success(
            "Заказ успешно отменен."
          );
          checkStatus();
        }

      } catch (e) {
        // TODO: Function for handling errors
        console.log(e);
      }
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title> Cofefu - Последний заказ </title>
        <meta name="description" content="Информация о закаке" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        {!order ? (
          <div className={styles.empty}>
            <h2>Вы ещё ничего не заказали</h2>

            <Link href="/menu">
              <span className={styles.menuLink}>В меню</span>
            </Link>
          </div>
        ) : (
          <div className={styles.orderInfo}>
            <h2 className={styles.header}>Последний заказ</h2>

            <div>
              <h3 className={styles.title}>Номер заказа</h3>
              <span className={styles.number}>{order.order_number}</span>
            </div>

            <Tag className={styles.status}>{order.status}</Tag>

            <div>
              <h3 className={styles.title}>Будет готов к</h3>
              <span className={styles.number}>
                {dayjs(order.time).format("HH:mm")}
              </span>
            </div>

            {coffeeHouse && (
              <div>
                <h3 className={styles.title}>Кофейня</h3>
                <span className={styles.number}>
                  {coffeeHouse.name + " " + coffeeHouse.placement}
                </span>
              </div>
            )}

            {
              cancelTime !== 0 && (
                <button className={styles.refreshButton} onClick={cancelOrder}>Отменить заказ {formatSecondsToTime(cancelTime / 1000)}</button>
              )
            }

            <button className={styles.refreshButton} onClick={checkStatus}>Обновить</button>
          </div>
        )}
      </main>
    </div>
  );
}

export default withLayout(Order);
