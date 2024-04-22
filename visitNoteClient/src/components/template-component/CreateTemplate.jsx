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

export const CreateTemplate = (props) => {
  // eslint-disable-next-line react/prop-types
  const { handleCloseModal, category } = props;
  const [formData, setFormData] = useState({
    title: "",
    templateContent: RichTextEditor.createEmptyValue(),
  });
  const [confirmed, setConfirmed] = useState(false);

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

  const postTemplate = async (apiReqData) => {
    try {
      const response = await axios.post(
        `${BASEURL}/addTemplate/${category}`,
        apiReqData
      );
      return response;
    } catch (error) {
      message.error({
        content: (
          <div>
            some error occoured in saving the template -{" "}
            <b>{error.message || error}</b>
          </div>
        ),
        duration: 0.9,
      });
    }
  };

  const makeApiCall = async (apiPayload) => {
    try {
      apiCallAlreadyMadeRef.current = true;
      try {
        const response = await postTemplate(apiPayload);
        if (response.status === 201) {
          setTimeout(() => {
            message.success({
              content: (
                <div className="message">
                  <b>{formData.title}</b> Template Successfully Created
                </div>
              ),
              duration: 1,
            });
          }, 100);
        }
      } catch (error) {
        message.error({
          content: (
            <div className="message">
              <b>{error.message || error}</b>
            </div>
          ),
          duration: 0.9,
        });
      }
      setFormData({
        title: "",
        templateContent: RichTextEditor.createEmptyValue(),
      });
      handleCloseModal();
      setConfirmed(false);
      formRef.current.resetFields();
    } catch (error) {
      console.error("Error:", error);
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
          duration: 1,
        });
      });
  };

  const handleSave = async (e) => {
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
                            some error occoured - {error.message || error}
                          </div>
                        ),
                        duration: 1,
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
              onClick={handleSave}
            >
              {confirmed ? "Create Template" : "Confirm Template"}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </>
  );
};
