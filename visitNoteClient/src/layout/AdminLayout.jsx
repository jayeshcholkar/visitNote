// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { Layout, Card, Menu } from "antd";
import { Scrollbars } from "react-custom-scrollbars";
import { MenueItems } from "./MenueItems";
import { Outlet, Link, NavLink } from "react-router-dom";
import Logo from "../static/images/Logo.svg";
import logout from "../static/images/log-out-01.svg";
import userPro from "../static/images/Ellipse47.png";
import { Div } from "./style";

const { Sider, Content } = Layout;

export const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(true);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  return (
    <Div>
      <Layout className="layout">
        <Sider width={280} collapsed={collapsed}>
          <div className="demo-logo">
            <Link to="/">
              <img src={Logo} alt="Brand logo" />
            </Link>
            {/* <Button
              className="nav-toggle-btn"
              shape="circle"
              icon={
                <Icon
                  icon={
                    collapsed
                      ? "solar:round-alt-arrow-left-linear"
                      : "solar:round-alt-arrow-right-linear"
                  }
                />
              }
              onClick={toggleCollapsed}
            /> */}
          </div>
          <div className="aside-menu">
            <Scrollbars
              className="custom-scrollbar"
              autoHide
              autoHideTimeout={500}
              autoHideDuration={200}
            >
              <MenueItems />
            </Scrollbars>
          </div>
          <div className="aside-profile">
            <Menu theme="dark" selectedKeys={["1"]}>
              <Menu.Item
                className="user-profile"
                icon={<img src={userPro} alt="settings" />}
              >
                <NavLink to={"/"}>User Name</NavLink>
              </Menu.Item>
              <Menu.Item icon={<img src={logout} alt="settings" />}>
                <NavLink to={"/"}>Log Out</NavLink>
              </Menu.Item>
            </Menu>
          </div>
        </Sider>
        <Layout className="atbd-main-layout">
          <Content>
            <Card>
              <Outlet />
            </Card>
          </Content>
        </Layout>
      </Layout>
    </Div>
  );
};
