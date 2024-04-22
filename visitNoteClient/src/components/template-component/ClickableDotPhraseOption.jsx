/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import { useState, useEffect } from "react";
import axios from "axios";
import {
  List,
  Input,
  Tooltip,
  Button,
  Modal,
  message,
  Space,
  Flex,
} from "antd";
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import { SearchOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import { Scrollbars } from "react-custom-scrollbars";
import Trash from "../../static/images/Delete.svg";

const { confirm } = Modal;

import { BASEURL } from "../../units/constant";

export const ClickableDotPhraseOption = (props) => {
  const {
    saveNewTemplate,
    createPopup,
    editDotPopup,
    expandedItem,
    templateType = "section",
    setRendered,
    filterBySearch,
    filteredList,
    templates,
    inputValue,
    editorValue,
    insertDotPhrase,
    setOpenDot,
  } = props;
  const [formState, setFormState] = useState({
    templateName: "",
    dotPhrase: "",
    dotPhraseTemplate: "",
  });

  const showDeleteConfirm = (templateDeleteId, templateType) => {
    const api = `${BASEURL}/dotphrase/${templateDeleteId}`;
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
      dotPhraseTemplate: editorValue.toString("markdown"),
    }));
  };

  const handleDotPhraseSave = async () => {
    try {
      await axios.post(`${BASEURL}/dotphrase`, formState);
      setFormState({
        templateName: "",
        dotPhrase: "",
      });
      setOpenDot(false);
      setTimeout(() => {
        message.success({
          content: <div className="message">Template Successfully Saved</div>,
          duration: 0.9,
        });
      }, 100);
    } catch (error) {
      console.error("Error saving dot phrase:", error);
    }
  };

  const menuItems = [
    {
      key: "1",
      content: "Save as a New Template",
      linkTo: "/",
    },
    {
      key: "2",
      content: "Insert Template",
      linkTo: "/",
      itemList: templates,
    },
    {
      key: "3",
      content: "Update Existing Template",
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
                    ? () => saveNewTemplate(index)
                    : item.itemList?.length > 0
                    ? () => createPopup(index)
                    : null
                }
              >
                {item.content}
                {index === 0 ? (
                  <FeatherIcon size={16} icon="plus" />
                ) : expandedItem === index ? (
                  <FeatherIcon size={16} icon="chevron-down" />
                ) : (
                  <FeatherIcon size={16} icon="chevron-right" />
                )}
              </Link>

              {index === 0 && expandedItem === index ? (
                <div className="templateList">
                  <div className="input-group" style={{ marginBottom: "10px" }}>
                    <Input
                      placeholder="Name of Template"
                      name="templateName"
                      value={formState.templateName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="input-group" style={{ marginBottom: "10px" }}>
                    <Input
                      placeholder="Dot Phrase (optional)"
                      name="dotPhrase"
                      value={formState.dotPhrase}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="input-group" style={{ textAlign: "end" }}>
                    <Space>
                      <Button htmlType="button" size="small">
                        Cancel
                      </Button>
                      <Button
                        onClick={handleDotPhraseSave}
                        type="primary"
                        size="small"
                        htmlType="submit"
                      >
                        Save
                      </Button>
                    </Space>
                  </div>
                </div>
              ) : null}

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
                                  onClick={() =>
                                    insertDotPhrase(
                                      item.dotPhraseTemplate,
                                      item._id
                                    )
                                  }
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      width: "100%",
                                    }}
                                  >
                                    <span
                                      style={{
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                      }}
                                    >
                                      {item.templateName}
                                    </span>
                                    <b>{item.dotPhrase}</b>
                                  </div>
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
                                    onClick={() =>
                                      showDeleteConfirm(item._id, templateType)
                                    }
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
                              <Link onClick={() => editDotPopup(index, item)}>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    width: "100%",
                                  }}
                                >
                                  <span
                                    style={{
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                    }}
                                  >
                                    {item.templateName}
                                  </span>
                                  <b>{item.dotPhrase}</b>
                                </div>
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
