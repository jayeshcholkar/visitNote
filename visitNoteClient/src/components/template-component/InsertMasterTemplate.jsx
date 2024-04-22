/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { Button, message, Modal, Form, Input } from "antd";
import { BASEURL } from "../../units/constant";
import { connect } from "react-redux";
import { masterTemplateInsertion } from "../../redux/actions/exampleActions";
import {
  paintOriginal,
  paintRegerated,
} from "../../utils/rendering/paintMasterTemplate";
import { hideDropDown } from "../../utils/doms/hideDropDowns";
const templateItem = [
  { id: "Subjective", title: "Subjective" },
  { id: "Objective", title: "Objective" },
  { id: "Assessment", title: "Assessment" },
  { id: "Plan", title: "Plan" },
];

const InsertMasterTemplateComponent = (props) => {
  // eslint-disable-next-line react/prop-types
  const { handleCloseModal, tempId, dispatchFinalTemplate, filteredList } =
    props;
  const formRef = useRef(null);
  const fetchRef = useRef(null);
  const apiCallAlreadyMadeRef = useRef(false);
  const [fetchedTemplate, setFetchedTemplate] = useState([]);
  const [finalTemp, setFinalTemp] = useState("<></>");
  const [formData, setFormData] = useState({
    title: "",
    sections: {
      Subjective: "<></>",
      Objective: "<></>",
      Assessment: "<></>",
      Plan: "<></>",
    },
    uniqueMeta: {
      originalTemplate: true,
      parentTemplate: null,
    },
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const validateForm = async () => {
    try {
      await formRef.current.validateFields();
    } catch (error) {
      throw new Error("Form validation failed.");
    }
  };
  const postTemplate = async (apiReqData) => {
    try {
      const response = await axios.post(
        `${BASEURL}/addMasterTemplate`,
        apiReqData
      );

      return response;
    } catch (error) {
      message.error({
        content: (
          <div>
            {"Error in adding template"} - <b>{error.message || error}</b>
          </div>
        ),
        duration: 0.8,
      });
    }
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
          closeModal();
        }
      } catch (error) {
        message.error({
          content: (
            <div>
              {"Error in Saving Master Template"} -{" "}
              <b>{error.message || error}</b>
            </div>
          ),
          duration: 0.9,
        });
      }
      formRef.current.resetFields();
    } catch (error) {
      message.error({
        content: (
          <div>
            {"some error occoured - "}
            <b>{error.message || error}</b>
          </div>
        ),
        duration: 0.9,
      });
    } finally {
      apiCallAlreadyMadeRef.current = false;
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
            form validation error - <b>{error.message | error}</b>
          </div>
        ),
        duration: 0.5,
      });
      return;
    }
    makeApiCall(formData);
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

  function transformSections(htmlString) {
    let apiReqData = { sections: formData.sections };
    return new Promise((res, rej) => {
      const categoriesAllowed = [
        "Subjective",
        "Objective",
        "Assessment",
        "Plan",
      ];
      const container = document.createElement("div");
      container.innerHTML = htmlString;
      const contentDiv = container.querySelector("div");
      const sectionHeading = contentDiv.querySelectorAll("h3");
      for (let i = 0; i < sectionHeading.length; i++) {
        if (categoriesAllowed.includes(sectionHeading[i].innerHTML.trim())) {
          apiReqData = {
            ...apiReqData,
            sections: {
              ...apiReqData.sections,
              [`${sectionHeading[i].innerHTML}`]:
                sectionHeading[i].nextElementSibling.innerHTML.toString("html"),
            },
          };
        }
      }
      if (Object.keys(apiReqData.sections).length) res(apiReqData);
      else rej("Error in transforming sections for Master template");
    });
  }

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
      .replace(/(\s\s)/g, " ");

    transformSections(htmlString)
      .then((res) => {
        if (Object.keys(res.sections).length) {
          if (copyTemplateChanges) {
            Object.keys(res.sections).forEach((key) => {
              setFormData((prevFormData) => ({
                ...prevFormData,
                sections: {
                  ...prevFormData.sections,
                  [key]: res.sections?.[key],
                },
                uniqueMeta: {
                  ...prevFormData.uniqueMeta,
                  originalTemplate: false,
                  parentTemplate: {
                    ...(prevFormData.uniqueMeta.parentTemplate
                      ? { ...prevFormData.uniqueMeta.parentTemplate }
                      : {}),
                    templateId: fetchedTemplate._id,
                    title: fetchedTemplate.title,
                  },
                },
              }));
            });
          }
        }
      })
      .catch((error) => {
        message.error({
          content: (
            <div>
              some error occoured in updating templates -{" "}
              <b>{error.messaage || error}</b>
            </div>
          ),
          duration: 0.8,
        });
      })
      .finally(() => setFinalTemp(modifiedHtml));
  };

  const getTemplate = async () => {
    axios
      .get(`${BASEURL}/getMasterTemplate/${tempId}`)
      .then((response) => {
        if (response.status === 200) {
          setFetchedTemplate(response.data);
          if (!response.data.uniqueMeta.originalTemplate) {
            let wrappedDiv = document.createElement("div");
            let tempDiv = document.createElement("div");
            wrappedDiv.appendChild(tempDiv);

            templateItem.forEach((item) => {
              tempDiv.innerHTML +=
                `<h3>${item.id}</h3>
                   <div className="temp-cont">` +
                response.data?.sections?.[item.id] +
                `</div>`;
            });
            updateFinalTemp(wrappedDiv.innerHTML, true);
          }
        } else throw Error("Some Error Occoured in fetching template");
      })
      .catch((error) => {
        message.error({
          content: (
            <div>
              Error in Fetching Master template -{" "}
              <b>{error.message || error}</b>
            </div>
          ),
          duration: 0.9,
        });
      });
  };

  useEffect(() => {
    getTemplate();
  }, [tempId]);

  const updateTemplateReference = () => {
    templateItem.forEach((item) => {
      fetchRef.current.innerHTML +=
        `<h3>${item.id}</h3>
         <div className="temp-cont">` +
        fetchedTemplate?.sections?.[item.id] +
        `</div>`;
    });
    const codeElement = fetchRef.current.querySelectorAll("code");
    if (fetchedTemplate?.uniqueMeta?.originalTemplate) {
      paintOriginal(codeElement, updateFinalTemp);
    } else if (
      !fetchedTemplate?.uniqueMeta?.originalTemplate &&
      Object.keys(fetchedTemplate?.uniqueMeta?.parentTemplate).length
    ) {
      paintRegerated(codeElement, updateFinalTemp);
    }
  };

  useEffect(() => {
    if (
      fetchRef.current &&
      Object.keys(fetchedTemplate?.sections || {}).length
    ) {
      updateTemplateReference();
    }
    return () => {
      if (fetchRef.current) fetchRef.current.innerHTML = null;
    };
  }, [fetchedTemplate]);

  const hSubmit = () => {
    const finalTemplate = {};
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = finalTemp;
    tempDiv.querySelectorAll("h3").forEach((section) => {
      const sectionTitle = section.textContent.trim();
      if (templateItem.some((item) => item.id === sectionTitle)) {
        const sectionContent = section.nextElementSibling.innerHTML;
        finalTemplate[sectionTitle] = { templateData: sectionContent };
      }
    });
    dispatchFinalTemplate({
      payload: finalTemplate,
    });
    handleCloseModal();
    setTimeout(() => {
      message.success({
        content: (
          <div className="message">
            <b>{fetchedTemplate.title}</b> Template Insert Successfully
          </div>
        ),
        duration: 0.9,
      });
    }, 100);
  };

  useEffect(() => {
    hideDropDown();
  }, [document, fetchRef]);

  return (
    <div className="body-editer">
      <div className="group">
        <div className="editer-txt temp-insert">
          <h3>
            Master Template -{" "}
            <span>{fetchedTemplate ? fetchedTemplate.title : null}</span>
          </h3>
          <div className="temp-items">
            {Object.keys(fetchedTemplate?.sections || {}).length && (
              <div className="temp-item">
                <div ref={fetchRef} />
              </div>
            )}
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
  dispatchFinalTemplate: (data) => dispatch(masterTemplateInsertion(data)),
});
export const InsertMasterTemplate = connect(
  null,
  mapDispatchToProps
)(InsertMasterTemplateComponent);
