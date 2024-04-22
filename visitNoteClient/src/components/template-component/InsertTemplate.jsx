/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { Button, message, Modal, Form, Input } from "antd";
import { BASEURL } from "../../units/constant";
import { connect } from "react-redux";
import { templateInsertion } from "../../redux/actions/exampleActions";
import {
  paintRegerated,
  paintOriginal,
} from "../../utils/rendering/paintSectionTemplate";
import { hideDropDown } from "../../utils/doms/hideDropDowns";

const InsertTemplateComponent = (props) => {
  const { handleCloseModal, tempId, dispatchFinalTemplate } = props;
  const fetchRef = useRef(null);
  const [fetchedTemplate, setFetchedTemplate] = useState();
  const [formData, setFormData] = useState({
    title: "",
    templateContent: "<></>",
    uniqueMeta: {
      originalTemplate: false,
      parentTemplate: null,
    },
  });

  const [finalTemp, setFinalTemp] = useState("<></>");
  const formRef = useRef();
  const apiCallAlreadyMadeRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const parseAndUpdateHTML = (htmlString) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlString;
    const codeElements = tempDiv.querySelectorAll("code");
    codeElements.forEach((codeElement) => {
      const spanElements = codeElement.querySelectorAll(".btn-editable-span");
      const activeSpans = Array.from(spanElements).filter((span) =>
        span.classList.contains("active")
      );
      spanElements.forEach((span) => span.remove());
      activeSpans.forEach((activeSpan) => codeElement.appendChild(activeSpan));
    });
    const dropDownDiv = tempDiv.querySelectorAll(
      ".multi-select-checkbox-container"
    );
    dropDownDiv.forEach((div) => div.remove());
    return tempDiv.innerHTML;
  };

  const getTemplate = async () => {
    try {
      const response = await axios.get(`${BASEURL}/getTemplate/${tempId}`);
      if (response.status === 200) {
        setFetchedTemplate(response.data?.template);
        if (!response?.data?.template?.uniqueMeta.originalTemplate) {
          updateFinalTemp(response?.data?.template?.templateContent, false);
        }
      } else if (!response || response.status !== 200)
        throw Error("Error in fetching Template");
    } catch (error) {
      message.error({
        content: (
          <div>
            some error occoured in fetching the template -{" "}
            <b>{error.message | error}</b>
          </div>
        ),
        duration: 0.9,
      });
    }
  };

  const updateFinalTemp = (htmlString, copyTemplateChanges = true) => {
    const updatedHtml = parseAndUpdateHTML(htmlString);
    const modifiedHtml = updatedHtml
      .replace(/<code>|<\/code>/g, "")
      .replace(
        /<span class="btn-editable-span active"(?: data-text=".*?")?>/g,
        ""
      )
      .replace(/<\/span>/g, ",")
      .replace(/(\s,)/g, ",")
      .replace(/(\s\s)/g, " ")
      .replace(/(,,)/g, ",");
    if (copyTemplateChanges) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        templateContent: htmlString,
        uniqueMeta: {
          ...prevFormData.uniqueMeta,
          originalTemplate: false,
          parentTemplate: {
            ...(prevFormData.uniqueMeta.parentTemplate
              ? { ...prevFormData.uniqueMeta.parentTemplate }
              : {}),
            templateId: tempId,
            title: fetchedTemplate.title,
            category: {
              ...fetchedTemplate.category,
            },
          },
        },
      }));
    }
    setFinalTemp(modifiedHtml);
  };

  const postTemplate = async (apiReqData) => {
    try {
      const response = await axios.post(
        `${BASEURL}/addTemplate/${fetchedTemplate.category.categoryName}`,
        apiReqData
      );
      return response;
    } catch (error) {
      message.error({
        content: (
          <div>
            {"some error occoured in saving the template - "}
            <b>{error.message || error}</b>
          </div>
        ),
        duration: 0.9,
      });
    }
  };

  const handleSaveTemp = async (e) => {
    e.preventDefault();
    try {
      await validateForm();
    } catch (error) {
      message.error({
        content: (
          <div>
            {"Template Title cannot be Empty"} - <b>{error.message || error}</b>
          </div>
        ),
      });
      return;
    }
    makeApiCall(formData);
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
                  <b>{formData.title}</b> Saved as new Template
                </div>
              ),
              duration: 1,
            });
          }, 100);
          closeModal();
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
        templateContent: "",
      });
      formRef.current.resetFields();
    } catch (error) {
      message.error({
        content: (
          <div>
            some error occoured in saving the template -{" "}
            <b>{error.message | error}</b>
          </div>
        ),
        duration: 0.9,
      });
    } finally {
      apiCallAlreadyMadeRef.current = false;
    }
  };

  const validateForm = async () => {
    try {
      await formRef.current.validateFields();
    } catch (error) {
      throw new Error("Form validation failed.");
    }
  };

  const hSubmit = () => {
    dispatchFinalTemplate({
      _id: fetchedTemplate?.category?.categoryName,
      payload: finalTemp,
    });
    handleCloseModal();
    setTimeout(() => {
      message.success({
        content: (
          <div className="message">
            <b>{fetchedTemplate?.title}</b> Template Insert Successfully
          </div>
        ),
        duration: 1,
      });
    }, 100);
  };

  useEffect(() => {
    getTemplate();
  }, [tempId]);

  useEffect(() => {
    if (fetchRef.current) {
      fetchRef.current.innerHTML = fetchedTemplate
        ? fetchedTemplate.templateContent
        : "";
      const codeElement = fetchRef.current.querySelectorAll("code");
      if (fetchedTemplate.uniqueMeta.originalTemplate) {
        paintOriginal(codeElement, updateFinalTemp);
      } else if (
        !fetchedTemplate.uniqueMeta.originalTemplate &&
        fetchedTemplate.uniqueMeta.parentTemplate
      ) {
        paintRegerated(codeElement, updateFinalTemp);
      }
    }
  }, [fetchRef, tempId, fetchedTemplate]);

  useEffect(() => {
    hideDropDown();
  }, [document, fetchRef]);
  return (
    <div className="body-editer">
      <div className="group">
        <div className="editer-txt temp-insert">
          <h3> {fetchedTemplate ? fetchedTemplate.title : null}</h3>
          <div className="temp-items">
            <div className="temp-item">
              {fetchedTemplate ? <div ref={fetchRef} /> : null}
            </div>
          </div>
        </div>
      </div>
      <div className="submit-btns">
        <Button key="save" onClick={showModal}>
          Save Template
        </Button>
        <Button
          key="submit"
          type="primary"
          onClick={hSubmit}
          disabled={finalTemp === "<></>"}
        >
          Insert Template
        </Button>
      </div>
      {isModalOpen ? (
        <Modal
          open={isModalOpen}
          title={"Create Template"}
          onCancel={closeModal}
          footer={null}
        >
          <div>
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
                  onChange={(e) =>
                    setFormData((prevFormData) => ({
                      ...prevFormData,
                      title: e.target.value,
                    }))
                  }
                />
              </Form.Item>
              <Form.Item style={{ margin: 0 }}>
                <div className="submit-btns">
                  <Button key="back" onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button
                    key="submit"
                    type="primary"
                    htmlType="submit"
                    onClick={handleSaveTemp}
                  >
                    Create Template
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </div>
        </Modal>
      ) : null}
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  dispatchFinalTemplate: (data) => dispatch(templateInsertion(data)),
});
export const InsertTemplate = connect(
  null,
  mapDispatchToProps
)(InsertTemplateComponent);
