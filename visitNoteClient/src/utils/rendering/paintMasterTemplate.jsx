const handleButtonTextToggle = (e, cb) => {
  handleButtonToggle(
    e.target,
    e.target.parentNode.parentNode.parentNode.parentNode.parentNode,
    cb
  );
};

const handleButtonToggle = (target, mainDocumentDiv, callBack) => {
  target.classList.toggle("active");
  callBack && callBack(mainDocumentDiv.innerHTML);
};

const toggleActiveClass = (button, dropdown) => {
  button.classList.toggle("selective");
  dropdown.classList.toggle("selective");
};

export const paintOriginal = (elementsWithClass, cb) => {
  for (let i = 0; i < elementsWithClass.length; i++) {
    const stringForButtons = elementsWithClass[i].innerHTML;
    const stringWithoutBrackets = stringForButtons.slice(1, -1);
    const words = stringWithoutBrackets.replace(/\[|\]/g, " ").split(",");
    const filteredWords = words.filter(
      (word) => word.trim().toLowerCase() !== "and"
    );

    elementsWithClass[i].innerHTML = "";

    let spanCounter = 0;
    let dropdownValues = [];
    let appendedOptions = new Set();

    for (let j = 0; j < filteredWords.length; j++) {
      if (spanCounter < 5) {
        const spanElement = document.createElement("span");
        // spanElement.className = "btn-editable-span";
        // spanElement.innerHTML = " " + filteredWords[j].trim() + " ";

        if (filteredWords[j].trim().length > 25) {
          spanElement.className = "btn-editable-span tooltip";
        } else {
          spanElement.className = "btn-editable-span";
        }
        spanElement.setAttribute("data-tooltip", filteredWords[j].trim());
        spanElement.name = filteredWords[j].trim();
        spanElement.innerHTML =
          " " + `<span>${filteredWords[j].trim()}</span>` + " ";

        spanElement.name = filteredWords[j].trim();
        spanElement.addEventListener("click", (e) =>
          handleButtonTextToggle(e, cb)
        );
        elementsWithClass[i].append(spanElement);
        spanCounter++;
      } else {
        dropdownValues.push(filteredWords[j].trim());
      }
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
            if (!appendedOptions.has(value)) {
              const selectedOptionSpan = document.createElement("span");
              // selectedOptionSpan.className = "btn-editable-span active";
              // selectedOptionSpan.textContent = " " + value + " ";

              if (value.length > 25) {
                selectedOptionSpan.className =
                  "btn-editable-span active tooltip";
              } else {
                selectedOptionSpan.className = "btn-editable-span active";
              }
              selectedOptionSpan.setAttribute("data-tooltip", value);
              selectedOptionSpan.name = value;
              selectedOptionSpan.innerHTML =
                " " + `<span>${value}</span>` + " ";

              selectedOptionSpan.setAttribute("data-text", value);
              checkboxContainer.parentNode.insertBefore(
                selectedOptionSpan,
                checkboxContainer
              );
              appendedOptions.add(value);

              selectedOptionSpan.addEventListener("click", function (e) {
                const spanElement = e?.target;
                handleButtonToggle(
                  spanElement,
                  spanElement.parentNode.parentNode.parentNode.parentNode
                    .parentNode,
                  cb
                );
                if (
                  appendedOptions.has(e.target.getAttribute("data-text").trim())
                ) {
                  const appendedOption = elementsWithClass[i].querySelector(
                    `[data-text="${e.target.getAttribute("data-text").trim()}"]`
                  );
                  if (appendedOption) {
                    if (checkbox) {
                      checkbox.checked = false;
                    }
                    appendedOption.remove();
                    appendedOptions.delete(
                      e.target.getAttribute("data-text").trim()
                    );
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
                handleButtonToggle(e.target, diveContainer, cb);
              });
            }
          } else {
            const appendedOption = elementsWithClass[i].querySelector(
              `[data-text="${value}"]`
            );
            if (appendedOption) {
              appendedOption.remove();
              appendedOptions.delete(value);
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

export function paintRegerated(codeElement, cb) {
  for (let i = 0; i < codeElement.length; i++) {
    const appendedOptions = new Set();
    const allTextButtons =
      codeElement[i].querySelectorAll(".btn-editable-span");
    allTextButtons.forEach((button, index) => {
      button.addEventListener("click", (e) => handleButtonTextToggle(e, cb));
      if (index > 4) {
        appendedOptions.add(button.getAttribute("data-text").trim());
      }
    });
    const checkBoxContainer = codeElement[i].querySelectorAll(
      ".multi-select-checkbox-container"
    )[0];
    if (checkBoxContainer) {
      const addMoreButton = checkBoxContainer.querySelector(".dropdown-btn");
      const multiSelectDropDown = checkBoxContainer.querySelector(
        ".multi-select-dropdown"
      );

      addMoreButton.addEventListener("click", (e) => {
        toggleActiveClass(e.target, multiSelectDropDown);
      });
      const checkboxInput = multiSelectDropDown.querySelectorAll("input");
      checkboxInput.forEach((checkbox) => {
        const spanWithValue =
          checkbox.parentNode.children[
            checkbox.parentNode.children.length - 1
          ]?.innerHTML.trim();
        if (appendedOptions.has(spanWithValue)) {
          checkbox.checked = true;
        }

        const dataTextButtons = codeElement[i].querySelectorAll(
          ".btn-editable-span.active"
        );
        dataTextButtons.forEach((dtb) => {
          if (appendedOptions.has(dtb.getAttribute("data-text"))) {
            dtb.addEventListener("click", function (e) {
              const spanElement = e?.target;
              handleButtonToggle(
                spanElement,
                spanElement.parentNode.parentNode.parentNode.parentNode
                  .parentNode,
                cb
              );
              if (
                appendedOptions.has(e.target.getAttribute("data-text").trim())
              ) {
                const appendedOption = codeElement[i].querySelector(
                  `[data-text="${e.target.getAttribute("data-text").trim()}"]`
                );
                if (appendedOption) {
                  if (checkbox) {
                    checkbox.checked = false;
                  }
                  appendedOption.remove();
                  appendedOptions.delete(
                    e.target.getAttribute("data-text").trim()
                  );
                  e.target.remove();
                }
              }
            });
          }
        });

        checkbox.addEventListener("click", function () {
          if (this.checked) {
            if (!appendedOptions.has(spanWithValue)) {
              const selectedOptionSpan = document.createElement("span");
              // selectedOptionSpan.className = "btn-editable-span active";
              // selectedOptionSpan.textContent = " " + spanWithValue + " ";

              if (spanWithValue.length > 25) {
                selectedOptionSpan.className =
                  "btn-editable-span active tooltip";
              } else {
                selectedOptionSpan.className = "btn-editable-span active";
              }
              selectedOptionSpan.setAttribute("data-tooltip", spanWithValue);
              selectedOptionSpan.name = spanWithValue;
              selectedOptionSpan.innerHTML =
                " " + `<span>${spanWithValue}</span>` + " ";

              selectedOptionSpan.setAttribute("data-text", spanWithValue);
              checkBoxContainer.parentNode.insertBefore(
                selectedOptionSpan,
                checkBoxContainer
              );
              appendedOptions.add(spanWithValue);
              selectedOptionSpan.addEventListener("click", function (e) {
                const spanElement = e?.target;
                handleButtonToggle(
                  spanElement,
                  spanElement.parentNode.parentNode.parentNode.parentNode
                    .parentNode,
                  cb
                );
                if (
                  appendedOptions.has(e.target.getAttribute("data-text").trim())
                ) {
                  const appendedOption = codeElement[i].querySelector(
                    `[data-text="${e.target.getAttribute("data-text").trim()}"]`
                  );
                  if (appendedOption) {
                    if (checkbox) {
                      checkbox.checked = false;
                    }
                    appendedOption.remove();
                    appendedOptions.delete(
                      e.target.getAttribute("data-text").trim()
                    );
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
                handleButtonToggle(e.target, diveContainer, cb);
              });
            }
          } else {
            const appendedOption = codeElement[i].querySelector(
              `[data-text="${spanWithValue}"]`
            );
            if (appendedOption) {
              appendedOption.remove();
              appendedOptions.delete(spanWithValue);
            }
          }
        });
      });
    }
  }
}
