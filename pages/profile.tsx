import { ChangeEvent, useEffect, useState } from "react";
import Head from "next/head";
import styles from "../styles/Profile.module.css";
import callApi from "../common/callApi";

import AlertingService from "../services/AlertingService/AlertingService";
import { withLayout } from "../layout/Layout";
import { Button, Col, Input, List, Modal, Row, Select, Tag } from "antd";
import { error, success } from "../services/AlertingService/AlertingFunctions";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import { IOrder } from "./cart";
import TextArea from "antd/lib/input/TextArea";
import Column from "antd/lib/table/Column";
import {
  ICoffeehouse,
  IProduct,
  ITopping,
} from "../interfaces/product.interface";
import HistoryCard from "../components/HistoryCard/HistoryCard";

const { Option } = Select;

function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    phone_number: "",
  });

  const [isPhoneConfirmed, setIsPhoneConfirmed] = useState(false);
  const [newName, setNewName] = useState<string>(profile.name);
  const [cookies, setCookie, removeCookie] = useCookies(["jwt"]);
  const router = useRouter();

  const [orderHistoryItems, setOrderHistoryItems] = useState<IOrder[]>();
  const [fullOrders, setFullOrders] = useState<any[] | null>(null);
  const [menu, setMenu] = useState<IProduct[]>([]);
  const [toppings, setToppings] = useState<ITopping[]>([]);
  const [coffeeHouses, setCoffeeHouses] = useState<ICoffeehouse[]>([]);

  useEffect(() => {
    const getCustomerAndData = async () => {
      try {
        const res = await callApi(`/me`, "GET", undefined, {}, cookies.jwt);
        const responseProducts = await callApi(
          "/products",
          "GET",
          undefined,
          {}
        );
        const responseToppings = await callApi(
          "/toppings",
          "GET",
          undefined,
          {}
        );
        const orders = await callApi(
          `/my_orders`,
          "GET",
          undefined,
          {},
          cookies.jwt
        );
        const responseCoffeehouses = await callApi(
          "/coffee_houses",
          "GET",
          undefined,
          {}
        );

        setProfile(res);
        setNewName(res.name);
        setOrderHistoryItems(orders);
        setMenu(responseProducts);
        setToppings(responseToppings);
        setCoffeeHouses(responseCoffeehouses);
      } catch (e) {
        console.log(e);
      }
    };

    getCustomerAndData();
  }, []);

  useEffect(() => {
    const checkConfirmed = async () => {
      try {
        const res = await callApi(
          `/is_confirmed`,
          "GET",
          undefined,
          {},
          cookies.jwt
        );
        setIsPhoneConfirmed(res);
      } catch (e) {
        console.log(e);
      }
    };

    checkConfirmed();
  }, []);

  useEffect(() => {
    if (
      menu.length !== 0 &&
      toppings.length !== 0 &&
      coffeeHouses.length !== 0 &&
      orderHistoryItems &&
      orderHistoryItems.length > 0
    ) {
      const fullOrders = orderHistoryItems.map((order) => {
        return {
          ...order,
          products: order.products.map((product) => {
            const fullProduct = menu.filter((item) =>
              item.variations.some((variant) => variant.id === product.id)
            )[0];

            const variant = fullProduct.variations.filter(
              (variant) => variant.id === product.id
            )[0];
            return {
              name: fullProduct.name,
              id: variant.id,
              size: variant.size,
              price: variant.price,
              toppings: product.toppings.map((topping) => {
                const fullTopping = toppings.filter(
                  (addon) => addon.id === topping
                )[0];
                return {
                  ...fullTopping,
                };
              }),
            };
          }),
          coffee_house: coffeeHouses.filter(
            (ch) => ch.id === order.coffee_house
          )[0],
        };
      });
      setFullOrders(fullOrders);
    } else {
      setFullOrders([]);
    }
  }, [menu, toppings, coffeeHouses]);

  useEffect(() => {
    const getCustomer = async () => {
      try {
        const res = await callApi(`/me`, "GET", undefined, {});
        setProfile(res);
      } catch (e) {
        console.log(e);
      }
    };

    if (!profile) {
      getCustomer();
    }
  }, [profile]);

  const [isNameEditable, setIsNameEditable] = useState<boolean>(false);

  const [isModalHistoryVisible, setIsModalHistoryVisible] = useState(false);
  const [isModalFeedbackVisible, setIsModalFeedbackVisible] = useState(false);

  const handleCancel = () => {
    setIsModalHistoryVisible(false);
    setIsModalFeedbackVisible(false);
  };

  const changePhonenumber = () => {
    return;
  };

  const changeName = (event: ChangeEvent<HTMLInputElement>) => {
    if (!isNameEditable) {
      return;
    }

    if (
      /^[a-zA-Zа-яА-ЯёЁ]+$/.test(event.target.value) ||
      event.target.value === ""
    ) {
      setNewName(event.target.value);
    }
  };

  const editName = () => {
    setIsNameEditable(true);
  };

  const saveName = () => {
    if (newName === "") {
      error("Имя не может быть пустым!");
      return;
    }

    if (profile.name === newName) {
      setIsNameEditable(false);
      return;
    }

    const sendNewName = async () => {
      const res = await callApi(
        `/change_name`,
        "PUT",
        newName,
        {},
        cookies.jwt
      );

      if (!res.detail) {
        success("Имя успешно изменено!");
        setIsNameEditable(false);
      }
    };

    sendNewName();
  };

  const verifyNumber = () => {
    if (isPhoneConfirmed) {
      error("Телефон уже подтвержден");
      return;
    }
    const newWindow = window.open("https://t.me/cofefu_bot");
    if (newWindow) newWindow.opener = null;
  };

  // TODO
  const orderHistory = () => {
    setIsModalHistoryVisible(true);
  };
  const feedback = () => {
    setIsModalFeedbackVisible(true);
  };

  const logout = () => {
    removeCookie("jwt");
    router.push("/");
  };

  const listItems = [
    {
      name: "Подтвердить телефон",
      onClick: verifyNumber,
    },
    {
      name: "История заказов",
      onClick: orderHistory,
    },
    {
      name: "Обратная связь",
      onClick: feedback,
    },
    {
      name: "Выйти из аккаунта",
      onClick: logout,
    },
  ];

  const [type, setType] = useState("feedback");

  const handleChange = (value: string) => {
    setType(value);
  };

  const [text, setText] = useState("");
  const handleText = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const sendFeedback = () => {
    if (text === "") {
      error("Сообщение не можеть быть пустым!");
      return;
    }

    if (type === "feedback") {
      const sendFeedback = async () => {
        try {
          await callApi(
            `/feedback`,
            "POST",
            JSON.stringify(text),
            {},
            cookies.jwt
          );
          success("Спасибо за ваш отзыв!");
        } catch (e) {
          console.log(e);
        }
      };

      sendFeedback();
    }
    if (type === "bug") {
      const sendBug = async () => {
        try {
          await callApi(
            `/bugreport`,
            "POST",
            JSON.stringify(text),
            {},
            cookies.jwt
          );
          success("Спасибо за ваш отзыв!");
        } catch (e) {
          console.log(e);
        }
      };

      sendBug();
    }
  };

  return (
    <div>
      <Head>
        <title> Cofefu - Профиль </title>
        <meta name="description" content="Информация о закаке" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h2>Мой cofefu</h2>

        <div className={styles.profileData}>
          <div className={styles.name}>
            <Input
              className={styles.input}
              value={newName}
              onChange={changeName}
            />
            {isNameEditable ? (
              <SaveOutlined className={styles.editButton} onClick={saveName} />
            ) : (
              <EditOutlined className={styles.editButton} onClick={editName} />
            )}
          </div>
          <Input
            className={styles.input}
            prefix={"+7"}
            value={profile.phone_number}
            onChange={changePhonenumber}
          />
        </div>

        <div>
          <List
            dataSource={listItems}
            renderItem={(item) => (
              <List.Item onClick={item.onClick}>
                <div className={styles.listItem}>{item.name}</div>
              </List.Item>
            )}
          />
        </div>
      </main>

      <Modal
        visible={isModalHistoryVisible}
        footer={null}
        onCancel={handleCancel}
      >
        <div className={styles.history}>
          {fullOrders &&
            fullOrders.map((item, index) => (
              <HistoryCard key={index} item={item} />
            ))}
        </div>
      </Modal>

      <Modal
        visible={isModalFeedbackVisible}
        footer={null}
        onCancel={handleCancel}
      >
        <div className={styles.feedback}>
          <Row>
            <Select
              defaultValue="feedback"
              style={{ width: 320 }}
              onChange={handleChange}
            >
              <Option value="feedback">Отзыв</Option>
              <Option value="bug">Техническая ошибка</Option>
            </Select>
          </Row>

          <Row>
            <TextArea
              style={{ width: 320 }}
              rows={4}
              placeholder="Введите сообщение"
              onChange={handleText}
            />
          </Row>

          <Button onClick={sendFeedback}>Отправить</Button>
        </div>
      </Modal>
    </div>
  );
}

export default withLayout(Profile);
