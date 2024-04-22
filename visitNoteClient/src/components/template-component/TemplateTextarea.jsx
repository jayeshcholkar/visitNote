/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import { useState, useEffect, useRef, forwardRef } from "react";
import axios from "axios";
import RichTextEditor from "react-rte";
import { Button, Popover } from "antd";
import Icon1 from "../../static/images/Dictate.svg";
import Icon2 from "../../static/images/Salt-Shaker.svg";
import Icon3 from "../../static/images/annotation-info.svg";
import Icon4 from "../../static/images/copy-07.svg";
import Icon5 from "../../static/images/cursor-box.svg";
import { Div, MailBox } from "./style";
import { connect } from "react-redux";
import { ClickableTemplateOption } from "./ClickableTemplateOption";
import { TemplatePopup } from "./TemplatePopup";

import { BASEURL } from "../../units/constant";
import SuggestionsPopup from "./SuggestionPopup";
import { ClickableDotPhraseOption } from "./ClickableDotPhraseOption";
import { EditDotPhrase } from "./EditDotPhrase";

const TemplateTextareaComponent = forwardRef((props) => {
  // eslint-disable-next-line react/prop-types
  const { sectionsData, FinalTemplateData } = props;
  // eslint-disable-next-line react/prop-types
  let { category, _id } = sectionsData;

  const [editorValue, setEditorValue] = useState(
    RichTextEditor.createEmptyValue()
  );
  const inputRef = useRef(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [openDot, setOpenDot] = useState(false);
  const [expandedItem, setExpandedItem] = useState(null);
  const [sectionDetail, setSectionDetail] = useState();
  const [edit, setEdit] = useState({});
  const [filteredList, setFilteredList] = new useState(
    sectionDetail?.templates || []
  );
  const [tempId, setTempId] = useState();

  const getSectionsTemplate = () => {
    axios
      .get(`${BASEURL}/getSection/${category}`)
      .then((res) => {
        if (res.status === 200) return res.data;
      })
      .then((data) => {
        setSectionDetail(data);
        setFilteredList(data?.templates);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getDotPhraseTemplate = () => {
    axios
      .get(`${BASEURL}/dotphrase`)
      .then((res) => {
        if (res.status === 200) return res.data;
      })
      .then((data) => {
        setSectionDetail(data);
        setFilteredList(data?.dotPhrase);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const filterBySearch = (event, itemList) => {
    const query = event.target.value.toLowerCase();
    if (!itemList) {
      return; // No need to filter if itemList is not present
    }
    const updatedList = itemList.filter((item) => {
      return item.title.toLowerCase().indexOf(query) !== -1;
    });
    setFilteredList(updatedList);
  };

  const filterDotBySearch = (event, itemList) => {
    const query = event.target.value.toLowerCase();
    if (!itemList) {
      return; // No need to filter if itemList is not present
    }
    const updatedList = itemList.filter((item) => {
      return item.templateName.toLowerCase().indexOf(query) !== -1;
    });
    setFilteredList(updatedList);
  };

  // const handleEditorChange = (newValue, id) => {
  //   // setEditorValue(newValue);
  //   setEditorValue((prevEditorValues) => ({
  //     ...prevEditorValues,
  //     [id]: newValue,
  //   }));
  //   if (onChange) {
  //     onChange(newValue.toString("html"));
  //   }
  // };
  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
    setExpandedItem(null);
    if (newOpen) {
      getSectionsTemplate();
    }
  };
  const handleOpenChangeDot = (newOpen) => {
    setOpenDot(newOpen);
    setExpandedItem(null);
    if (newOpen) {
      getDotPhraseTemplate();
    }
  };

  const handleItemClick = (popupName, index) => {
    if (index === 0) {
      setModalVisible(popupName);
      setOpen(false);
      setExpandedItem(null);
    } else if (index === 1 || index === 2) {
      setExpandedItem((prevItem) => (prevItem === index ? null : index));
    } else {
      setExpandedItem(null);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setOpen(false);
    setExpandedItem(null);
  };

  const handleItemClickInsert = (popupName, templateId) => {
    setModalVisible(popupName);
    setOpen(false);
    setExpandedItem(null);
    setTempId(templateId);
  };

  const handleItemClickEdit = (popupName, templateId) => {
    setModalVisible(popupName);
    setOpen(false);
    setExpandedItem(null);
    setTempId(templateId);
  };

  const createPopup = (index) => handleItemClick("create", index);
  const saveNewTemplate = (index) => handleNewDot(index);

  const handleNewDot = (index) => {
    setExpandedItem((prevItem) => (prevItem === index ? null : index));
  };

  const insertPopup = (index, templateId) =>
    handleItemClickInsert("insert", templateId);

  const editPopup = (index, templateId) =>
    handleItemClickEdit("edit", templateId);

  const editDotPopup = (index, template) => {
    console.log(template, "template");
    if (template) {
      setEdit(template);
      setEditModalVisible(true);
      setOpenDot(false);
      setExpandedItem(null);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    let plainText = editorValue.toString("markdown");
    if (plainText.includes("..")) {
      plainText = plainText.replace("..", " ");
    }
    return plainText + suggestion;
  };

  const insertSuggestions = (suggestion, templateId) => {
    const getPlainTextSuggetions = handleSuggestionClick(suggestion);
    const templateValue = RichTextEditor.createValueFromString(
      getPlainTextSuggetions,
      "html"
    );
    setEditorValue(templateValue);
    setOpenDot(false);
    setExpandedItem(null);
  };

  const insertDotPhrase = (suggestion, templateId) => {
    const getPlainTextSuggetions = handleSuggestionClick(suggestion);
    const templateValue = RichTextEditor.createValueFromString(
      getPlainTextSuggetions,
      "html"
    );
    setEditorValue(templateValue);
    setOpenDot(false);
    // setExpandedItem(null);
  };

  useEffect(() => {
    if (FinalTemplateData?.[category]?.templateData?.length) {
      const templateValue = RichTextEditor.createValueFromString(
        FinalTemplateData?.[category]?.templateData,
        "html"
      );
      setEditorValue(templateValue);
    }
  }, [FinalTemplateData?.[category].templateData]);

  return (
    <Div className="page-section">
      <div className="section-head">{category}</div>
      <MailBox>
        <div className="body-editer">
          <div style={{ position: "relative" }} className="group">
            <RichTextEditor
              placeholder="Placeholder Text"
              onChange={(newValue) => setEditorValue(newValue)}
              value={editorValue || RichTextEditor.createEmptyValue()}
              ref={inputRef}
            />
            <SuggestionsPopup
              inputRef={inputRef}
              inputValue={editorValue.toString("html").replace(/<[^>]+>/g, "")}
              onSuggestionClick={insertSuggestions}
            />
          </div>
        </div>
        <div className="footer-editer">
          <div className="footer-list">
            <Button type="text" shape="circle" icon={<img src={Icon1} />} />
            <Button type="text" shape="circle" icon={<img src={Icon2} />} />
            <Button type="text" shape="circle" icon={<img src={Icon3} />} />
            <Popover
              placement="rightBottom"
              content={
                <ClickableDotPhraseOption
                  inputValue={editorValue
                    .toString("html")
                    .replace(/<[^>]+>/g, "")}
                  editorValue={editorValue}
                  saveNewTemplate={saveNewTemplate}
                  createPopup={createPopup}
                  insertPopup={insertPopup}
                  setOpenDot={setOpenDot}
                  insertSuggestions={insertSuggestions}
                  insertDotPhrase={insertDotPhrase}
                  editDotPopup={editDotPopup}
                  templates={sectionDetail?.dotPhrase}
                  expandedItem={expandedItem}
                  filteredList={filteredList}
                  setFilteredList={setFilteredList}
                  filterBySearch={filterDotBySearch}
                  category={category}
                />
              }
              trigger="click"
              open={openDot}
              onOpenChange={handleOpenChangeDot}
              overlayClassName="open-rightBottom"
            >
              <Button type="text" shape="circle" icon={<img src={Icon4} />} />
            </Popover>
            <Popover
              placement="rightBottom"
              content={
                <ClickableTemplateOption
                  createPopup={createPopup}
                  insertPopup={insertPopup}
                  editPopup={editPopup}
                  templates={sectionDetail?.templates}
                  expandedItem={expandedItem}
                  filteredList={filteredList}
                  setFilteredList={setFilteredList}
                  filterBySearch={filterBySearch}
                  category={category}
                />
              }
              trigger="click"
              open={open}
              onOpenChange={handleOpenChange}
              overlayClassName="open-rightBottom"
            >
              <Button type="text" shape="circle" icon={<img src={Icon5} />} />
            </Popover>
          </div>
        </div>
      </MailBox>

      {modalVisible ? (
        <TemplatePopup
          modalVisible={modalVisible}
          editorValue={editorValue}
          setEditorValue={setEditorValue}
          handleCloseModal={handleCloseModal}
          createPopup={createPopup}
          insertPopup={insertPopup}
          editPopup={editPopup}
          category={category}
          tempId={tempId}
          id={_id}
        />
      ) : null}
      {editModalVisible ? (
        <EditDotPhrase
          handleCloseModal={handleCloseModal}
          open={editModalVisible}
          close={() => {
            setEditModalVisible(false);
          }}
          edit={edit}
        />
      ) : null}
    </Div>
  );
});
const mapStateToProps = (state) => ({
  FinalTemplateData: state.finalTemp.data,
});

export const TemplateTextarea = connect(
  mapStateToProps,
  null
)(TemplateTextareaComponent);
