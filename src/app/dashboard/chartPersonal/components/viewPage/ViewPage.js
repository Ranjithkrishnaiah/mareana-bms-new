import React, { useState, useEffect } from "react";
import { useLocation } from "react-router";
import "./viewPageStyles.scss";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
//antd imports
import { Row, Col, Tabs, Menu, Dropdown, message, Button, Modal } from "antd";
import {
  ArrowLeftOutlined,
  CloudUploadOutlined,
  MoreOutlined,
  DesktopOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
//components
import BreadCrumbWrapper from "../../../../../components/BreadCrumbWrapper";
import ViewChart from "./viewChart/ViewChart";
import Limits from "./limits/Limits";
import Display from "./display/Display";
import Chart from "./chart/Chart";
import Threshold from "./Threshold/threshold";
import Rules from "./Rules/rules";
//chart json object
import chartJson from "./chartObj.json";
//redux
import { useDispatch } from "react-redux";
import {
  showLoader,
  hideLoader,
} from "../../../../../duck/actions/commonActions";
//services
import {
  saveChartPlotData,
  getChartPlotData,
} from "../../../../../services/chartPersonalizationService";
//alert evaluation
import AlertEvaluation from "../scheduled-alerts/alertEvaluation";
//schedule-alert table
import AlertTable from "../scheduled-alerts/scheduledAlertsTable";
import JobSchedule from "../../../../../components/JobSchedule";
import Signature from "../../../../../components/ElectronicSignature/signature";
import queryString from "query-string";

const { TabPane } = Tabs;

//main component
const ViewPage = () => {
  const { id } = useParams();
  const history = useHistory();
  const match = useRouteMatch();
  //state for chart json data
  const [postChartData, setPostChartData] = useState({});
  const [alertModal, setAlertModal] = useState(false);
  const [isPublish, setIsPublish] = useState(false);
  const [publishResponse, setPublishResponse] = useState({});
  const [approveReject, setApproveReject] = useState("");

  const dispatch = useDispatch();
  const location = useLocation();

  const params = queryString.parse(location.search);
  console.log("parametersss", params);

  const callback = (key) => {};

  const handleCancel = () => {
    setAlertModal(false);
  };

  //function for saving chart data
  const saveAs = async (type) => {
    const postData = JSON.parse(JSON.stringify(postChartData));
    let obj = {};
    if (Number(id) !== 0) {
      if (type === "save") {
        obj = {
          ...postData,
          savetype: "save",
        };
      } else {
        (postData.data[0].chart_id = ""),
          (postData.data[0].chart_version = ""),
          (postData.data[0].chart_status = ""),
          (obj = {
            ...postData,
            savetype: "saveas",
          });
      }
    } else {
      obj = {
        ...postData,
        savetype: "saveas",
      };
    }
    let access = false;
    postData.data.forEach((element) => {
      if (element.chart_name === "") {
        message.error("Chart name required");
        access = true;

        return;
      }
      if (element.chart_description === "") {
        message.error("Chart description required");
        access = true;

        return;
      }
    });
    if (access) {
      return false;
    }
    try {
      dispatch(showLoader());
      const viewRes = await saveChartPlotData(obj);
      if (viewRes.statuscode === 200) {
        if (Number(id) !== 0) {
          if (type === "save") {
            message.success("Chart updated successfully");
          } else {
            message.success("New Chart created successfully");
            history.push(
              `/dashboard/chart_personalization/${viewRes.chart_id}`
            );
          }
        } else {
          message.success("Chart created successfully");
          history.push(`/dashboard/chart_personalization/${viewRes.chart_id}`);
        }
      }
      dispatch(hideLoader());
    } catch (error) {
      dispatch(hideLoader());
      message.error("Chart creation failed");
    }
  };

  const handleClose = () => {
    setIsPublish(false);
  };

  const PublishResponse = (res) => {
    setPublishResponse(res);
  };

  //function for getting chart data
  const getChart = async () => {
    const req = { chartId: id };
    try {
      const viewRes = await getChartPlotData(req);
      setPostChartData(viewRes);
    } catch (err) {
      message.error("Load chart failed");
    }
  };

  const backToLanding = () => {
    const url = match.url.substring(0, match.url.length - 2);
    history.push(url);
  };

  useEffect(() => {
    if (Number(id) === 0) {
      const newObj = JSON.parse(JSON.stringify(chartJson));
      setPostChartData(newObj);
    } else {
      getChart();
    }
  }, [id]);

  return (
    <div className="custom-wrapper bread-wrapper">
      <div className="sub-header">
        <BreadCrumbWrapper
          urlName={`/dashboard/chart_personalization/${id}`}
          value={id}
          data="Untitled"
        />
        <div className="btns">
          {Object.keys(params).length > 0 ? (
            <>
              <Button
                onClick={() => {
                  setIsPublish(true);
                  setApproveReject("R");
                }}
              >
                Reject
              </Button>
              <Button
                onClick={() => {
                  setIsPublish(true);
                  setApproveReject("A");
                }}
              >
                Approve
              </Button>
            </>
          ) : (
            <div>
              <Button>Share</Button>
              <Button onClick={() => setAlertModal(true)}>
                Schedule Alert
              </Button>
              <Button onClick={() => saveAs("saveas")}>Save As</Button>
              <Button onClick={() => saveAs("save")}>Save</Button>
              <Button
                onClick={() => {
                  setIsPublish(true);
                  setApproveReject("P");
                }}
              >
                {" "}
                <CloudUploadOutlined />
                Publish
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="custom-content-layout">
        <Row gutter={24}>
          <Col span={7} className="tab-container">
            <Tabs defaultActiveKey="1" onChange={callback}>
              <TabPane tab="View" key="1">
                <ViewChart
                  postChartData={postChartData}
                  setPostChartData={setPostChartData}
                />
              </TabPane>
              <TabPane tab="Limit" key="2">
                <Limits
                  postChartData={postChartData}
                  setPostChartData={setPostChartData}
                />
              </TabPane>
              <TabPane tab="Display" key="3">
                <Display
                  postChartData={postChartData}
                  setPostChartData={setPostChartData}
                />
              </TabPane>
              <TabPane tab="Threshold" key="4">
                <Threshold
                  postChartData={postChartData}
                  setPostChartData={setPostChartData}
                />
              </TabPane>
              <TabPane tab="Rule" key="5">
                <Rules
                  postChartData={postChartData}
                  setPostChartData={setPostChartData}
                />
              </TabPane>
            </Tabs>
          </Col>
          <Col span={17}>
            <Chart
              postChartData={postChartData}
              setPostChartData={setPostChartData}
            />
          </Col>
        </Row>
      </div>
      <Modal
        title="Schedule Alert"
        className="schedule-modal"
        visible={false}
        onCancel={handleCancel}
        footer={false}
        width={1300}
      >
        <Tabs tabPosition="left" className="schedule-menu">
          <TabPane
            tab={
              <span>
                <DesktopOutlined />
                Alerts
              </span>
            }
            key="1"
          >
            <AlertEvaluation />
          </TabPane>
          <TabPane
            tab={
              <span>
                <DesktopOutlined />
                Schedule Alerts
              </span>
            }
            key="2"
          >
            <div className="schedule-alerts">
              <div className="alerts-text">
                <p className="alert-title">Scheduled Alerts</p>
                <span className="alert-arrow">
                  <a>View More Details</a>
                  <ArrowRightOutlined
                    style={{ marginLeft: "10px", color: "#093185" }}
                  />
                </span>
              </div>
              <div>
                <AlertTable />
              </div>
            </div>
          </TabPane>
        </Tabs>
      </Modal>
      <JobSchedule
        visible={alertModal}
        app_type="CHART"
        handleCancel={handleCancel}
        id={postChartData.data && postChartData.data[0].chart_id}
      />
      <Signature
        isPublish={isPublish}
        handleClose={handleClose}
        screenName="Chart Personalization"
        PublishResponse={PublishResponse}
        appType="CHART"
        dispId={postChartData.data && postChartData.data[0].chart_id}
        version={postChartData.data && postChartData.data[0].chart_version}
        status={approveReject}
      />
    </div>
  );
};

export default ViewPage;
