/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
import { useState, useEffect, useRef } from "react";
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

const templateItem = [
  { id: "Subjective", title: "Subjective" },
  { id: "Objective", title: "Objective" },
  { id: "Assessment", title: "Assessment" },
  { id: "Plan", title: "Plan" },
];

export const CreateMasterTemplate = (props) => {
  // eslint-disable-next-line react/prop-types
  const { handleCloseModal } = props;
  const [formData, setFormData] = useState({
    title: "",
    sections: {
      Subjective: RichTextEditor.createEmptyValue(),
      Objective: RichTextEditor.createEmptyValue(),
      Assessment: RichTextEditor.createEmptyValue(),
      Plan: RichTextEditor.createEmptyValue(),
    },
  });
  const apiCallAlreadyMadeRef = useRef(false);
  const [confirmed, setConfirmed] = useState(false);
  
  const hInputChange = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      title: e.target.value,
    }));
    setConfirmed(false);
  };

  const hEditorChange = (newValue, id) => {
    if (confirmed) setConfirmed(false);
    setFormData((prevFormData) => ({
      ...prevFormData,
      sections: {
        ...prevFormData.sections,
        [id]: newValue,
      },
    }));
  };

  const postTemplate = async (formData2) => {
    try {
      const response = await axios.post(
        `${BASEURL}/addMasterTemplate`,
        formData2
      );
      return response;
    } catch (error) {
      message.error({
        content: (
          <div>
            {"Error in creating Master template - "}<b>{error.message || error}</b>
          </div>
        ),
        duration: 0.9
      })
    }
  };

  const getHighlightHtml = () => {
    removeHighlightHtml()
    .then((contentWithNoCodeTags)=>{
      Object.keys(formData.sections).forEach((key) => {
        let wrappedHTML = contentWithNoCodeTags[key];
        for (let i = 0; i< wrappedHTML.length; i++){
          wrappedHTML = regexRuleSetOne(wrappedHTML);
          wrappedHTML = regexRuleSetTwo(wrappedHTML);
          wrappedHTML = regexRuleSetThree(wrappedHTML);
          wrappedHTML = regexRuleSetOne(wrappedHTML);
          wrappedHTML = regexRuleSetThree(wrappedHTML);
          wrappedHTML = regexRuleSetOne(wrappedHTML);
        }
        setFormData((prevFormData) => ({
          ...prevFormData,
          sections: {
            ...prevFormData.sections,
            [key]: RichTextEditor.createValueFromString(wrappedHTML, "html"),
          },
        }));
      });
    })
    .catch((error)=>{
      message.error({
        content:(
          <div className="message">
              some error occoured - <b>{error.message || error}</b>
          </div>
        ),
        duration:0.9
      })
    })
  };

  const makeApiCall = async (apiReqData) => {
    try {
      apiCallAlreadyMadeRef.current = true;
      try {
        const response = await postTemplate(apiReqData);
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
        console.log("Error", error);
      }
      handleCloseModal();
      setConfirmed(false);
      formRef.current.resetFields();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      apiCallAlreadyMadeRef.current = false;
    }
  };
  
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await validateForm();
    } catch (error) {
      message.error({
        content: (
          <div>
            <b>
              {"Missing Title for the template"}
            </b>
          </div>
          ),
          duration: 0.6
      });
      return;
    }
    if (!confirmed) {
      setConfirmed(true);
      getHighlightHtml();
    } else {
      try {
        const res = await updateHighlightStateAndFormData();
        console.log(res);
        if (res) makeApiCall(res.apiReqData);
      } catch (error) {
        alert(error);
      }
    }
  };

  function updateHighlightStateAndFormData() {
    return new Promise((resolve, reject) => {
      const apiReqData = {
        title: formData.title,
      };
      Object.keys(formData.sections).forEach((id) => {
        apiReqData.sections = {
          ...apiReqData.sections,
          [id]: formData.sections?.[id].toString("html"),
        };
      });
      if (Object.keys(apiReqData).length) resolve({ apiReqData });
      else reject("Empty Req Data");
    });
  }

  const removeHighlightHtml = () => {
    return new Promise((resolve)=>{
      setTimeout(()=>{
        let getBackContent = formData.sections;
        Object.keys(getBackContent).forEach((key) => {
          getBackContent = {
            ...getBackContent,
            [key]: formData.sections[key]?.toString("html").replace(/<code>|<\/code>( )|<\/code>&nbsp;/g, "")
          }
          if (confirmed){
            setFormData((prevFormData) => ({
              ...prevFormData,
              sections: {
                ...prevFormData.sections,
                [key]: RichTextEditor.createValueFromString(getBackContent[key], "html"),
              },
            }));
          }
        });
        resolve(getBackContent);
      }, 200)
    })
  };

  const validateForm = async () => {
    try {
      await formRef.current.validateFields();
    } catch (error) {
      throw new Error("Form validation failed.");
    }
  };

  const formRef = useRef();

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
          <div className="temp-items">
            {templateItem.map((item) => (
              <div className="temp-item" key={item.id}>
                <h3>{item.title}</h3>
                <MailBox>
                  <div className="body-editer">
                    <div className="group">
                      <RichTextEditor
                        placeholder="Placeholder Text"
                        value={formData.sections?.[item.id]}
                        onChange={(newValue) =>
                          hEditorChange(newValue, item.id)
                        }
                        className="showEditorToolbar"
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
              </div>
            ))}
          </div>
        </Form.Item>
        <Form.Item style={{ margin: 0 }}>
          <div className="submit-btns">
            {confirmed ? (
              <Button key="back" onClick={()=>{
                removeHighlightHtml()
                .then(()=>{
                  if (confirmed) setConfirmed(false)
                })
                .catch((error)=>{
                  message.error({
                    content: (
                      <div className="message">
                        some error occoured - {error.message | error}
                      </div>
                    ),
                    duration: 0.9
                  })
                });
                }}>
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
