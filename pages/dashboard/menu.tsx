import { withLayout } from '../../dashboardLayout/Layout';
import styles from '../../styles/dashboard/menu.module.css';
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../store'
import { useEffect } from 'react'
import { fetchMenu, fetchToppings } from '../../store/features/menuSlice'
import { SearchOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd';
import { Button, Input, Modal, Popconfirm, Select, Space, Table } from 'antd'
import type { ColumnType, ColumnsType } from 'antd/es/table';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import React, { useRef, useState } from 'react';
import { Form, InputNumber, Typography } from 'antd';
import TextArea from 'antd/lib/input/TextArea'

const Menu = ( ) => {


  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isToppingModalOpen, setIsToppingModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);
  const [editTopping, setEditTopping] = useState<any>(null);

  const handleOk = () => {
    setIsModalOpen(false);
    setIsToppingModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsToppingModalOpen(false);
  };

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: any,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: any): ColumnType<any> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Поиск
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Сбросить
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Закрыть
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        text
      ) : (
        text
      ),
  });

  const menu = useSelector((state: RootState) => state.menu.products);
  const toppings = useSelector((state: RootState) => state.menu.toppings);
  const dispatch = useDispatch<AppDispatch>();

  const columns = [
    {
      title: 'Тип',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Название',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Описание',
      dataIndex: 'description',
      key: 'description',
      ...getColumnSearchProps('description'),
    },
    {
      title: 'Виды',
      dataIndex: 'variations',
      key: 'variations',
      render: (text: string, record: any) => {
        return (
          <div>
            {record.variations.map((item:any) => (
              <div>
                {item.size} - {item.price} руб.
              </div>
            ))}
          </div>
        )
      },
    },
    {
      title: "Действия",
      dataIndex: 'operation',
      render: (_: any, record: any) => {
        return (
         <div>
           <Typography.Link onClick={() => {
             setIsModalOpen(true);
             setEditProduct(record);
           }}>
             Редактировать
           </Typography.Link>
         </div>
        )
      },
    },
  ];

  const toppingsColumns = [
    {
      title: 'Название',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Цена',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: "Действия",
      dataIndex: 'operation',
      render: (_: any, record: any) => {
        return (
          <div>
            <Typography.Link onClick={() => {
              setIsToppingModalOpen(true);
              setEditTopping(record);
            }}>
              Редактировать
            </Typography.Link>
          </div>
        )
      },
    },
  ];

  useEffect(() => {
    if (menu.length === 0) {
      dispatch(fetchMenu());
    }
    if (toppings.length === 0) {
      dispatch(fetchToppings());
    }
  }, []);

  const handleAdd = () => {

  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.coffeehouse}>
        Управление меню - Полка Кофе
      </div>

      <div className={styles.card}>
        <div className={styles.tableTitle}>
          Напитки
        </div>
        <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
          Новый напиток
        </Button>
        <Table dataSource={menu} columns={columns} rowKey='id' />
      </div>

      <div className={styles.card}>
        <div className={styles.tableTitle}>
          Добавки
        </div>
        <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
          Новая добавка
        </Button>
        <Table dataSource={toppings} columns={toppingsColumns} rowKey='id' />
      </div>

      {/*<div className={styles.card}>*/}
      {/*  <div className={styles.tableTitle}>*/}
      {/*    Продукты*/}
      {/*  </div>*/}
      {/*  <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>*/}
      {/*    Новый продукт*/}
      {/*  </Button>*/}
      {/*  <Table dataSource={menu} columns={columns} rowKey='id' />*/}
      {/*</div>*/}



      <Modal title="Редактирование продукта" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} destroyOnClose>
        {editProduct ? (
          <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
            style={{ maxWidth: 600 }}
          >
            <Form.Item label="Тип">
              <Select defaultValue={editProduct.type}>
                <Select.Option value="Кофе">Кофе</Select.Option>
                <Select.Option value="Не кофе">Не кофе</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="Название">
              <Input defaultValue={editProduct.name} />
            </Form.Item>
            <Form.Item label="Описание">
              <TextArea defaultValue={editProduct.description} />
            </Form.Item>
            {
              editProduct.variations.map((item: any) => (
                <div>
                  <Form.Item label="Размер">
                  <Select defaultValue={item.size}>
                    <Select.Option value="S">Маленький</Select.Option>
                    <Select.Option value="M">Средний</Select.Option>
                    <Select.Option value="L">Большой</Select.Option>
                  </Select>
                  </Form.Item>
                  <Form.Item label="Цена">
                    <Input defaultValue={item.price} />
                  </Form.Item>
                </div>
              ))
            }
          </Form>
        ) : (<></>)}
      </Modal>
      <Modal title="Редактирование добавки" open={isToppingModalOpen} onOk={handleOk} onCancel={handleCancel} destroyOnClose>
        {editTopping ? (
          <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
            style={{ maxWidth: 600 }}
          >
            <Form.Item label="Название">
              <Input defaultValue={editTopping.name} />
            </Form.Item>
            <Form.Item label="Цена">
              <Input defaultValue={editTopping.price} />
            </Form.Item>
          </Form>
        ) : (<></>)}
      </Modal>
    </div>
  )
}

export default withLayout(Menu);