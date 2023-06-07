import styles from './CartCard.module.css'
import { Badge } from 'antd'
import { CartCardProps, ICartProduct } from './CartCard.props'
import React from 'react'
import { DeleteOutlined } from '@ant-design/icons'

export const CartCard = ({ product, toppings, deleteItem }: CartCardProps) => {
  const stringSizes = ['S', 'M', 'L']

  const size = product.variations.filter(item => item.id.toString() === product.id.toString())[0];
  const stringTopping = toppings.filter((topping) => product.topping.map(item => item.id).includes(topping.id));

  return (
    <>
      <div className={styles.card}>
        <div className={styles.title}>
          <h3 className={styles.name}> {product.name}</h3>
          <Badge
            key={product.id}
            count={stringSizes[size.size]}
            style={{ backgroundColor: '#D8AB7E' }}
          />

          <DeleteOutlined className={styles.deleteItem} onClick={() => deleteItem(product)}/>
        </div>
        <div className={styles.toppings}>
          {stringTopping.length !== 0
            ? <span>
              {stringTopping.map(item => item.name).join(', ')}
              </span>
            : <span />}
        </div>
        <div className={styles.price}>
          {product.price}₽
        </div>
      </div>
    </>
  )
}
