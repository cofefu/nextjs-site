import { Button, Card, Input, PageHeader, Spin } from "antd";
import React, { useEffect, useState, ChangeEvent } from "react";

import styles from "./Login.module.css";

import {
  success,
  error,
  warning,
  info,
} from "../../services/AlertingService/AlertingFunctions";
import callApi from "../../common/callApi";
import cn from "classnames";
import ReactCodeInput from "react-verification-code-input";
import { useCookies } from "react-cookie";
import add from "date-fns/add";
import { LoginProps } from "./Login.props";
import { useRouter } from "next/router";

const Login = ({ setActiveType }: LoginProps) => {
  
  const [loginNumber, setLoginNumber] = useState("");
  const [numberValid, setNumberValid] = useState(true);
  const [numberTouched, setNumberTouched] = useState(false);
  const router = useRouter();
  const [isOpenCode, setIsOpenCode] = useState(false);
  const [numberLoading, setNumberLoading] = useState(false);
  const [code, setCode] = useState("");
  const [codeLoading, setCodeLoading] = useState(false);
  const [cookies, setCookie] = useCookies(["jwt"]);

  if (typeof window !== 'undefined' && localStorage) {
    localStorage.setItem('cart', '');
  }

  useEffect(() => {
    if (code.length === 6) {
      verifyCode();
    }
  }, [code]);

  const handleTelephoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNumberTouched(true);

    const num = event.target.value.replace(/\s+/g, "");

    if (num.length === 11 && /^(\+7|7|8)[0-9]{10}$/.test(num)) {
      setLoginNumber(
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
      setLoginNumber(
        `${num.slice(0, 2)} ${num.slice(2, 5)} ${num.slice(5, 8)} ${num.slice(
          8,
          10
        )} ${num.slice(10, 12)}`
      );
      setNumberValid(true);
      return;
    }

    if (num.length === 9) {
      setLoginNumber(
        `${num[0]} ${num.slice(1, 4)} ${num.slice(4, 7)} ${num.slice(7, 9)}`
      );
      setNumberValid(false);
      return;
    }

    if (num[0] === "+" && num.length === 10) {
      setLoginNumber(
        `${num.slice(0, 2)} ${num.slice(2, 5)} ${num.slice(5, 8)} ${num.slice(
          8,
          10
        )}`
      );
      setNumberValid(false);
      return;
    }

    setLoginNumber(num.replace(/\B(?=(\d{3})+(?!\d))/g, " "));
    if (!/^(\+7|7|8)[0-9]{10}$/.test(num)) {
      setNumberValid(false);
    } else {
      setNumberValid(true);
    }
  };
  
  const checkNumber = () => {
    if (loginNumber === "" || (numberTouched && !numberValid)) {
      error("Неверный номер!", 5);
      return;
    }

    const number = loginNumber.replace(/\s+/g, "");

    const loginCustomer = async () => {
      try {
        setNumberLoading(true);
        const response = await callApi(
          `/send_login_code`,
          "POST",
          {
            name: "",
            phone_number: number.slice(number.length - 10),
          },
          {}
        );

        setNumberLoading(false);
        if (response === "Success") {
          // open code verification
          setIsOpenCode(true);
          return;
        }

        error(response.detail, 5);
      } catch (e: any) {}
    };

    loginCustomer();
  };
  
  const changeCode = (event: string) => {
    setCode(event);
  };

  const verifyCode = () => {
    if (code.length < 6) {
      error("Код не заполнен", 5);
      return;
    }

    const sendVerifyCode = async () => {
      try {
        setCodeLoading(true);
        const response = await callApi(
          `/verify_login_code?code=${code}`,
          "GET",
          undefined,
          {}
        );

        if (response.detail) {
          error(response.detail, 5);
        } else {
          success("Успешный вход.", 5);
          setCookie("jwt", response, {
            path: "/",
            expires: new Date(add(new Date(), { days: 15 })),
          });
          router.push("/menu");
        }

        setCodeLoading(false);
      } catch (e) {}
    };

    sendVerifyCode();
  };

  const verifyPhone = () => {
    const newWindow = window.open("https://t.me/cofefu_bot");
    if (newWindow) newWindow.opener = null;
  };

  return (
    <>
      <Card
        className={cn(styles.authForm, {
          [styles.hidden]: isOpenCode,
        })}
        style={{ width: 614 }}
      >
        <h2>Вход</h2>
        <h5>
          Еще не брали кофе?{" "}
          <Button type="link" onClick={() => setActiveType("registration")}>
            Зарегистрируйтесь
          </Button>
        </h5>

        <label className={styles.phoneLabel}>
          <span>Номер телефона</span>
          <Input
            value={loginNumber}
            onChange={handleTelephoneChange}
            status={numberValid ? "" : "error"}
          />
        </label>

        <Spin tip="Отправляю..." spinning={numberLoading}>
          <button className={styles.loginButton} onClick={checkNumber}>
            ВОЙТИ
          </button>
        </Spin>

        <h3 className={styles.phoneApprove} onClick={verifyPhone}>
          Подтвердить телефон
        </h3>
      </Card>
      <Card
        className={cn(styles.authForm, {
          [styles.hidden]: !isOpenCode,
        })}
        style={{ width: 614 }}
      >
        <PageHeader
          className={styles.verifyTitle}
          onBack={() => setIsOpenCode(false)}
          title="Подтверждение номера"
        />

        <div className={styles.code}>
          <ReactCodeInput type="number" fields={6} onChange={changeCode} />
        </div>
        <Spin tip="Отправляю..." spinning={codeLoading}>
          <button className={styles.loginButton} onClick={verifyCode}>
            ПОДТВЕРДИТЬ
          </button>
        </Spin>
      </Card>
    </>
  );
};

export default Login;
