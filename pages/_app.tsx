import type { AppProps } from "next/app";
import Head from "next/head";

import "nprogress/nprogress.css";
import "../styles/nprogress.css";
import "../styles/globals.css";
import "antd/dist/antd.css";
import "../styles/custom-antd.css";
import dynamic from "next/dynamic";

import AlertingService from "../services/AlertingService/AlertingService";
import store from "../store";
import { Provider } from "react-redux";
import { PrismicPreview } from '@prismicio/next';
import { repositoryName } from '../prismicio';

const TopProgressBar = dynamic(
  () => {
    return import("../components/TopProgressBar/TopProgressBar");
  },
  { ssr: false }
);

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <>
      <Head>
        <title>Cofefu - заказ кофе</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <TopProgressBar />

      <AlertingService horizontal={"right"} vertical={"top"} />

      <Provider store={store}>
        <PrismicPreview repositoryName={repositoryName}>
          <Component {...pageProps} />
        </PrismicPreview>
      </Provider>
    </>
  );
}

export default MyApp;
