import { Badge, Modal } from "antd";
import { motion } from "framer-motion";
import { MouseEvent, useEffect, useState } from 'react'
import { ITopping } from "../../interfaces/product.interface";
import { success } from "../../services/AlertingService/AlertingFunctions";
import styles from "./ProductCard.module.css";
import { ProductCardProps } from "./ProductCard.props";
import { HeartFilled } from '@ant-design/icons'
import classNames from 'classnames'

interface ISize {
  size: string;
  price: number;
  id: string;
}

export const ProductCard = ({ product, toppings, setFavorites }: ProductCardProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const json = localStorage.getItem('favorites');
    if (json) {
      const favorites: any[] = JSON.parse(json);
      if (favorites.includes(product.id)) {
        setIsFavorite(true);
      }
    }
  }, [])

  const showModal = () => {
    if (toppings) {
      setIsModalVisible(true);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    clearProduct();
  };
  const [sum, setSum] = useState<number>(product.variations[0].price);

  const [size, setSize] = useState<ISize>({
    ...product.variations[0],
  });
  const [topping, setTopping] = useState<ITopping[]>([]);

  const changeSize = (evt: MouseEvent<HTMLDivElement>) => {
    const price =
      (evt.currentTarget.dataset.price &&
        parseInt(evt.currentTarget.dataset.price)) ||
      0;

    setSize({
      size:
        (evt.currentTarget.dataset.size &&
          parseInt(evt.currentTarget.dataset.size)) ||
        -1,
      price: price,
      id: evt.currentTarget.dataset.id || "",
    });

    setSum(price + (topping.reduce((a, b) => (a += b.price), 0) || 0));

    const checkboxes = document.getElementsByClassName(styles.sizeCheckbox);
    for (let i = 0; i < checkboxes.length; i += 1) {
      checkboxes[i].classList.remove(styles.activeSize);
    }
    evt.currentTarget.classList.add(styles.activeSize);
  };

  const changeTopping = (evt: MouseEvent<HTMLDivElement>) => {
    const clickedTopping =
      (evt.currentTarget.dataset.topping &&
        parseInt(evt.currentTarget.dataset.topping)) ||
      -1;

    const clickedPrice =
      (evt.currentTarget.dataset.price &&
        parseInt(evt.currentTarget.dataset.price)) ||
      0;

    // if click on active topping
    if (topping.map((item) => item.id).includes(clickedTopping)) {
      const filteredToppings = [
        ...topping.filter((item) => item.id !== clickedTopping),
      ];
      setTopping(filteredToppings);
      setSum(size.price + filteredToppings.reduce((a, b) => (a += b.price), 0));
      const checkboxes = document.getElementsByClassName(
        styles.toppingCheckbox
      );
      for (let i = 0; i < checkboxes.length; i += 1) {
        if (
          checkboxes[i].getAttribute("data-topping") &&
          parseInt(checkboxes[i].getAttribute("data-topping") || "-1") ===
            clickedTopping
        ) {
          checkboxes[i].classList.remove(styles.activeTopping);
        }
      }
      return;
    }

    setTopping([
      ...topping,
      {
        id: clickedTopping,
        name: evt.currentTarget.dataset.name || "",
        price: clickedPrice,
      },
    ]);

    setSum(
      size.price + clickedPrice + topping.reduce((a, b) => (a += b.price), 0)
    );

    const checkboxes = document.getElementsByClassName(styles.toppingCheckbox);
    for (let i = 0; i < checkboxes.length; i += 1) {
      if (
        !topping
          .map((item) => item.id)
          .includes(
            parseInt(checkboxes[i].getAttribute("data-topping") || "-1")
          )
      ) {
        checkboxes[i].classList.remove(styles.activeTopping);
      }
    }
    evt.currentTarget.classList.add(styles.activeTopping);
  };

  const clearProduct = () => {
    setSum(product.variations[0].price);
    setSize({
      ...product.variations[0],
    });
    setTopping([]);

    let checkboxes = document.getElementsByClassName(styles.sizeCheckbox);
    for (let i = 0; i < checkboxes.length; i += 1) {
      checkboxes[i].classList.remove(styles.activeSize);
    }
    checkboxes[0].classList.add(styles.activeSize);

    checkboxes = document.getElementsByClassName(styles.toppingCheckbox);
    for (let i = 0; i < checkboxes.length; i += 1) {
      checkboxes[i].classList.remove(styles.activeTopping);
    }
  };

  const addProduct = () => {
    success("Продукт успешно добавлен в корзину!", 5);

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push({ ...product, price: sum, topping: topping, id: size.id });
    localStorage.setItem("cart", JSON.stringify(cart));
    handleCancel();
  };

  const addMoreProduct = () => {
    success("Продукт успешно добавлен в корзину!", 5);

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push({ ...product, price: sum, topping: topping, id: size.id });
    localStorage.setItem("cart", JSON.stringify(cart));

    clearProduct();
  };

  return (
    <>
      <div className={styles.card} >
        <div className={styles.title} onClick={showModal}>
          <h3 className={styles.name}> {product.name}</h3>
          {product.variations.map((variant) => (
            <Badge
              key={variant.id}
              count={variant.size}
              style={{ backgroundColor: "#D8AB7E" }}
            />
          ))}
        </div>
        <div className={styles.description} onClick={showModal}>{product.description}</div>
        <div className={styles.price}>
          <div onClick={showModal}>
            {product.variations
              .reduce((a, b) => (a += b.price + "/"), "")
              .slice(0, -1)}{" "}
            ₽
          </div>
          { setFavorites && (
            <div onClick={() => {
              const json = localStorage.getItem('favorites');
              if (json) {
                const favorites: any[] = JSON.parse(json);
                if (!favorites.includes(product.id)) {
                  setIsFavorite(true);
                  localStorage.setItem('favorites', JSON.stringify([...favorites, product.id]));
                  setFavorites([...favorites, product.id]);
                } else {
                  localStorage.setItem('favorites', JSON.stringify([...favorites.filter((item: any) => item != product.id)]));
                  setIsFavorite(false);
                  setFavorites(favorites.filter((item: any) => item != product.id));
                }
              } else {
                localStorage.setItem('favorites', JSON.stringify([product.id]));
                setFavorites([product.id]);
              }
            }} className={classNames({ [styles.isFavorite]: isFavorite
            })}>
              <HeartFilled />
            </div>
          )}
        </div>
      </div>

      {toppings && (
        <Modal visible={isModalVisible} footer={null} onCancel={handleCancel}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>{product.name}</h3>

            <span>Размер</span>

            <div className={styles.sizes}>
              {product.variations.map((item, index) => {
                return (
                  <div
                    key={index}
                    className={`${styles.sizeCheckbox} ${
                      index === 0 ? styles.activeSize : ""
                    }`}
                    data-size={item.size}
                    onClick={changeSize}
                    data-price={item.price}
                    data-id={item.id}
                  >
                    {item.size}
                  </div>
                );
              })}
            </div>

            <span>Добавки</span>

            <div className={styles.toppings}>
              {toppings.map((topping, index) => {
                return (
                  <div
                    key={index}
                    className={styles.toppingCheckbox}
                    data-topping={topping.id}
                    onClick={changeTopping}
                    data-price={topping.price}
                    data-name={topping.name}
                  >
                    {`${topping.name} + ${topping.price}₽`}
                  </div>
                );
              })}
            </div>

            <motion.button
              className={styles.addButton}
              onClick={addProduct}
              layout
            >
              {`Добавить - ${sum}₽`}
            </motion.button>
            <motion.button
              className={styles.addButton}
              onClick={addMoreProduct}
              layout
            >
              +1
            </motion.button>
          </div>
        </Modal>
      )}
    </>
  );
};
