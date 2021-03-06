import React from "react";
import Head from "next/head";
import NavigationBar from "./NavigationBar";

const MainLayout = ({ children, title, isAuth }) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
      </Head>
      <NavigationBar isAuth={isAuth}>{children}</NavigationBar>
    </div>
  );
};

export default MainLayout;
