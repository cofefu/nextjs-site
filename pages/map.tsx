import Head from "next/head";
import { useRouter } from "next/router";
import styles from '../styles/Map.module.css';


function Map() {
    const router = useRouter();

    return (
        <div className={styles.container}>
            <Head>
                <title> Cofefu - Карта </title>
                <meta name="description" content="Карта кофеен" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <div onClick={() => router.back()} className={styles.back}>
                    На главную
                </div>
                <div className={styles.mapWrapper}>
                <iframe src="https://yandex.ru/map-widget/v1/?um=constructor%3A87b0228cd86e85bebad9d010b26247b97cd8f1220cf652d7a2b5a64229cb66b0&amp;source=constructor" width="727" height="720"></iframe>
                </div>
            </main>
        </div>
    );
}

export default Map;
