// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import Routes from "./Router";
import "./static/css/style.css";
import { ConfigProvider } from "antd";

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: '"Montserrat", sans-serif',
        },
      }}
    >
      <div className="App">
        <Routes />
      </div>
    </ConfigProvider>
  );
}

export default App;
