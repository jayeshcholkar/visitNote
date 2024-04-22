// eslint-disable-next-line no-unused-vars
import { useState, useEffect } from "react";
import axios from "axios";
import { Button, Col, Row, Popover } from "antd";
import { ProfileSection } from "../components/template-component/ProfileSection";
import { RightSideBar } from "../components/template-component/RightSideBar";
import { Div } from "./style";
import { TemplateTextarea } from "../components/template-component/TemplateTextarea";
import SaltShaker from "../static/images/SaltShaker.svg";
import { TemplatePopup as MasterTemplatePopup } from "../components/template-component/TemplatePopup";
import { MasterTemplateFlow } from "../components/master/MasterTemplateFlow";
import { BASEURL } from "../units/constant";

export const HomeTemplate = () => {
  // eslint-disable-next-line react/prop-types
  const [expandedItem, setExpandedItem] = useState(null);
  const [open, setOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [sectionsData, setSectionsData] = useState();
  const [tempId, setTempId] = useState();

  const handleOpenChange = (openValue) => {
    setOpen(openValue);
    if (!openValue) setExpandedItem(openValue);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setOpen(false);
  };
  
  const fetchMasterTemplates = async (callBackOne, callBackTwo) => {
    const res = await axios.get(`${BASEURL}/getMasterTemplates`);
    if (res.status === 200) {
      callBackOne && callBackOne(res.data);
      callBackTwo && callBackTwo(res.data);
    }
  };

  const getSections = () => {
    axios
      .get(`${BASEURL}/sections`)
      .then((res) => {
        if (res.status === 200) return res.data;
      })
      .then((data) => {
        setSectionsData(data);
      });
  };

  useEffect(() => {
    getSections();
  }, []);

  return (
    <Div>
      <Row gutter={[20, 20]}>
        <Col span={18}>
          <div className="page-main">
            <div className="ant-page-header">
              <div className="ant-page-header-heading">
                <div className="ant-page-header-heading-left">
                  <div className="ant-page-header-heading-title">
                    Visit Note
                  </div>
                </div>
                <div className="ant-page-header-heading-extra">
                  <div className="ant-space ant-space-horizontal ant-space-align-center">
                    <div className="ant-space-item">
                      <div className="page-header-actions">
                        <Button type="default">
                          <img src={SaltShaker} alt="" />
                          Same as Last Time
                        </Button>
                        <Popover
                          placement="rightBottom"
                          content={
                            <MasterTemplateFlow
                              {...{
                                setModalVisible,
                                setOpen,
                                setTempId,
                                open,
                                fetchMasterTemplates,
                                expandedItem,
                                setExpandedItem
                              }}
                            />
                          }
                          trigger="click"
                          open={open}
                          onOpenChange={handleOpenChange}
                          overlayClassName="open-rightBottom"
                        >
                          <Button type="primary" ghost>
                            Use Master Template
                          </Button>
                        </Popover>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="page-sections">
              {sectionsData?.map((item, index) => {
                return (
                  <div key={index}>
                    <TemplateTextarea sectionsData={item} subTitle="" />
                  </div>
                );
              })}
            </div>

            <div className="ant-page-footer">
              {sectionsData ? (
                <>
                  <div className="ant-page-footer-left">
                    <div className="page-footer-actions">
                      <Button type="default">Cancel</Button>
                    </div>
                  </div>
                  <div className="ant-page-footer-extra">
                    <div className="page-footer-actions">
                      <Button type="default">Create Task</Button>
                      <Button type="default">Save as Master Template</Button>
                      <Button type="default">Bill Ready</Button>
                      <Button type="default">Save Note</Button>
                      <Button type="primary">Sign & Finalize</Button>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </Col>
        <Col span={6}>
          <div>
            <ProfileSection />
            <RightSideBar />
          </div>
        </Col>
      </Row>
      {modalVisible ? (
        <MasterTemplatePopup
          {...{
            modalVisible,
            handleCloseModal,
            tempId
          }}
        />
      ) : null}
    </Div>
  );
};
