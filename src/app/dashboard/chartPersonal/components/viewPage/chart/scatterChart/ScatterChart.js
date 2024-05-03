import React, { useEffect, useState, useRef } from "react";
import "./ScatterStyles.scss";
//antd imports
import { Row, Col, Button, message, Tabs, Empty } from "antd";
//components
import SelectField from "../../../../../../../components/SelectField/SelectField";
import ScatterPlot from "../../../../../../../components/ScatterPlot/ScatterPlot";
import Modal from "../../../../../../../components/Modal/Modal";
import ExclusionPopup from "../ExclusionPopup";
import DataTable from "../dataTables/DataTable";
import ExclusionTable from "../dataTables/ExclusionTable";
import ViolationTable from "../dataTables/ViolationTable";
//services
import { postChartPlotData } from "../../../../../../../services/chartPersonalizationService";
//redux
import { useDispatch } from "react-redux";
import {
  showLoader,
  hideLoader,
  showNotification,
} from "../../../../../../../duck/actions/commonActions";

const { TabPane } = Tabs;

const ScatterChart = ({ postChartData, setPostChartData }) => {
  const dispatch = useDispatch();
  const chartTypeList = [
    "Scatter Plot",
    "Process Control",
    "Levey-Jennings Plot",
    "I-MR Plot",
    "Trend Control",
    "KDE Control",
    "Box Control",
  ];
  const [axisValues, setAxisValues] = useState({
    xaxis: null,
    yaxis: null,
    chartType: null,
  });
  const [chartData, setChartData] = useState([]);
  const [layoutData, setLayoutData] = useState({});
  const [showChart, setShowChart] = useState(false);
  const [xaxisList, setXAxisList] = useState([]);
  const [yaxisList, setYAxisList] = useState([]);
  const [tableKey, setTableKey] = useState("3");
  const exclusionIdCounter = useRef(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [exclusionValues, setExclusionValues] = useState({
    productCode: "",
    parameterName: "",
    parameterValue: "",
    unit: "",
    testDate: "",
    ncNumber: "",
    notes: "",
    excludeRecord: false,
  });
  const [exclusionTable, setExclusionTable] = useState([]);

  const chartNodeClicked = (data) => {
    postChartData.data.forEach((ele) => {
      ele.extras.data_table.forEach((el) => {
        if (el.batch_num === data.text) {
          setExclusionValues({
            ...exclusionValues,
            batchId: data.text,
            productCode: ele.view_name,
            parameterValue: `(${data.x},${data.y})`,
            notes: "",
            unit: el.uom_code,
            excludeRecord: false,
            parameterName: `(${ele.chart_mapping.x.function_name},${ele.chart_mapping.y.function_name})`,
            testDate: `(${new Date(
              el["recorded_date_" + ele.chart_mapping.x.function_name]
            ).toLocaleDateString()},${new Date(
              el["recorded_date_" + ele.chart_mapping.y.function_name]
            ).toLocaleDateString()})`,
          });
        }
      });
    });
    setIsModalVisible(true);
  };
  const handleCloseModal = () => {
    setIsModalVisible(false);
  };
  const onApply = async () => {
    if (axisValues.xaxis === axisValues.yaxis) {
      message.error("X and Y axis cannot be same");

      return;
    }
    let xAxis = {};
    let yAxis = {};
    const newCovArr = JSON.parse(JSON.stringify(postChartData));
    newCovArr.data[0].extras.coverage.forEach((ele) => {
      if (ele.function_name === axisValues.xaxis) {
        xAxis.function_name = ele.function_name;
        xAxis.function_id = ele.function_id;
      }
      if (ele.function_name === axisValues.yaxis) {
        yAxis.function_name = ele.function_name;
        yAxis.function_id = ele.function_id;
      }
    });
    const newArr = [...postChartData.data];
    const obj = {
      function_name:
        axisValues.xaxis === "Batch" ? "batch_num" : "recorded_date",
      function_id: null,
    };
    newArr.forEach((ele) => {
      ele.chart_type =
        axisValues.chartType === "Scatter Plot" ? "scatter" : "process control";
      ele.chart_mapping.x = Object.keys(xAxis).length !== 0 ? xAxis : obj;
      ele.chart_mapping.y = yAxis;
      ele.layout.xaxis.title.text =
        Object.keys(xAxis).length !== 0
          ? xAxis.function_name
          : obj.function_name === "batch_num"
          ? "Batch"
          : "Recorded Date";
      ele.layout.yaxis.title.text = yAxis.function_name;
    });
    setPostChartData({ ...postChartData, data: newArr });
    try {
      dispatch(showLoader());
      const viewRes = await postChartPlotData(postChartData);
      let newdataArr = [...postChartData.data];
      newdataArr[0].data = viewRes.data[0].data;
      newdataArr[0].extras = viewRes.data[0].extras;
      setPostChartData({ ...postChartData, data: newdataArr });
      setShowChart(true);
      dispatch(hideLoader());
    } catch (error) {
      dispatch(hideLoader());
      message.error("unable to plot chart");
    }
  };

  const tabChange = (key) => {
    setTableKey(key);
  };

  const handleChartType = (e) => {
    setAxisValues({ ...axisValues, chartType: e });
  };
  useEffect(() => {
    const newCovArr = JSON.parse(JSON.stringify(postChartData));
    newCovArr &&
      newCovArr.data &&
      newCovArr.data.forEach((ele) => {
        if (ele.data[0].x && ele.data[0].x.length >= 1) {
          const chart =
            ele.chart_type === "scatter" ? "Scatter Plot" : "Process Control";
          let xValue = "";
          let yValue = "";
          if (ele.chart_type === "scatter") {
            xValue = ele.chart_mapping.x.function_name;
          } else {
            xValue =
              ele.chart_mapping.x.function_name === "batch_num"
                ? "Batch"
                : "Date";
          }
          yValue = ele.chart_mapping.y.function_name
            ? ele.chart_mapping.y.function_name
            : "";
          setAxisValues({
            ...axisValues,
            chartType: chart,
            xaxis: xValue,
            yaxis: yValue,
          });
          setShowChart(true);
          setChartData(ele.data);
          setLayoutData(ele.layout);
        } else {
          setShowChart(false);
          setChartData([]);
          setLayoutData({});
          setAxisValues({
            ...axisValues,
            chartType: null,
            xaxis: null,
            yaxis: null,
          });
        }
      });
  }, [postChartData]);

  //getting xaxis list and yaxis list
  useEffect(() => {
    let list = [];
    postChartData &&
      postChartData.data &&
      postChartData.data[0].extras &&
      postChartData.data[0].extras.coverage &&
      postChartData.data[0].extras.coverage.forEach((ele) => {
        list.push(ele.function_name);
        if (axisValues.chartType === "Scatter Plot") {
          setXAxisList(list);
          setYAxisList(list);
        } else {
          const tempList = ["Batch", "Date"];
          setXAxisList(tempList);
          setYAxisList(list);
        }
      });
  }, [axisValues.chartType]);

  return (
    <div className="chartLayout-container">
      <Row gutter={24}>
        <Col span={6}>
          <p>Chart Type</p>
          <SelectField
            placeholder="Select Chart type"
            selectList={chartTypeList}
            selectedValue={axisValues.chartType}
            onChangeSelect={handleChartType}
          />
        </Col>
        <Col span={6}>
          <p>X-axis</p>
          <SelectField
            placeholder="Select X-axis"
            selectList={xaxisList}
            selectedValue={axisValues.xaxis}
            onChangeSelect={(e) => setAxisValues({ ...axisValues, xaxis: e })}
          />
        </Col>
        <Col span={6}>
          <p>Y-axis</p>
          <SelectField
            placeholder="Select Y-axis"
            selectList={yaxisList}
            selectedValue={axisValues.yaxis}
            onChangeSelect={(e) => setAxisValues({ ...axisValues, yaxis: e })}
          />
        </Col>
        <Col span={6} className="button-visible">
          <p>button</p>
          <Button
            className="custom-primary-btn"
            onClick={onApply}
            disabled={
              !axisValues.chartType || !axisValues.xaxis || !axisValues.yaxis
            }
          >
            Apply
          </Button>
        </Col>
      </Row>
      <div className="chart-table">
        <Row className="scatter-chart">
          {showChart && (
            <ScatterPlot
              data={chartData}
              layout={layoutData}
              nodeClicked={chartNodeClicked}
            />
          )}
        </Row>
        {showChart && (
          <Row className="tabledata">
            <Col span={24}>
              <Tabs
                defaultActiveKey="3"
                activeKey={tableKey}
                onChange={tabChange}
              >
                <TabPane tab="Exclusion" key="1">
                  {exclusionTable.length >= 1 ? (
                    <ExclusionTable
                      setExclusionTable={setExclusionTable}
                      exclusionTable={exclusionTable}
                      postChartData={postChartData}
                      setPostChartData={setPostChartData}
                      exclusionIdCounter={exclusionIdCounter}
                    />
                  ) : (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  )}
                </TabPane>
                <TabPane tab="Violation" key="2">
                  <ViolationTable postChartData={postChartData} />
                </TabPane>
                <TabPane tab="Data Table" key="3">
                  <DataTable postChartData={postChartData} />
                </TabPane>
              </Tabs>
            </Col>
          </Row>
        )}
      </div>
      <Modal
        title="Batch Parameter"
        isModalVisible={isModalVisible}
        handleCancel={handleCloseModal}
      >
        <ExclusionPopup
          className="exclusion-modal"
          exclusionValues={exclusionValues}
          setExclusionValues={setExclusionValues}
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
          setExclusionTable={setExclusionTable}
          exclusionTable={exclusionTable}
          postChartData={postChartData}
          setPostChartData={setPostChartData}
          setTableKey={setTableKey}
          exclusionIdCounter={exclusionIdCounter}
        />
      </Modal>
    </div>
  );
};

export default ScatterChart;
