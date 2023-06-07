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

const Workers = ( ) => {

  const workers = [{"id":1,"first_name":"Ailee","last_name":"Valde"},
    {"id":2,"first_name":"Darcy","last_name":"Bewsey"},
    {"id":3,"first_name":"Benedict","last_name":"Dinwoodie"},
    {"id":4,"first_name":"Alta","last_name":"Luscott"},
    {"id":5,"first_name":"Adeline","last_name":"Lamberton"},
    {"id":6,"first_name":"Jock","last_name":"Sneezem"},
    {"id":7,"first_name":"Yancey","last_name":"Belchem"},
    {"id":8,"first_name":"Melisande","last_name":"Gair"},
    {"id":9,"first_name":"Goldia","last_name":"Cashmore"},
    {"id":10,"first_name":"Bernadene","last_name":"Bushel"}];
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editWorker, setEditWorker] = useState<any>(null);

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
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



  const columns = [
    {
      title: 'Имя',
      dataIndex: 'first_name',
      key: 'first_name',
      ...getColumnSearchProps('first_name'),
    },
    {
      title: 'Фамилия',
      dataIndex: 'last_name',
      key: 'last_name',
      ...getColumnSearchProps('last_name'),
    },
    {
      title: "Действия",
      dataIndex: 'operation',
      render: (_: any, record: any) => {
        return (
         <div>
           <Typography.Link onClick={() => {
             setIsModalOpen(true);
             setEditWorker(record);
           }}>
             Редактировать
           </Typography.Link>
         </div>
        )
      },
    },
  ];

  const handleAdd = () => {

  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.coffeehouse}>
        Управление сотрудниками - Полка Кофе
      </div>

      <div className={styles.card}>
        <div className={styles.tableTitle}>
          Сотрудники
        </div>
        <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
          Новый сотрудник
        </Button>
        <Table dataSource={workers} columns={columns} rowKey='id' />
      </div>

      <Modal title="Редактирование сотрудника" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} destroyOnClose>
        {editWorker ? (
          <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
            style={{ maxWidth: 600 }}
          >
            <Form.Item label="Имя">
              <Input defaultValue={editWorker.first_name} />
            </Form.Item>
            <Form.Item label="Фамилия">
              <Input defaultValue={editWorker.last_name} />
            </Form.Item>
          </Form>
        ) : (<></>)}
      </Modal>
    </div>
  )
}

export default withLayout(Workers);