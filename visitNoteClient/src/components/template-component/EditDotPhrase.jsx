import { useEffect, useState, useRef } from "react";
import axios from "axios";
import RichTextEditor from "react-rte";
import { Button, Form, Input, Modal, message } from "antd";
import Icon1 from "../../static/images/Dictate.svg";
import Icon4 from "../../static/images/copy-07.svg";
import { MailBox } from "./style";
import { BASEURL } from "../../units/constant";
import { regexRuleSetOne } from "../../utils/regexRuleSetOne";
import { regexRuleSetTwo } from "../../utils/regexRuleSetTwo";
import { regexRuleSetThree } from "../../utils/regexRuleSetThree";

export const EditDotPhrase = (props) => {
  // eslint-disable-next-line react/prop-types
  const { close, open, edit } = props;
  const [formData, setFormData] = useState({
    templateName: edit.templateName,
    dotPhrase: edit.dotPhrase,
    dotPhraseTemplate: RichTextEditor.createValueFromString(
      edit.dotPhraseTemplate,
      "html"
    ),
  });
  const formRef = useRef();
  const apiCallAlreadyMadeRef = useRef(false);

  function hInputChange(e) {
    // setFormData({ ...formData, templateName: e.target.value });
    const { name, value } = e.target;
    console.log(name, value, "name, value");
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  async function hEditorChange(newValue) {
    console.log(newValue);

    setFormData((prevFormData) => ({
      ...prevFormData,
      dotPhraseTemplate: newValue,
    }));
  }

  const makeApiCall = async (apiPayload) => {
    try {
      apiCallAlreadyMadeRef.current = true;
      try {
        const response = await updateTemplate(apiPayload);
        if (response.status === 200) {
          setTimeout(() => {
            message.success({
              content: (
                <div className="message">
                  <b>{formData.templateName}</b> Template Successfully Updated
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
                <b>{formData.templateName}</b> Template Successfully Updated
              </div>
            ),
            duration: 0.9,
          });
        }, 100);
      }
      setFormData({
        templateName: "",
        dotPhrase: "",
        dotPhraseTemplate: RichTextEditor.createEmptyValue(),
      });
      close();
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

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await validateForm();
    } catch (error) {
      console.error("Form validation error:", error.message);
      return;
    }
    const apiReqData = {
      ...formData,
      dotPhraseTemplate: formData.dotPhraseTemplate.toString("markdown"),
    };
    makeApiCall(apiReqData);
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
      .patch(`${BASEURL}/dotphrase/${edit._id}`, apiReqData)
      .then((response) => {
        if (response.status === 200) {
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
    formRef.current.setFieldsValue({
      templateName: edit.templateName,
      dotPhrase: edit.dotPhrase,
    });
  }, [formRef, edit]);

  return (
    <>
      <Modal
        open={open}
        title={"Edit Dot Phrase"}
        onCancel={close}
        footer={null}
        width={700}
      >
        {formData.dotPhrase.length > 0 && (
          <Form autoComplete="off" ref={formRef}>
            <Form.Item
              name="templateName"
              rules={[
                { required: true, message: "Please enter the Template Name" },
              ]}
            >
              {console.log(formData, "formData")}
              <Input
                name="templateName"
                placeholder="Template Name"
                value={formData?.templateName}
                onChange={hInputChange}
              />
            </Form.Item>
            <Form.Item
              name="dotPhrase"
              rules={[
                { required: true, message: "Please enter the Template Name" },
              ]}
            >
              <Input
                name="dotPhrase"
                placeholder="Template Name"
                value={formData.dotPhrase}
                onChange={hInputChange}
              />
            </Form.Item>
            <Form.Item>
              <MailBox>
                <div className="body-editer">
                  <div className="group">
                    <RichTextEditor
                      placeholder="Placeholder Text"
                      value={formData.dotPhraseTemplate}
                      onChange={hEditorChange}
                      className="showEditorToolbar editorDotPr"
                    />
                  </div>
                </div>
                <div className="footer-editer">
                  <div className="footer-list">
                    <Button
                      type="text"
                      shape="circle"
                      icon={<img src={Icon1} />}
                    />
                    <Button
                      type="text"
                      shape="circle"
                      icon={<img src={Icon4} />}
                    />
                  </div>
                </div>
              </MailBox>
            </Form.Item>
            <Form.Item style={{ margin: 0 }}>
              <div className="submit-btns">
                <Button key="back" onClick={close}>
                  Cancel
                </Button>
                <Button
                  key="submit"
                  type="primary"
                  htmlType="submit"
                  onClick={handleUpdate}
                >
                  Update Template
                </Button>
              </div>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </>
  );
};
