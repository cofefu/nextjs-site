import { withLayout } from '../../dashboardLayout/Layout';
import styles from '../../styles/dashboard/index.module.css';
import { LineWithSlider } from '../../components/Charts/lineWithSlider'
import { PieChart } from '../../components/Charts/pie'
import { Table } from 'antd'

const Home = ( ) => {

  const dataSource = [
    {
      key: '1',
      name: 'Латте',
      count: '43'
    },
    {
      key: '2',
      name: 'Капучинно',
      count: '39'
    },
    {
      key: '3',
      name: 'Раф',
      count: '28'
    },
    {
      key: '4',
      name: 'Моккачино',
      count: '26'
    },
    {
      key: '5',
      name: 'Американо',
      count: '22'
    },
  ];
  const columns = [
    {
      title: 'Продукт',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Кол-во заказов',
      dataIndex: 'count',
      key: 'count',
    },
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.coffeehouse}>
        Полка Кофе
      </div>

      <div className={styles.totalIncome}>
        <div className={styles.card}>
          <div className={styles.chartTitle}>
            Количество посетителей
          </div>
          <LineWithSlider
            data={
              [
                {
                  "Date": "2021-01",
                  "Кол-во клиентов": 7641
                },
                {
                  "Date": "2021-02",
                  "Кол-во клиентов": 7241
                },
                {
                  "Date": "2021-03",
                  "Кол-во клиентов": 7621
                },
                {
                  "Date": "2021-04",
                  "Кол-во клиентов": 7141
                },
                {
                  "Date": "2021-05",
                  "Кол-во клиентов": 6741
                },
                {
                  "Date": "2021-06",
                  "Кол-во клиентов": 6641
                },
                {
                  "Date": "2021-06",
                  "Кол-во клиентов": 8141
                },
                {
                  "Date": "2021-07",
                  "Кол-во клиентов": 8641
                },
                {
                  "Date": "2021-08",
                  "Кол-во клиентов": 7641
                },
                {
                  "Date": "2021-09",
                  "Кол-во клиентов": 6641
                },
                {
                  "Date": "2021-10",
                  "Кол-во клиентов": 7612
                },
                {
                  "Date": "2021-11",
                  "Кол-во клиентов": 7541
                },
                {
                  "Date": "2021-12",
                  "Кол-во клиентов": 7751
                },
                {
                  "Date": "2022-01",
                  "Кол-во клиентов": 7123
                },
                {
                  "Date": "2022-02",
                  "Кол-во клиентов": 7642
                },
                {
                  "Date": "2022-03",
                  "Кол-во клиентов": 8723
                },
                {
                  "Date": "2022-04",
                  "Кол-во клиентов": 7141
                },{
                "Date": "2022-05",
                "Кол-во клиентов": 7123
              },
                {
                  "Date": "2022-06",
                  "Кол-во клиентов": 7635
                },
                {
                  "Date": "2022-07",
                  "Кол-во клиентов": 7751
                },
                {
                  "Date": "2022-08",
                  "Кол-во клиентов": 7123
                },
                {
                  "Date": "2022-09",
                  "Кол-во клиентов": 7512
                },
                {
                  "Date": "2022-10",
                  "Кол-во клиентов": 7751
                },
                {
                  "Date": "2022-11",
                  "Кол-во клиентов": 7713
                },
                {
                  "Date": "2022-12",
                  "Кол-во клиентов": 8222
                },
              ]
            }
            yField='Кол-во клиентов'
          />
        </div>
        <div className={styles.card}>
          <div className={styles.chartTitle}>
            Посетителей за месяц
          </div>
          <PieChart />
        </div>
      </div>

      <div className={styles.otherStatistic}>
        <div className={styles.card}>
          <div className={styles.chartTitle}>
            Доход
          </div>
          <LineWithSlider
            data={
              [
                {
                  "Date": "2021-01",
                  "Кол-во клиентов": 7641
                },
                {
                  "Date": "2021-02",
                  "Кол-во клиентов": 7241
                },
                {
                  "Date": "2021-03",
                  "Кол-во клиентов": 7621
                },
                {
                  "Date": "2021-04",
                  "Кол-во клиентов": 7141
                },
                {
                  "Date": "2021-05",
                  "Кол-во клиентов": 6741
                },
                {
                  "Date": "2021-06",
                  "Кол-во клиентов": 6641
                },
                {
                  "Date": "2021-06",
                  "Кол-во клиентов": 8141
                },
                {
                  "Date": "2021-07",
                  "Кол-во клиентов": 8641
                },
                {
                  "Date": "2021-08",
                  "Кол-во клиентов": 7641
                },
                {
                  "Date": "2021-09",
                  "Кол-во клиентов": 6641
                },
                {
                  "Date": "2021-10",
                  "Кол-во клиентов": 7612
                },
                {
                  "Date": "2021-11",
                  "Кол-во клиентов": 7541
                },
                {
                  "Date": "2021-12",
                  "Кол-во клиентов": 7751
                },
                {
                  "Date": "2022-01",
                  "Кол-во клиентов": 7123
                },
                {
                  "Date": "2022-02",
                  "Кол-во клиентов": 7642
                },
                {
                  "Date": "2022-03",
                  "Кол-во клиентов": 8723
                },
                {
                  "Date": "2022-04",
                  "Кол-во клиентов": 7141
                },{
                "Date": "2022-05",
                "Кол-во клиентов": 7123
              },
                {
                  "Date": "2022-06",
                  "Кол-во клиентов": 7635
                },
                {
                  "Date": "2022-07",
                  "Кол-во клиентов": 7751
                },
                {
                  "Date": "2022-08",
                  "Кол-во клиентов": 7123
                },
                {
                  "Date": "2022-09",
                  "Кол-во клиентов": 7512
                },
                {
                  "Date": "2022-10",
                  "Кол-во клиентов": 7751
                },
                {
                  "Date": "2022-11",
                  "Кол-во клиентов": 7713
                },
                {
                  "Date": "2022-12",
                  "Кол-во клиентов": 8222
                },
              ]
            }
            yField='Кол-во клиентов'
          />
        </div>

        <div className={styles.card}>
          <div className={styles.chartTitle}>
            Популярные продукты
          </div>
          <Table dataSource={dataSource} columns={columns} />
        </div>
      </div>
    </div>
  )
}

export default withLayout(Home);