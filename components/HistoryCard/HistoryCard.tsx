import React from "react";
import { HistoryCardProps } from "./HistoryCard.props";
import styles from "./HistoryCard.module.css";
import { format } from "date-fns";
import dayjs from "dayjs";

export default function HistoryCard({ item }: HistoryCardProps) {
  return (
    <div className={styles.card}>
      <span className={styles.number}>{item.order_number}</span>
      <span className={styles.coffee_house}>
        {item.coffee_house.name + " " + item.coffee_house.placement}
      </span>
      <span className={styles.time}>
        {dayjs(item.time).format("DD MM HH:mm")}
      </span>

      <div className={styles.products}>
        {item.products.map((product: any, index: number) => {
          return (
            <div className="row" key={index}>
              <div className="col">
                {product.name}{" "}
                {product.toppings[0] ? "- " + product.toppings[0].name : ""}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
