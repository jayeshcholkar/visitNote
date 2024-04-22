// import { useState } from "react";
// import RichTextEditor from "react-rte";
import { Modal } from "antd";
import { CreateTemplate } from "./CreateTemplate";
import { InsertTemplate } from "./InsertTemplate";
import { EditTemplate } from "./EditTemplate";
import { CreateMasterTemplate } from "./CreateMasterTemplate";
import { InsertMasterTemplate } from "./InsertMasterTemplate";
import { EditMasterTemplate } from "./EditMasterTemplate";

export const TemplatePopup = (props) => {
  // eslint-disable-next-line react/prop-types
  const { modalVisible, handleCloseModal, category = "Subjective", tempId, id } = props;
  return (
    <Modal
      open={modalVisible}
      title={
        modalVisible === "create" || modalVisible === "masterCreate"
          ? "Create Clickable Template"
          : modalVisible === "edit" || modalVisible === "masterEdit"
          ? " Edit Clickable Template"
          : modalVisible === "insert" || modalVisible === "masterInsert"
          ? null
          : null
      }
      onCancel={handleCloseModal}
      footer={null}
      width={1000}
    >
      <div>
        {modalVisible === "create" ? (
          <CreateTemplate
            handleCloseModal={handleCloseModal}
            category={category}
          />
        ) : modalVisible === "insert" ? (
          <InsertTemplate handleCloseModal={handleCloseModal} tempId={tempId} category={category} categoryId={id}/>
        ) : modalVisible === "edit" ? (
          <EditTemplate
            handleCloseModal={handleCloseModal}
            tempId={tempId}
            category={category}
          />
        ) : modalVisible === "masterCreate" ? (
          <CreateMasterTemplate handleCloseModal={handleCloseModal} />
        ) : modalVisible === "masterInsert" ? (
          <InsertMasterTemplate
            handleCloseModal={handleCloseModal}
            tempId={tempId}
          />
        ) : modalVisible === "masterEdit" ? (
          <EditMasterTemplate
            handleCloseModal={handleCloseModal}
            tempId={tempId}
          />
        ) : null}
      </div>
    </Modal>
  );
};
