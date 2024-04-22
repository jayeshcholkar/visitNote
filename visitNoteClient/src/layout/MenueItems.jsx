// eslint-disable-next-line no-unused-vars
import React from "react";
import { Menu } from "antd";
import { NavLink } from "react-router-dom";
import Encounter from "../static/images/Encounter.svg";
import Surgeries from "../static/images/Surgeries.svg";
import Charts from "../static/images/Charts.svg";
import Appointments from "../static/images/Appointments.svg";
import Todos from "../static/images/Todos.svg";
import Receivables from "../static/images/Receivables.svg";
import Notofications from "../static/images/Notofications.svg";
import PuzzlePiece from "../static/images/PuzzlePiece.svg";
import BarChart from "../static/images/BarChart.svg";
import Settings from "../static/images/Settings.svg";

const menuItems = [
  {
    id: "1",
    icon: <img src={Encounter} alt="encounter" />,
    content: "Encounter",
    linkTo: "/",
  },
  {
    id: "2",
    icon: <img src={Charts} alt="charts" />,
    content: "Charts",
    linkTo: "/",
  },
  {
    id: "3",
    icon: <img src={Surgeries} alt="surgeries" />,
    content: "Surgeries",
    linkTo: "/",
  },
  {
    id: "4",
    icon: <img src={Appointments} alt="appointments" />,
    content: "Appointments",
    linkTo: "/",
  },
  {
    id: "5",
    icon: <img src={Todos} alt="todos" />,
    content: "Todos",
    linkTo: "/",
  },
  {
    id: "6",
    icon: <img src={Receivables} alt="receivables" />,
    content: "Receivables",
    linkTo: "/",
  },
  {
    id: "7",
    icon: <img src={Notofications} alt="notofications" />,
    content: "Notofications",
    linkTo: "/",
  },
  {
    id: "8",
    icon: <img src={PuzzlePiece} alt="puzzlePiece" />,
    content: "Puzzle Piece",
    linkTo: "/",
  },
  {
    id: "9",
    icon: <img src={BarChart} alt="barChart" />,
    content: "Bar Chart",
    linkTo: "/",
  },
  {
    id: "10",
    icon: <img src={Settings} alt="settings" />,
    content: "Settings",
    linkTo: "/",
  },
];

export const MenueItems = () => {
  return (
    <>
      <Menu theme="dark" selectedKeys={["1"]}>
        {menuItems.map((item) => (
          <Menu.Item key={item.id} icon={item.icon}>
            <NavLink to={item.linkTo}>{item.content}</NavLink>
          </Menu.Item>
        ))}
      </Menu>
    </>
  );
};
