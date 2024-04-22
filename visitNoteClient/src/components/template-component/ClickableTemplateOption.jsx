/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import { useState, useEffect } from "react";
import axios from "axios";
import { List, Input, Tooltip, Button, Modal, message } from "antd";
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import { SearchOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import { Scrollbars } from "react-custom-scrollbars";
import Trash from "../../static/images/Delete.svg";

const { confirm } = Modal;

import { BASEURL } from "../../units/constant";

export const ClickableTemplateOption = (props) => {
  const {
    createPopup,
    insertPopup,
    editPopup,
    expandedItem,
    category,
    templateType = "section",
    setRendered,
    setFilteredList,
    filterBySearch,
    filteredList,
    templates,
  } = props;

  const showDeleteConfirm = (templateDeleteId, templateType) => {
    const api =
      templateType === "master"
        ? `${BASEURL}/deleteMasterTemplate/${templateDeleteId}`
        : `${BASEURL}/removeTemplate/${category}/${templateDeleteId}`;

    confirm({
      title: "Are you sure delete this Template?",
      icon: <ExclamationCircleFilled />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        axios
          .delete(api)
          .then((res) => {
            if (res.status === 200) {
              setTimeout(() => {
                message.success({
                  content: (
                    <div className="message">Template deleted Successfully</div>
                  ),
                  duration: 0.9,
                });
              }, 100);

              setFilteredList((prevState) =>
                prevState.filter((fl) =>
                  templateType === "master"
                    ? fl._id !== templateDeleteId
                    : fl.templateId !== templateDeleteId
                )
              );
              setRendered && setRendered((prev) => !prev);
            } else {
              console.error("Failed to delete template");
            }
          })
          .catch((error) => {
            console.error("Error during template deletion", error);
          });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  const menuItems = [
    {
      key: "1",
      content: "Create Clickable Template",
      linkTo: "/",
    },
    {
      key: "2",
      content: "Insert Clickable Template",
      linkTo: "/",
      itemList: templates,
    },
    {
      key: "3",
      content: "Edit Clickable Template",
      linkTo: "/",
      itemList: templates,
    },
  ];

  return (
    <>
      <List
        itemLayout="horizontal"
        dataSource={menuItems}
        renderItem={(item, index) => {
          return (
            <List.Item
              className={
                index === 0
                  ? "active"
                  : item.itemList?.length > 0
                  ? "active"
                  : ""
              }
              key={index}
            >
              <Link
                to={item.linkTo}
                onClick={
                  index === 0
                    ? () => createPopup(index)
                    : item.itemList?.length > 0
                    ? () => createPopup(index)
                    : null
                }
              >
                {item.content}
                {expandedItem === index && item.itemList?.length > 0 ? (
                  <FeatherIcon size={16} icon="chevron-down" />
                ) : (
                  <FeatherIcon size={16} icon="chevron-right" />
                )}
              </Link>
              {item.itemList && expandedItem === index ? (
                <div className="templateList">
                  <div className="search-header">
                    <Input
                      placeholder="Search for Template"
                      prefix={
                        <SearchOutlined className="site-form-item-icon" />
                      }
                      onChange={(event) => filterBySearch(event, item.itemList)}
                    />
                  </div>
                  <div className="templates" style={{ height: "150px" }}>
                    <Scrollbars
                      className="custom-scrollbar"
                      autoHide
                      autoHideTimeout={500}
                      autoHideDuration={200}
                    >
                      {index === 1 ? (
                        <List
                          itemLayout="horizontal"
                          dataSource={filteredList}
                          renderItem={(item, index) => {
                            return (
                              <List.Item key={index}>
                                <Link
                                  onClick={() => {
                                    templateType === "master"
                                      ? insertPopup(index, item._id)
                                      : insertPopup(index, item.templateId);
                                  }}
                                >
                                  {item.title}
                                </Link>
                                <Tooltip title="Delete">
                                  <Button
                                    value="small"
                                    type="text"
                                    shape="circle"
                                    icon={
                                      // <FeatherIcon size={16} icon="trash-2" />
                                      <img src={Trash} />
                                    }
                                    danger
                                    onClick={() => {
                                      templateType === "master"
                                        ? showDeleteConfirm(
                                            item._id,
                                            templateType
                                          )
                                        : showDeleteConfirm(
                                            item.templateId,
                                            templateType
                                          );
                                    }}
                                  />
                                </Tooltip>
                              </List.Item>
                            );
                          }}
                        />
                      ) : index === 2 ? (
                        <List
                          itemLayout="horizontal"
                          dataSource={filteredList}
                          renderItem={(item, index) => (
                            <List.Item key={index}>
                              <Link
                                onClick={() => {
                                  {
                                    templateType === "master"
                                      ? editPopup(index, item._id)
                                      : editPopup(index, item.templateId);
                                  }
                                }}
                              >
                                {item.title}
                              </Link>
                              <Tooltip title="Delete">
                                <Button
                                  value="small"
                                  type="text"
                                  shape="circle"
                                  icon={
                                    // <FeatherIcon size={16} icon="trash-2" />
                                    <img src={Trash} />
                                  }
                                  danger
                                  onClick={() => {
                                    templateType === "master"
                                      ? showDeleteConfirm(
                                          item._id,
                                          templateType
                                        )
                                      : showDeleteConfirm(
                                          item.templateId,
                                          templateType
                                        );
                                  }}
                                />
                              </Tooltip>
                            </List.Item>
                          )}
                        />
                      ) : null}
                    </Scrollbars>
                  </div>
                </div>
              ) : null}
            </List.Item>
          );
        }}
      />
    </>
  );
};
