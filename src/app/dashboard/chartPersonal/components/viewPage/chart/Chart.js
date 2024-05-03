import React, { useEffect, useState } from "react";
import "./styles.scss";
import { useParams } from "react-router-dom";
//antd imports
import { Row, Col, Divider, Input, Empty } from "antd";
//components
import InputField from "../../../../../../components/InputField/InputField";
import ScatterChart from "./scatterChart/ScatterChart";
const { TextArea } = Input;
import EmptyImg from "../../../../../../assets/icons/empty.svg";

//main component
const Chart = ({ postChartData, setPostChartData }) => {
  const [chartValues, setChartValues] = useState({
    chartName: "",
    chartdesc: "",
    chartId: "",
    chartVersion: "",
    chartStatus: "",
  });
  const { id } = useParams();
  const handleChange = (e, value) => {
    const newArr = [...postChartData.data];
    newArr.forEach((ele) => {
      if (value === "name") {
        ele.chart_name = e.target.value;
        setChartValues({ ...chartValues, chartName: e.target.value });
      }
      if (value === "desc") {
        ele.chart_description = e.target.value;
        setChartValues({ ...chartValues, chartdesc: e.target.value });
      }
    });
    setPostChartData({ ...postChartData, data: newArr });
  };

  useEffect(() => {
    postChartData &&
      postChartData.data &&
      postChartData.data.forEach((ele) => {
        if (ele.chart_id) {
          setChartValues({
            ...chartValues,
            chartId: ele.chart_id,
            chartVersion: ele.chart_version,
            chartStatus: ele.chart_status,
            chartName: ele.chart_name,
            chartdesc: ele.chart_description,
          });
        }
      });
  }, [postChartData]);

  return (
    <div className="chart-container">
      <Row>
        <Col span={24} className="header">
          <h3>Chart</h3>
        </Col>
      </Row>
      {postChartData && postChartData.data && postChartData.data[0].view_id ? (
        <>
          <Row gutter={24} className="details-container">
            <Col span={6}>
              <Row gutter={16}>
                <Col span={8}>
                  <p>Chart ID</p>
                </Col>
                <Col span={10}>
                  <p>
                    : {chartValues.chartId ? chartValues.chartId : "Unassigned"}
                  </p>
                </Col>
                <Col span={6} />
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <p>Version</p>
                </Col>
                <Col span={8}>
                  <p>
                    : {chartValues.chartVersion ? chartValues.chartVersion : ""}
                  </p>
                </Col>
                <Col span={6} />
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <p>Status</p>
                </Col>
                <Col span={8}>
                  <p>
                    : {chartValues.chartStatus ? chartValues.chartStatus : ""}
                  </p>
                </Col>
                <Col span={6} />
              </Row>
            </Col>
            <Col span={6}>
              <InputField
                label="Chart name"
                placeholder="Enter name"
                value={chartValues.chartName}
                onChangeInput={(e) => handleChange(e, "name")}
              />
            </Col>
            <Col span={12}>
              <p>Chart description</p>
              <TextArea
                placeholder="Enter description"
                value={chartValues.chartdesc}
                onChange={(e) => handleChange(e, "desc")}
                rows={1}
                allowClear
              />
            </Col>
          </Row>
          <Divider />
          <ScatterChart
            postChartData={postChartData}
            setPostChartData={setPostChartData}
          />
        </>
      ) : (
        <Empty
          className="empty-chart"
          image={EmptyImg}
          description={
            <span>
              Select a '<i>View</i>' to start personalizing your chart.
            </span>
          }
        />
      )}
    </div>
  );
};

export default Chart;
