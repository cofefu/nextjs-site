import { ChangeEvent, useEffect, useState } from "react";
import Head from "next/head";
import styles from "../styles/Cart.module.css";
import callApi from "../common/callApi";

import { withLayout } from "../layout/Layout";
import { Input, Select } from "antd";
import { ICoffeehouse, ITopping } from "../interfaces/product.interface";
import Link from "next/link";
import { CartCard } from "../components/CartCard/CartCard";
import { ICartProduct } from "../components/CartCard/CartCard.props";
import _ from "lodash";
import { TimePicker } from "antd";
import format, { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { error, success } from "../services/AlertingService/AlertingFunctions";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { fetchCoffeeHouses, fetchToppings } from "../store/features/menuSlice";
import { startCancelTime } from "../store/features/orderSlice";

interface IOrderProduct {
  id: number;
  toppings: number[];
}

export interface IOrder {
  coffee_house: number;
  products: IOrderProduct[];
  time: string;
  comment: string;
}

const { TextArea } = Input;

function Cart() {
  const { Option } = Select;

  const [cartItems, setCartItems] = useState<ICartProduct[]>([]);
  const [time, setTime] = useState<Dayjs>(dayjs().add(6, "minute"));
  const [coffeeHouse, setCoffeeHouse] = useState<number>(1);
  const [comment, setComment] = useState<string>("");
  const [cookies, setCookie] = useCookies(["jwt"]);
  const router = useRouter();

  const coffeeHouses = useSelector((state: RootState) => state.menu.coffeeHouses);
  const toppings = useSelector((state: RootState) => state.menu.toppings);
  const dispatch = useDispatch<AppDispatch>();


  useEffect(() => {
    if (coffeeHouses.length === 0) {
      dispatch(fetchCoffeeHouses());
    }
    if (toppings.length === 0) {
      dispatch(fetchToppings());
    }
  }, []);

  const onChangeTime = (time: Dayjs) => {
    setTime(time);
  };

  const onChangeComment = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setComment(event.target.value);
  };

  const clearCart = () => {
    localStorage.removeItem("cart");
    setCartItems([]);
  };

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(data);
  }, []);

  const deleteItem = (item: ICartProduct) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    let deleted = false;
    const newCart = cart.filter((product: ICartProduct) => {
      if (deleted) {
        return true;
      }
      if (_.isEqual(product, item)) {
        deleted = true;
      }
      return !_.isEqual(product, item);
    });
    localStorage.setItem("cart", JSON.stringify(newCart));
    setCartItems(newCart);
  };

  const handleChange = (value: number) => {
    setCoffeeHouse(value);
  };

  const makeOrder = () => {

    if (time.diff(dayjs()) < 0) {
      error("Выбрано неверное время. Возможно кафе уже закрыто!", 5);
      return;
    }

    const order: IOrder = {
      coffee_house: coffeeHouse,
      products: [],
      time: dayjs(time).format("YYYY-MM-DD HH:mm").toString(),
      comment: comment,
    };

    cartItems.forEach((product) => {
      const topping = toppings.filter((tpg) =>
        product.topping.map((item) => item.id).includes(tpg.id)
      );
      order.products.push({
        id: product.id,
        toppings: topping.length > 0 ? [...topping.map((item) => item.id)] : [],
      });
    });

    const sendOrder = async () => {
      try {
        const response = await callApi(
          `/make_order`,
          "POST",
          order,
          {},
          cookies.jwt
        );

        if (response.detail === "Не удалось проверить учетные данные.") {
          router.push("/");
        }

        if (response.detail) {
          error(response.detail);
        }
        if (response["order_number"]) {
          dispatch(startCancelTime());
          success(
            "Успешный заказ. Номер вашего заказа " + response["order_number"] + '.  У вас есть 1 минута для отмены заказа, если произошла ошибка.'
          );
          clearCart();
        }
      } catch (e) {}
    };

    sendOrder();
  };

  return (
    <div className={styles.container}>
      <Head>
        <title> Cofefu - Меню </title>
        <meta
          name="description"
          content="Выбери любимый продукт из меню не приходя в кофейню!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        {cartItems.length === 0 ? (
          <div className={styles.empty}>
            <h2>В вашей корзине пусто</h2>

            <Link href="/menu">
              <span className={styles.menuLink}>В меню</span>
            </Link>
          </div>
        ) : (
          <div className={styles.content}>
            <div>
              <h2 className={styles.orderTitle}>
                Мой заказ
                <span className={styles.clearCart} onClick={clearCart}>
                  Очистить
                </span>
              </h2>

              <div className={styles.products}>
                {cartItems.map((item, index) => (
                  <CartCard
                    product={item}
                    toppings={toppings}
                    key={index}
                    deleteItem={deleteItem}
                  />
                ))}
              </div>
            </div>

            <div className={styles.orderInfo}>
              <h2 className={styles.orderTitle}>Информация о заказе</h2>

              <div>
                <h3 className={styles.title}>Кофейня</h3>
                <Select
                  value={coffeeHouse}
                  style={{ width: "auto" }}
                  onChange={handleChange}
                  size="large"
                >
                  {coffeeHouses &&
                    coffeeHouses.map((coffeeHouse) => (
                      <Option value={coffeeHouse.id} key={coffeeHouse.id}>
                        {coffeeHouse.name + " " + coffeeHouse.placement}
                      </Option>
                    ))}
                </Select>
              </div>

              <div>
                <h3 className={styles.title}>Во сколько заберете?</h3>
                <TimePicker
                  value={time}
                  onChange={onChangeTime}
                  format="HH:mm"
                  size="large"
                />
              </div>

              <div>
                <h3 className={styles.title}>Комментарий</h3>
                <TextArea rows={4} value={comment} onChange={onChangeComment} />
              </div>

              <button className={styles.orderButton} onClick={makeOrder}>
                Оформить заказ
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default withLayout(Cart);
