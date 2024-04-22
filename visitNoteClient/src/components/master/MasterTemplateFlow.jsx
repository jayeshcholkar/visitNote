/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import { ClickableTemplateOption } from '../template-component/ClickableTemplateOption';

export function MasterTemplateFlow({ setModalVisible, setOpen, setTempId, fetchMasterTemplates, expandedItem, setExpandedItem}){
const [templates, setTemplates] = useState([]);
const [filteredList, setFilteredList] = useState([]);

const handleItemClickInsertAndEdit = (popupName, _id) => {
    setModalVisible(popupName);
    setOpen(false);
    setExpandedItem(null);
    setTempId(_id);
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
const createPopup = (index) => handleItemClick("masterCreate", index);
const insertPopup = (index, _id) => handleItemClickInsertAndEdit("masterInsert", _id);
const editPopup = (index, _id) => handleItemClickInsertAndEdit("masterEdit", _id);
    
const filterBySearch = (event, itemList) => {
    const query = event.target.value.toLowerCase();
    const updatedList = itemList.filter((item) => {
        return item.title.toLowerCase().indexOf(query) !== -1;
    });
    setFilteredList(updatedList);
};

const setTemplateCallBackFunc = (data) =>{
    setTemplates(data)
}

const setFilteredListCallBackFunc = (data) =>{
    setFilteredList(data)
}
const setExpandedCallBackFunc = (open) => {
 if (open) setExpandedItem(false)
}
useEffect(()=>{
 fetchMasterTemplates(setTemplateCallBackFunc, setFilteredListCallBackFunc, setExpandedCallBackFunc)
}, [fetchMasterTemplates])

    return (
        <ClickableTemplateOption
            {...{
                createPopup,
                editPopup,
                insertPopup,
                expandedItem,
                filteredList,
                filterBySearch,
                templates,
                templateType:"master",
            }}
        />
    )
}