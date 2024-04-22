/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { Button, message } from "antd";
import { BASEURL } from "../../units/constant";
import { connect } from "react-redux";
import { masterTemplateInsertion } from "../../redux/actions/exampleActions";

// eslint-disable-next-line react/display-name

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

  const fetchRef = useRef(null);
  const [getTemp, setGetTemp] = useState([]);
  const [finalTemp, setFinalTemp] = useState("<></>");

  /*
   ***********************************************************************************
   */

  const updateFinalTemp = (htmlString) => {
    const updatedHtml = parseAndUpdateHTML(htmlString);

    const modifiedHtml = updatedHtml
      /* .replace(/<code>/g, "")
      .replace(/<\/code>/g, "")
      .replace(/<span class="btn-editable-span active">/g, "")
      .replace(/<\/span>/g, ""); */
      .replace(/<code>|<\/code>/g, "")
      .replace(/<span class="btn-editable-span active">/g, "")
      .replace(/<\/span>/g, ",");

    setFinalTemp(modifiedHtml);
  };

  const parseAndUpdateHTML = (htmlString) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlString;
    const codeElements = tempDiv.querySelectorAll("code");
    codeElements.forEach((codeElement) => {
      const spanElements = codeElement.querySelectorAll(
        "span.btn-editable-span"
      );
      const activeSpans = Array.from(spanElements).filter((span) =>
        span.classList.contains("active")
      );
      spanElements.forEach((span) => span.remove());
      activeSpans.forEach((activeSpan) => codeElement.appendChild(activeSpan));
    });

    return tempDiv.innerHTML;
  };

  /*
   ***********************************************************************************
   */

  const getTemplate = async () => {
    axios
      .get(`${BASEURL}/getMasterTemplate/${tempId}`)
      .then((response) => {
        setGetTemp(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getTemplate();
  }, [tempId]);

  const handleButtonTextToggle = (e) => {
    // const spanElement = e?.target;
    // spanElement.classList.toggle("active");
    // const codeTag = e.target.parentNode;
    // const paragraphTag = codeTag.parentNode;
    // const sectionDocument = paragraphTag.parentNode;
    // const mainDocumentDiv = sectionDocument.parentNode;

    handleButtonToggle(
      e.target,
      e.target.parentNode.parentNode.parentNode.parentNode
      // e.target.parentNode.parentNode.innerHTML
    );

    // console.log();
    // updateFinalTemp(mainDocumentDiv.innerHTML);
  };

  const handleButtonToggle = (target, mainDocumentDiv) => {
    target.classList.toggle("active");
    updateFinalTemp(mainDocumentDiv.innerHTML);
    // updateFinalTemp(mainDocumentDiv);
  };

  const getBracketText = (elementsWithClass) => {
    for (let i = 0; i < elementsWithClass.length; i++) {
      const stringForButtons = elementsWithClass[i].innerHTML;
      const stringWithoutBrackets = stringForButtons.slice(1, -1);
      const words = stringWithoutBrackets.replace(/\[|\]/g, " ").split(",");
      const filteredWords = words.filter(
        (word) => word.toLowerCase() !== "and"
      );
      // .map((fw) => {
      //   return fw.trim();
      // });
      elementsWithClass[i].innerHTML = "";

      let spanCounter = 0;
      let dropdownValues = [];
      let appendedOptions = new Set();

      for (let j = 0; j < filteredWords.length; j++) {
        const spanElement = document.createElement("span");
        spanElement.className = "btn-editable-span";
        spanElement.innerHTML = " " + filteredWords[j] + " ";
        spanElement.name = filteredWords[j];
        spanElement.addEventListener("click", handleButtonTextToggle);
        elementsWithClass[i].append(spanElement);
      }

      if (dropdownValues.length > 0) {
        const checkboxContainer = document.createElement("span");
        checkboxContainer.className = "multi-select-checkbox-container";
        const dropdownButton = document.createElement("button");
        dropdownButton.className = "dropdown-btn";
        dropdownButton.textContent = "Add More..";
        checkboxContainer.appendChild(dropdownButton);

        const multiSelectDropdown = document.createElement("span");
        multiSelectDropdown.className = "multi-select-dropdown";

        dropdownButton.addEventListener("click", () => {
          toggleActiveClass(dropdownButton, multiSelectDropdown);
        });

        for (const value of dropdownValues) {
          const option = document.createElement("label");
          option.className = "select-dropdown-label";
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.value = value;
          const spanText = document.createElement("span");
          spanText.textContent = value;
          checkbox.addEventListener("click", function () {
            if (this.checked) {
              if (!appendedOptions.has(this.value)) {
                const spanToUpdate = elementsWithClass[i];
                const selectedOptionSpan = document.createElement("span");
                selectedOptionSpan.className = "btn-editable-span active";
                selectedOptionSpan.textContent = " " + this.value + " ";
                selectedOptionSpan.setAttribute("data-text", this.value);
                checkboxContainer.parentNode.insertBefore(
                  selectedOptionSpan,
                  checkboxContainer
                );
                appendedOptions.add(this.value);

                selectedOptionSpan.addEventListener("click", function (e) {
                  const spanElement = e?.target;
                  handleButtonToggle(
                    spanElement,
                    spanElement.parentNode.parentNode.parentNode.parentNode
                      .parentNode
                  );
                  if (appendedOptions.has(e.target.innerHTML.trim())) {
                    const appendedOption = elementsWithClass[i].querySelector(
                      `.btn-editable-span[data-text="${e.target.innerHTML.trim()}"]`
                    );
                    if (appendedOption) {
                      if (checkbox) {
                        checkbox.checked = false;
                      }
                      appendedOption.remove();
                      appendedOptions.delete(e.target.innerHTML.trim());
                      e.target.remove();
                    }
                  }
                });

                checkbox.addEventListener("change", function (e) {
                  const labelTag = e.target.parentNode;
                  const dropDownTag = labelTag.parentNode;
                  const dropContainer = dropDownTag.parentNode;
                  const codeContainer = dropContainer.parentNode;
                  const pTagContainer = codeContainer.parentNode;
                  const diveContainer = pTagContainer.parentNode.parentNode;
                  handleButtonToggle(e.target, diveContainer);
                });
              }
            } else {
              const appendedOption = elementsWithClass[i].querySelector(
                `.btn-editable-span[data-text="${this.value}"]`
              );
              if (appendedOption) {
                appendedOption.remove();
                appendedOptions.delete(this.value);
              }
            }
          });
          option.appendChild(checkbox);
          option.appendChild(spanText);
          multiSelectDropdown.appendChild(option);
        }

        checkboxContainer.appendChild(multiSelectDropdown);
        elementsWithClass[i].appendChild(checkboxContainer);
      }
    }
  };

  const toggleActiveClass = (button, dropdown) => {
    button.classList.toggle("selective");
    dropdown.classList.toggle("selective");
  };

  useEffect(() => {
    if (fetchRef.current && Object.keys(getTemp?.sections || {}).length) {
      // fetchRef.current.innerHTML = getTemp.template.templateContent;
      templateItem.forEach((item) => {
        fetchRef.current.innerHTML +=
          `<h3>${item.id}</h3>
           <div className="temp-cont">` +
          getTemp?.sections?.[item.id] +
          `</div>`;
      });
      // const elementsWithClass = fetchRef.current.getElementsByClassName("bracket-text");
      const elementsWithClass = fetchRef.current.querySelectorAll("code");
      getBracketText(elementsWithClass);
      return () => {
        if (fetchRef.current) fetchRef.current.innerHTML = null;
      };
    }
  }, [getTemp]);

  const hSubmit = () => {
    const categoriesAllowed = ["Subjective", "Objective", "Assessment", "Plan"];
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = finalTemp;
    let finalTemplate = {};
    tempDiv.querySelectorAll("h3").forEach((section) => {
      const sectionTitle = section.textContent.trim();
      if (categoriesAllowed.includes(sectionTitle)) {
        const sectionContent = section.nextElementSibling.innerHTML;
        // const sectionJSX = (
        //   <div dangerouslySetInnerHTML={{ __html: sectionContent }} />
        // );
        finalTemplate = {
          ...finalTemplate,
          [`${sectionTitle}`]: {
            ...finalTemplate?.[`${sectionTitle}`],
            templateData: sectionContent,
          },
        };

        console.log(
          `finalTemplate[${sectionTitle}]`,
          finalTemplate[sectionTitle]
        );
      }
    });

    // const finalTemplate = {
    //   Subjective: { templateData: <div className="temp-cont">....</div> },
    //   Objective: { templateData: <div className="temp-cont">....</div> },
    //   Assessment: { templateData: <div className="temp-cont">....</div> },
    //   Plan: { templateData: <div className="temp-cont">....</div> },
    // };

    dispatchFinalTemplate({
      payload: finalTemplate,
    });
    handleCloseModal();
    message.success("Template Insert successfully");
  };
  return (
    <div className="body-editer">
      <div className="group">
        <div className="editer-txt temp-insert">
          <h3>
            Master Template - <span>{getTemp ? getTemp.title : null}</span>
          </h3>
          <div className="temp-items">
            {Object.keys(getTemp?.sections || {}).length && (
              <div className="temp-item">
                <div ref={fetchRef} />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="submit-btns">
        <Button key="back" onClick={handleCloseModal}>
          Cancel
        </Button>
        <Button key="submit" type="primary" onClick={hSubmit}>
          Insert Template
        </Button>
      </div>
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
