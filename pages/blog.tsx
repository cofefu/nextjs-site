import Head from "next/head";
import { useRouter } from "next/router";
import styles from '../styles/Map.module.css';


function Blog() {
    const router = useRouter();

    return (
        <div className={styles.container}>
            <Head>
                <title> Cofefu - Блог </title>
                <meta name="description" content="Карта кофеен" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <div onClick={() => router.back()} className={styles.back}>
                    На главную
                </div>
                <div>

                </div>
            </main>
        </div>
    );
}

export default Blog;
