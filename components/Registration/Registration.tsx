import React, { useState, ChangeEvent } from "react";

import styles from "./Registration.module.css";

import {
  success,
  error,
  warning,
  info,
} from "../../services/AlertingService/AlertingFunctions";
import { Button, Card, Input, PageHeader, Spin } from "antd";
import cn from "classnames";
import callApi from "../../common/callApi";
import { useCookies } from "react-cookie";
import { RegistrationProps } from "./Registration.props";

import { add } from "date-fns";
import { useRouter } from "next/router";

export const Registration = ({ setActiveType }: RegistrationProps) => {
  const [number, setNumber] = useState("");
  const [numberValid, setNumberValid] = useState(true);
  const [name, setName] = useState("");
  const [cookies, setCookie] = useCookies(["jwt"]);
  const router = useRouter();
  const [registerLoading, setRegisterLoading] = useState(false);

  const handleTelephoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    const num = event.target.value.replace(/\s+/g, "");

    if (num.length === 11 && /^(\+7|7|8)[0-9]{10}$/.test(num)) {
      setNumber(
        `${num[0]} ${num.slice(1, 4)} ${num.slice(4, 7)} ${num.slice(
          7,
          9
        )} ${num.slice(9, 11)}`
      );
      setNumberValid(true);
      return;
    }

    if (
      num[0] === "+" &&
      num.length === 12 &&
      /^(\+7|7|8)[0-9]{10}$/.test(num)
    ) {
      setNumber(
        `${num.slice(0, 2)} ${num.slice(2, 5)} ${num.slice(5, 8)} ${num.slice(
          8,
          10
        )} ${num.slice(10, 12)}`
      );
      setNumberValid(true);
      return;
    }

    if (num.length === 9) {
      setNumber(
        `${num[0]} ${num.slice(1, 4)} ${num.slice(4, 7)} ${num.slice(7, 9)}`
      );
      setNumberValid(false);
      return;
    }

    if (num[0] === "+" && num.length === 10) {
      setNumber(
        `${num.slice(0, 2)} ${num.slice(2, 5)} ${num.slice(5, 8)} ${num.slice(
          8,
          10
        )}`
      );
      setNumberValid(false);
      return;
    }

    setNumber(num.replace(/\B(?=(\d{3})+(?!\d))/g, " "));
    if (!/^(\+7|7|8)[0-9]{10}$/.test(num)) {
      setNumberValid(false);
    } else {
      setNumberValid(true);
    }
  };

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (
      /^[a-zA-Zа-яА-ЯёЁ]+$/.test(event.target.value) ||
      event.target.value === ""
    ) {
      setName(event.target.value);
    }
  };

  const sendRegisterData = () => {
    if (name === "" || number === "") {
      error("Данные не заполнены", 5);
      return;
    }

    const phone = number.replace(/\s+/g, "");
    const customer = {
      name: name,
      phone_number: phone.slice(phone.length - 10),
    };

    const registerCustomer = async () => {
      try {
        setRegisterLoading(true);
        const response = await callApi(
          "/register_customer",
          "POST",
          customer,
          {}
        );

        setRegisterLoading(false);
        if (response.detail) {
          error(response.detail, 5);
          return;
        }
        if (response) {
          success(
            "Регистрация успешна. Не забудьте подтвердить номер телефона. Сделать это можно в профиле.",
            20
          );
          setCookie("jwt", response, {
            path: "/",
            expires: new Date(add(new Date(), { days: 15 })),
          });
          router.push("/menu");
        }
      } catch (e) {}
    };

    registerCustomer();
  };

  return (
    <>
      <Card className={cn(styles.authForm)} style={{ width: 614 }}>
        <h2>Регистрация</h2>
        <h5>
          Уже зарегистрированы?{" "}
          <Button type="link" onClick={() => setActiveType("login")}>
            Войти
          </Button>
        </h5>

        <label className={styles.nameLabel}>
          <span>Ваше имя</span>
          <Input value={name} onChange={handleNameChange} type="text" />
        </label>
        <label className={styles.phoneLabel}>
          <span>Номер телефона</span>
          <Input
            value={number}
            onChange={handleTelephoneChange}
            status={numberValid ? "" : "error"}
            type="tel"
          />
        </label>

        <Spin tip="Отправляю..." spinning={registerLoading}>
          <button className={styles.button} onClick={sendRegisterData}>
            ЗАРЕГИСТРИРОВАТЬСЯ
          </button>
        </Spin>
      </Card>
    </>
  );
};
