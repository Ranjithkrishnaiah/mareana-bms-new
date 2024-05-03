import React, { useState } from "react";
import "./style.scss";
//antd imports
import { Modal, Tabs } from "antd";
import {
  ArrowLeftOutlined,
  DesktopOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
//components
import LandingPage from "./landingPage/LandingPage";
//react-redux
import { useDispatch } from "react-redux";
import BreadCrumbWrapper from "../../../../components/BreadCrumbWrapper";
//schedule-alert table
import AlertTable from "./scheduled-alerts/scheduledAlertsTable";
//alert evaluation
import AlertEvaluation from "./scheduled-alerts/alertEvaluation";

const { TabPane } = Tabs;

//main component
const ChartPersonal = () => {
  //for showing schedule alert modal
  const [alertModal, setAlertModal] = useState(false);

  const dispatch = useDispatch();

  const handleCancel = () => {
    setAlertModal(false);
  };

  return (
    <div className="custom-wrapper bread-wrap">
      <div className="sub-header">
        <BreadCrumbWrapper />
      </div>
      <div className="custom-content-layout">
        <LandingPage />
      </div>
    </div>
  );
};

export default ChartPersonal;
