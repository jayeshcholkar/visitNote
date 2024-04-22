// eslint-disable-next-line no-unused-vars
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import RichTextEditor from "react-rte";
import { Button, Form, Input, message } from "antd";
import Icon1 from "../../static/images/Dictate.svg";
import Icon4 from "../../static/images/copy-07.svg";
import { MailBox } from "./style";
import { regexRuleSetOne } from "../../utils/regexRuleSetOne";
import { regexRuleSetTwo } from "../../utils/regexRuleSetTwo";
import { regexRuleSetThree } from "../../utils/regexRuleSetThree";
import { BASEURL } from "../../units/constant";

const templateItem = [
  { id: "Subjective", title: "Subjective" },
  { id: "Objective", title: "Objective" },
  { id: "Assessment", title: "Assessment" },
  { id: "Plan", title: "Plan" },
];

export const EditMasterTemplate = (props) => {
  // eslint-disable-next-line react/prop-types
  const { handleCloseModal, tempId } = props;
  const [confirmed, setConfirmed] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    sections: {
      Subjective: RichTextEditor.createEmptyValue(),
      Objective: RichTextEditor.createEmptyValue(),
      Assessment: RichTextEditor.createEmptyValue(),
      Plan: RichTextEditor.createEmptyValue(),
    },
  });

  const formRef = useRef();
  
  const hInputChange = (e) => {
    if (confirmed) setConfirmed(false);
    setFormData(prevFormData => ({
      ...prevFormData,
      title: e.target.value 
    }));
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
    .catch(error=>{
      message.error({
        content:(
          <div>
            some error occoured - {error.message | error}
          </div>
        ),
        duration: 0.9
      })
    })
  };

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

  const getTemplate = async () => {
    axios
      .get(`${BASEURL}/getMasterTemplate/${tempId}`)
      .then((response) => {
        if (response.status === 200) {
          let modifiedContent = response.data.sections;
          Object.keys(response.data.sections).forEach(key =>{
            if (!response.data.uniqueMeta.originalTemplate) {
              modifiedContent = {
                ...modifiedContent,
                [key]: modifiedContent[key].replace(/<code>/g, "$&[")
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
                .replace(/(\s,| ,)/, ",")
                ,}
            }
          });
          if (!response.data.uniqueMeta.originalTemplate) {
            console.log(modifiedContent)
          }
          setFormData(prevFormData=>({
            ...prevFormData,
            title: response.data.title,
            sections: {
              ...prevFormData?.sections,
              Subjective: RichTextEditor.createValueFromString(modifiedContent.Subjective, "html"),
              Objective: RichTextEditor.createValueFromString(modifiedContent.Objective, "html"),
              Assessment: RichTextEditor.createValueFromString(modifiedContent.Assessment, "html"),
              Plan: RichTextEditor.createValueFromString(modifiedContent.Plan, "html"),
            }
          }));
          
          formRef.current.setFieldsValue({
            title: response?.data?.title,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updateTemplate = (apiReqData) => {
    return axios
      .patch(`${BASEURL}/editMasterTemplate/${tempId}`, apiReqData)
      .then((response) => {
        if (response.status === 201) {
          return response
        }
      })
      .catch((error) => {
        setTimeout(() => {
          message.error({
            content: (
              <div className="message">
                {error.message}
              </div>
            ),
            duration: 0.8,
          });
        }, 100);
      });
  };

  const hEditorChange = (newValue, id) => {
    if (confirmed) setConfirmed(false);
    setFormData(prevFormData=>({
      ...prevFormData,
      sections: {
        ...prevFormData.sections,
        [id]: newValue
      }
    }))
  };

  const validateForm = async () => {
    try {
      await formRef.current.validateFields();
    } catch (error) {
      throw new Error("Form validation failed.");
    }
  };

  const parseApiReqData = () =>{
    return new Promise((resolve)=>{
      let apiReqData = {...formData};
      Object.keys(formData.sections).forEach(id=>{
        apiReqData = {
          ...apiReqData,
          sections:{
            ...apiReqData.sections,
            [id]: formData.sections?.[id].toString("html"),
          },
          uniqueMeta:{
            originalTemplate: true,
            parentTemplate: null,
          }
        }
      });
      if (Object.keys(apiReqData).length) resolve(apiReqData)
    })
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await validateForm();
    } catch (error) {
      setTimeout(() => {
        message.error({
          content: (
            <div className="message">
              Form Validation Error: {error.message | error}
            </div>
          ),
          duration: 0.8,
        });
      }, 100);
      return;
    }
    if (!confirmed){
      setConfirmed(true);
      getHighlightHtml();
    }
    else if (confirmed) {
      try{
        const apiReqData = await parseApiReqData();
        if (Object.keys(apiReqData).length) { 
          const updateResponse = await updateTemplate(apiReqData);
          if (updateResponse.status === 201) {
            setTimeout(() => {
              message.success({
                content: (
                  <div className="message">
                    <b>{formData.title}</b> Template Successfully Updated
                  </div>
                ),
                duration: 0.5,
              });
            }, 100);
            setFormData({
              title: "",
              sections: {
               Subjective:  RichTextEditor.createEmptyValue(),
               Objective: RichTextEditor.createEmptyValue(),
               Assessment: RichTextEditor.createEmptyValue(),
               Plan: RichTextEditor.createEmptyValue(),
              },
            });
            formRef.current.resetFields();
            setConfirmed(false);
            handleCloseModal();
          }}
        
      }
      catch(err){
        setTimeout(() => {
          message.error({
            content: (
              <div className="message">
                Some Error Occoured in updating the template <b>{formData.title}</b> 
              </div>
            ),
            duration: 0.8,
          });
        }, 100);
      }
    }
  };

  useEffect(() => {
    getTemplate();
  }, [tempId]);

  useEffect(() => {
    if (confirmed) getHighlightHtml();
  }, [confirmed]);

  return (
    <Form autoComplete="off" ref={formRef} initialValues={formData}>
      <Form.Item
        name="title"
        rules={[{ required: true, message: "Please enter the Template Name" }]}
      >
        <Input
          placeholder="Template Name"
          value={formData.title}
          onChange={hInputChange}
        />
      </Form.Item>
      <Form.Item>
        <div className="temp-items">
          {templateItem.map((item) => {
            return (
              <div className="temp-item" key={item.id}>
                <h3>{item.id}</h3>
                <MailBox>
                  <div className="body-editer">
                    <div className="group">
                      <RichTextEditor
                        placeholder="Placeholder Text"
                        value={formData.sections[item.id]}
                        onChange={(newValue) => hEditorChange(newValue, item.id)}
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
            );
          })}
        </div>
      </Form.Item>
      <Form.Item style={{ margin: 0 }}>
        <div className="submit-btns">
            {confirmed ? (
              <Button key="back" onClick={()=>{
                removeHighlightHtml()
                .then(()=>{
                  if (confirmed) setConfirmed(false);
                })
                .catch(error=>{
                  message.error({
                    content:(
                      <div>
                        some error occoured - {error.message | error}
                      </div>
                    ),
                    duration:0.9
                  })
                })
              }}>
                Go Back
              </Button>
            ) : (
              <Button key="back" onClick={handleCloseModal}>
                Cancel
              </Button>
            )}
          <Button key="submit" type="primary" onClick={handleUpdate}>
            {confirmed ? "Update Template" : "Confirm Updates"}
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};
