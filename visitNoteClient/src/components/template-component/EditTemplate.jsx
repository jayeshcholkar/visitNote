import { useEffect, useState, useRef } from "react";
import axios from "axios";
import RichTextEditor from "react-rte";
import { Button, Form, Input, message } from "antd";
import Icon1 from "../../static/images/Dictate.svg";
import Icon4 from "../../static/images/copy-07.svg";
import { MailBox } from "./style";
import { BASEURL } from "../../units/constant";
import { regexRuleSetOne } from "../../utils/regexRuleSetOne";
import { regexRuleSetTwo } from "../../utils/regexRuleSetTwo";
import { regexRuleSetThree } from "../../utils/regexRuleSetThree";

export const EditTemplate = (props) => {
  // eslint-disable-next-line react/prop-types
  const { handleCloseModal, tempId, category } = props;
  const [confirmed, setConfirmed] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    templateContent: RichTextEditor.createEmptyValue(),
  });

  const formRef = useRef();
  const apiCallAlreadyMadeRef = useRef(false);

  function hInputChange(e) {
    if (confirmed) setConfirmed(false);
    setFormData({ ...formData, title: e.target.value });
  }

  async function hEditorChange(newValue) {
    if (confirmed) setConfirmed(false);
    setFormData((prevFormData) => ({
      ...prevFormData,
      templateContent: newValue,
    }));
  }

  const makeApiCall = async (apiPayload) => {
    try {
      apiCallAlreadyMadeRef.current = true;
      try {
        const response = await updateTemplate(apiPayload);
        if (response?.status === 201) {
          setTimeout(() => {
            message.success({
              content: (
                <div className="message">
                  <b>{formData.title}</b> Template Successfully Updated
                </div>
              ),
              duration: 0.9,
            });
          }, 100);
        }
      } catch (error) {
        alert(error.message);
        setTimeout(() => {
          message.error({
            content: (
              <div className="message">
                <b>{formData.title}</b> Template Successfully Updated
              </div>
            ),
            duration: 0.9,
          });
        }, 100);
      }
      setFormData({
        title: "",
        templateContent: RichTextEditor.createEmptyValue(),
      });
      handleCloseModal();
      setConfirmed(false);
      formRef.current.resetFields();
    } catch (error) {
      setTimeout(() => {
        message.error({
          content: <div className="message">{error.message || error}</div>,
          duration: 0.9,
        });
      }, 100);
    } finally {
      apiCallAlreadyMadeRef.current = false;
    }
  };

  const getHighlightHtml = () => {
    removeHighlightHtml()
      .then((res) => {
        let wrappedHTML = res;
        for (let i = 0; i < wrappedHTML.length; i++) {
          wrappedHTML = regexRuleSetOne(wrappedHTML);
          wrappedHTML = regexRuleSetTwo(wrappedHTML);
          wrappedHTML = regexRuleSetThree(wrappedHTML);
        }
        setFormData((prevFormData) => ({
          ...prevFormData,
          templateContent: RichTextEditor.createValueFromString(
            wrappedHTML,
            "html"
          ),
        }));
      })
      .catch((error) => {
        message.error({
          content: (
            <div className="message">
              some error occoured - <b>{error.message || error}</b>
            </div>
          ),
          duration: 0.9,
        });
      });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await validateForm();
    } catch (error) {
      console.error("Form validation error:", error.message);
      return;
    }
    if (!confirmed) {
      setConfirmed(true);
    } else if (confirmed) {
      const apiReqData = {
        ...formData,
        templateContent: formData.templateContent.toString("html"),
        uniqueMeta: {
          originalTemplate: true,
          parentTemplate: null,
        },
      };
      makeApiCall(apiReqData);
    }
  };

  const removeHighlightHtml = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let getBackContent = formData.templateContent.toString("html");
        getBackContent = getBackContent.replace(
          /<code>|<\/code>( )|<\/code>&nbsp;/g,
          ""
        );
        if (confirmed) {
          setFormData((prevFormData) => ({
            ...prevFormData,
            templateContent: RichTextEditor.createValueFromString(
              getBackContent,
              "html"
            ),
          }));
        }
        if (!getBackContent.match(/<code>|<\/code>( )|<\/code>&nbsp;/g))
          resolve(getBackContent);
        else reject("editor value still has <code></code> tags in it.");
      }, 200);
    });
  };

  const validateForm = async () => {
    try {
      await formRef.current.validateFields();
    } catch (error) {
      throw new Error("Form validation failed.");
    }
  };

  const getTemplate = async () => {
    axios
      .get(`${BASEURL}/getTemplate/${tempId}`)
      .then((response) => {
        if (response.status === 200) {
          let modifiedContent = response.data.template.templateContent;
          if (!response.data.template.uniqueMeta.originalTemplate) {
            modifiedContent = modifiedContent
              .replace(/<code>/g, "$&[")
              .replace(/<\/code>/g, "]$&")
              .replace(/<span>(.*?)<\/span>/g, "$1, ")
              .replace(
                /<span class="btn-editable-span active" data-text="(.*?)">(.*?)<\/span>/g,
                ""
              )
              .replace(/<span class="btn-editable-span">(.*?)<\/span>/g, "$1,")
              .replace(
                /<span class="btn-editable-span active">(.*?)<\/span>/g,
                "$1,"
              )
              .replace(
                /<span class="multi-select-checkbox-container">(.*?)<\/span>/g,
                "$1"
              )
              .replace(
                /<button class="dropdown-btn selective">(.*?)<\/button>/g,
                ""
              )
              .replace(/<button class="dropdown-btn">(.*?)<\/button>/g, "")
              .replace(
                /<span class="multi-select-dropdown selective">(.*?)<\/span>/g,
                "$1"
              )
              .replace(
                /<span class="multi-select-dropdown">(.*?)<\/span>/g,
                "$1"
              )
              .replace(
                /<label class="select-dropdown-label">(.*?)<\/label>/g,
                "$1"
              )
              .replace(
                /<input type="checkbox" value="(.*?)" class="active">/g,
                ""
              )
              .replace(/<input type="checkbox" value="(.*?)">/g, "")

              .replace(/( ,])|(,])|(.,])|( .,])|(, ])/g, "]")
              .replace(/\[\s/g, "[")
              .replace(/(\s,| ,)/, ",");
          }
          setFormData((prevFormData) => ({
            ...prevFormData,
            title: response?.data.template.title,
            templateContent: RichTextEditor.createValueFromString(
              modifiedContent,
              "html"
            ),
          }));
          formRef.current.setFieldsValue({
            title: response?.data?.template?.title || "",
          });
        }
      })
      .catch((error) => {
        setTimeout(() => {
          message.success({
            content: <div className="message">{error.message || error}</div>,
            duration: 0.9,
          });
        }, 100);
      });
  };

  const updateTemplate = (apiReqData) => {
    return axios
      .patch(`${BASEURL}/editSectionTemplate/${category}/${tempId}`, apiReqData)
      .then((response) => {
        if (response.status === 201) {
          return response;
        }
      })
      .catch((error) => {
        setTimeout(() => {
          message.error({
            content: <div className="message">{error.message || error}</div>,
            duration: 0.9,
          });
        }, 100);
      });
  };

  useEffect(() => {
    if (tempId) getTemplate();
  }, [tempId]);

  useEffect(() => {
    if (confirmed) getHighlightHtml();
  }, [confirmed]);

  return (
    <>
      <Form autoComplete="off" ref={formRef}>
        <Form.Item
          name="title"
          rules={[
            { required: true, message: "Please enter the Template Name" },
          ]}
        >
          <Input
            placeholder="Template Name"
            value={formData.title}
            onChange={hInputChange}
          />
        </Form.Item>
        <Form.Item>
          <MailBox>
            <div className="body-editer">
              <div className="group">
                <RichTextEditor
                  placeholder="Placeholder Text"
                  value={formData.templateContent}
                  onChange={hEditorChange}
                  className="showEditorToolbar"
                />
              </div>
            </div>
            <div className="footer-editer">
              <div className="footer-list">
                <Button type="text" shape="circle" icon={<img src={Icon1} />} />
                <Button type="text" shape="circle" icon={<img src={Icon4} />} />
              </div>
            </div>
          </MailBox>
        </Form.Item>
        <Form.Item style={{ margin: 0 }}>
          <div className="submit-btns">
            {confirmed ? (
              <Button
                key="back"
                onClick={() => {
                  removeHighlightHtml()
                    .then(() => {
                      if (confirmed) setConfirmed(false);
                    })
                    .catch((error) => {
                      message.error({
                        content: (
                          <div className="message">
                            <b>{error.message || error}</b>
                          </div>
                        ),
                        duration: 0.9,
                      });
                    });
                }}
              >
                Go Back
              </Button>
            ) : (
              <Button key="back" onClick={handleCloseModal}>
                Cancel
              </Button>
            )}
            <Button
              key="submit"
              type="primary"
              htmlType="submit"
              onClick={handleUpdate}
            >
              {confirmed ? "Update Template" : "Confirm Template"}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </>
  );
};
