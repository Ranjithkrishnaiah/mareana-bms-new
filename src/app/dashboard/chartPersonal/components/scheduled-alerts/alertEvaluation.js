import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Menu,
  Dropdown,
  message,
  Modal,
  Tabs,
  DatePicker,
  TimePicker,
  Radio,
  Select,
  Divider,
} from "antd";
import SelectField from "../../../../../components/SelectField/SelectField";
import InputField from "../../../../../components/InputField/InputField";
import { ArrowRightOutlined } from "@ant-design/icons";
import moment from "moment";
import "./styles.scss";

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const alertList = ["Limits", "Rules", "Threshold"];
const scheduleList = ["Repeat Once", "Daily", "Weekly", "Monthly"];
const timeRange = ["Hour", "Minutes", "Seconds"];
const alertEvaluation = () => {
  const [selectedAlert, setSelectedAlert] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [selectedTimeRange, setSelectedTimeRange] = useState("");
  const [showReceipients, setShowReceipients] = useState(false);
  const [radioValue, setRadioValue] = useState(null);
  const [emailList, setEmailList] = useState([]);

  const handleSelectChange = (e) => {
    setSelectedAlert(e);
  };
  const handleSelectScheduleChange = (e) => {
    setSelectedSchedule(e);
  };
  const onChangeTimePicker = (time, timeString) => {};
  const onChangeRadioButton = (e) => {
    setRadioValue(e.target.value);
  };
  const handleSelectTimeChange = (e) => {
    setSelectedTimeRange(e);
  };
  const handleReceipientsChange = (value) => {
    setEmailList(value);
  };
  return (
    <div>
      <Tabs className="evaluation-tabs">
        <TabPane tab="Schedule Evaluation" key="1">
          <div style={{ margin: "24px" }}>
            <div style={{ width: "200px" }}>
              <SelectField
                placeholder="Pick the type of alert"
                onChangeSelect={(e) => handleSelectChange(e)}
                selectList={alertList}
                value={selectedAlert}
              />
            </div>

            <div style={{ marginTop: "40px" }}>
              <Row gutter={[16, 24]}>
                <Col className="gutter-row" span={10}>
                  <div>
                    <DatePicker style={{ width: "415px" }} />
                  </div>
                </Col>
                <Col className="gutter-row" span={6}>
                  <div style={{ width: "240px" }}>
                    <SelectField
                      placeholder="Schedule"
                      onChangeSelect={(e) => handleSelectScheduleChange(e)}
                      selectList={scheduleList}
                      value={selectedSchedule}
                    />
                  </div>
                </Col>
                <Col className="gutter-row" span={6}>
                  {selectedSchedule && (
                    <div>
                      <TimePicker onChange={() => onChangeTimePicker()} />
                    </div>
                  )}
                </Col>
              </Row>

              {selectedSchedule == "Daily" ? (
                <div style={{ marginTop: "30px" }}>
                  <Row>
                    <Col span={16} offset={10}>
                      <Radio.Group
                        onChange={onChangeRadioButton}
                        value={radioValue}
                        style={{ display: "flex" }}
                      >
                        <Radio value={1} className="alerts-radio">
                          Every Day
                        </Radio>
                        <Radio value={2} className="alerts-radio">
                          Every WeekDay
                        </Radio>
                        <Radio value={3} className="alerts-radio">
                          Every{" "}
                        </Radio>
                        <div style={{ width: "100px", marginRight: "20px" }}>
                          <InputField className="alerts-radio" />
                        </div>

                        <SelectField
                          className="alerts-radio"
                          placeholder="Select HH/MM/SS"
                          selectList={timeRange}
                          value={selectedTimeRange}
                          onChangeSelect={(e) => handleSelectTimeChange(e)}
                        />
                      </Radio.Group>
                    </Col>
                  </Row>
                </div>
              ) : (
                ""
              )}
            </div>
            <div>
              {selectedSchedule && (
                <p className="share-to-workspace">
                  <a onClick={() => setShowReceipients(true)}>
                    Share to Workspace
                  </a>
                  <ArrowRightOutlined
                    style={{ marginLeft: "10px", color: "#093185" }}
                  />
                </p>
              )}
              {showReceipients && (
                <>
                  <Select
                    mode="tags"
                    style={{ width: "90%", marginTop: "10px" }}
                    placeholder={
                      <span style={{ fontSize: "16px" }}>Recipients</span>
                    }
                    optionLabelProp="label"
                    value={emailList}
                    bordered={false}
                    onChange={handleReceipientsChange}
                  >
                    <Option
                      value="binkita.tiwari@mareana.com"
                      label="binkita.tiwari@mareana.com"
                    >
                      binkita.tiwari@mareana.com
                    </Option>
                  </Select>
                  <Divider />
                </>
              )}
            </div>
            {selectedSchedule && (
              <div style={{ marginTop: "40px" }}>
                <Button className="schedule-evalutaion-button">
                  Schedule Evaluation
                </Button>
                <Button className="clear-schedule">Clear</Button>
              </div>
            )}
          </div>
        </TabPane>
        <TabPane tab="Email" key="2">
          Content of Tab 2
        </TabPane>
      </Tabs>
    </div>
  );
};

export default alertEvaluation;
