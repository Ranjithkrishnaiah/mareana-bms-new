import React, { useEffect, useState } from "react";
import "./style.scss";
//antd imports
import { Collapse, Input, Switch, Checkbox, Select, Row, Col } from "antd";
import { DeleteTwoTone } from "@ant-design/icons";
//mock data
import { figure, legend, axes } from "./displayObjects";
//unpacking antd components
const { Panel } = Collapse;
const { Option } = Select;
import { initialLayout } from "./displayFunctions";
import InputField from "../../../../../../components/InputField/InputField";
import ColorPicker from "../../../../../../components/ColorPicker/ColorPicker";
import SelectField from "../../../../../../components/SelectField/SelectField";

const Display = ({ setFigure, postChartData, setPostChartData }) => {
  const [layoutData, setLayoutData] = useState(initialLayout);
  const orientationList = ["Vertical", "Horizontal"];

  useEffect(() => {
    if (postChartData.data) {
      const newArr = JSON.parse(JSON.stringify(postChartData));
      const xvalue = newArr.data[0].layout.xaxis.title.text;
      const yvalue = newArr.data[0].layout.yaxis.title.text;
      const o =
        newArr.data[0].layout.legend.orientation === "v"
          ? "Vertical"
          : "Horizontal";
      setLayoutData({
        ...layoutData,
        legend: { ...layoutData.legend, orientation: o },
        xaxis: {
          ...layoutData.xaxis,
          title: { ...layoutData.xaxis.title, text: xvalue },
        },
        yaxis: {
          ...layoutData.yaxis,
          title: { ...layoutData.yaxis.title, text: yvalue },
        },
      });
    }
  }, []);

  useEffect(() => {
    if (postChartData.data) {
      const newArr = [...postChartData.data];
      newArr[0].layout = JSON.parse(JSON.stringify(layoutData));
      const orientation = newArr[0].layout.legend.orientation;
      newArr[0].layout.legend.orientation =
        orientation === "Vertical" ? "v" : "h";
      setPostChartData({ ...postChartData, data: newArr });
    }
  }, [layoutData]);

  return (
    <div className="display-section">
      <Collapse expandIconPosition="right" ghost accordion>
        {/* Figure */}
        <Panel
          header="Figure"
          key="1"
          style={{ background: "white !important" }}
        >
          <div className="figure-container">
            {/* <Row className="figure-inputs" gutter={16}>
              <Col span={8}>
                <label>Lines </label>
              </Col>
              <Col span={16}>
                <Switch
                  size="small"
                  name="lines"
                  checked={figure.lines}
                  onChange={(e) => setFigure({ ...figure, lines: e })}
                />
              </Col>
            </Row>
            <Row className="figure-inputs select-top" gutter={16}>
              <Col span={8}>
                <label>Line Width </label>
              </Col>
              <Col span={16}>
                <Select
                  defaultValue="1"
                  onChange={(e) => setFigure({ ...figure, lineWidth: e })}
                >
                  <Option value="1">1</Option>
                  <Option value="2">2</Option>
                  <Option value="3">3</Option>
                </Select>
              </Col>
            </Row> */}
            <Row className="figure-inputs select-top" gutter={16}>
              <Col span={8}>
                <label>Height </label>
              </Col>
              <Col span={16}>
                <InputField
                  name="height"
                  value={layoutData.height}
                  onChangeInput={(e) =>
                    setLayoutData({ ...layoutData, height: e.target.value })
                  }
                />
              </Col>
            </Row>
            <Row className="figure-inputs select-top" gutter={16}>
              <Col span={8}>
                <label>Width </label>
              </Col>
              <Col span={16}>
                <InputField
                  name="width"
                  value={layoutData.width}
                  onChangeInput={(e) =>
                    setLayoutData({ ...layoutData, width: e.target.value })
                  }
                />
              </Col>
            </Row>
            <Row className="figure-inputs select-top" gutter={16}>
              <Col span={8}>
                <label>Plot color </label>
              </Col>
              <Col span={16}>
                <ColorPicker
                  value={layoutData.plot_bgcolor}
                  onChange={(e) =>
                    setLayoutData({
                      ...layoutData,
                      plot_bgcolor: e.target.value,
                    })
                  }
                />
              </Col>
            </Row>
            <div className="figure-inputs header">Panel Options</div>
            <Row className="figure-inputs select-top" gutter={16}>
              <Col span={8}>
                <label>Title </label>
              </Col>
              <Col span={16}>
                <InputField
                  value={layoutData.title.text}
                  onChangeInput={(e) =>
                    setLayoutData({
                      ...layoutData,
                      title: { ...layoutData.title, text: e.target.value },
                    })
                  }
                />
              </Col>
            </Row>
            <Row className="figure-inputs select-top" gutter={16}>
              <Col span={8}>
                <label>Font size </label>
              </Col>
              <Col span={16}>
                <InputField
                  value={layoutData.title.font.size}
                  onChangeInput={(e) =>
                    setLayoutData({
                      ...layoutData,
                      title: {
                        ...layoutData.title,
                        font: {
                          ...layoutData.title.font,
                          size: e.target.value,
                        },
                      },
                    })
                  }
                />
              </Col>
            </Row>
            <Row className="figure-inputs select-top" gutter={16}>
              <Col span={8}>
                <label>Font color </label>
              </Col>
              <Col span={16}>
                <ColorPicker
                  value={layoutData.title.font.color}
                  onChange={(e) =>
                    setLayoutData({
                      ...layoutData,
                      title: {
                        ...layoutData.title,
                        font: {
                          ...layoutData.title.font,
                          color: e.target.value,
                        },
                      },
                    })
                  }
                />
              </Col>
            </Row>
          </div>
        </Panel>

        {/* Legend */}
        <Panel header="Legend" key="2">
          <div className="figure-container">
            <div className="header option-header">Options</div>
            <Row className="figure-inputs" gutter={16}>
              <Col span={8}>
                <label>Show</label>
              </Col>
              <Col span={16}>
                <Switch
                  size="small"
                  checked={layoutData.showlegend}
                  onChange={(e) =>
                    setLayoutData({ ...layoutData, showlegend: e })
                  }
                />
              </Col>
            </Row>
            <Row className="figure-inputs" gutter={16}>
              <Col span={8}>
                <label>Title</label>
              </Col>
              <Col className="gutter-row select-top" span={16}>
                <InputField
                  value={layoutData.legend.title.text}
                  onChangeInput={(e) =>
                    setLayoutData({
                      ...layoutData,
                      legend: {
                        ...layoutData.legend,
                        title: {
                          ...layoutData.legend.title,
                          text: e.target.value,
                        },
                      },
                    })
                  }
                />
              </Col>
            </Row>
            <Row className="figure-inputs select-top" gutter={16}>
              <Col span={8}>
                <label>Legend size</label>
              </Col>
              <Col span={16}>
                <InputField
                  value={layoutData.legend.title.font.size}
                  onChangeInput={(e) =>
                    setLayoutData({
                      ...layoutData,
                      legend: {
                        ...layoutData.legend,
                        title: {
                          ...layoutData.legend.title,
                          font: {
                            ...layoutData.legend.title.font,
                            size: e.target.value,
                          },
                        },
                      },
                    })
                  }
                />
              </Col>
            </Row>
            <Row className="figure-inputs select-top" gutter={16}>
              <Col span={8}>
                <label>Legend color</label>
              </Col>
              <Col span={16}>
                <ColorPicker
                  value={layoutData.legend.title.font.color}
                  onChange={(e) =>
                    setLayoutData({
                      ...layoutData,
                      legend: {
                        ...layoutData.legend,
                        title: {
                          ...layoutData.legend.title,
                          font: {
                            ...layoutData.legend.title.font,
                            color: e.target.value,
                          },
                        },
                      },
                    })
                  }
                />
              </Col>
            </Row>
            <Row className="figure-inputs select-top" gutter={16}>
              <Col span={8}>
                <label>Border width</label>
              </Col>
              <Col span={16}>
                <InputField
                  value={layoutData.legend.borderwidth}
                  onChangeInput={(e) =>
                    setLayoutData({
                      ...layoutData,
                      legend: {
                        ...layoutData.legend,
                        borderwidth: e.target.value,
                      },
                    })
                  }
                />
              </Col>
            </Row>
            <Row className="figure-inputs select-top" gutter={16}>
              <Col span={8}>
                <label>Border color</label>
              </Col>
              <Col span={16}>
                <ColorPicker
                  value={layoutData.legend.bordercolor}
                  onChange={(e) =>
                    setLayoutData({
                      ...layoutData,
                      legend: {
                        ...layoutData.legend,
                        bordercolor: e.target.value,
                      },
                    })
                  }
                />
              </Col>
            </Row>
            <Row className="figure-inputs select-top" gutter={16}>
              <Col span={8}>
                <label>Background color</label>
              </Col>
              <Col span={16}>
                <ColorPicker
                  value={layoutData.legend.bgcolor}
                  onChange={(e) =>
                    setLayoutData({
                      ...layoutData,
                      legend: { ...layoutData.legend, bgcolor: e.target.value },
                    })
                  }
                />
              </Col>
            </Row>
            <Row className="figure-inputs select-top" gutter={16}>
              <Col span={8}>
                <label>Orientation</label>
              </Col>
              <Col span={16}>
                <SelectField
                  selectedValue={layoutData.legend.orientation}
                  selectList={orientationList}
                  onChangeSelect={(e) =>
                    setLayoutData({
                      ...layoutData,
                      legend: { ...layoutData.legend, orientation: e },
                    })
                  }
                />
              </Col>
            </Row>
          </div>
        </Panel>
        {/* Axes */}
        <Panel header="Axes" key="3">
          <div className="figure-container">
            <div className="header option-header">X-Axis</div>
            <Row className="figure-inputs" gutter={16}>
              <Col span={8}>
                <label>Show</label>
              </Col>
              <Col span={16}>
                <Switch
                  size="small"
                  checked={layoutData.xaxis.visible}
                  onChange={(e) =>
                    setLayoutData({
                      ...layoutData,
                      xaxis: { ...layoutData.xaxis, visible: e },
                    })
                  }
                />
              </Col>
            </Row>
            <Row className="figure-inputs" gutter={16}>
              <Col span={8}>
                <label>Show tick labels</label>
              </Col>
              <Col span={16}>
                <Switch
                  size="small"
                  checked={layoutData.xaxis.showticklabels}
                  onChange={(e) =>
                    setLayoutData({
                      ...layoutData,
                      xaxis: { ...layoutData.xaxis, showticklabels: e },
                    })
                  }
                />
              </Col>
            </Row>
            <Row className="figure-inputs" gutter={16}>
              <Col span={8}>
                <label>Show line</label>
              </Col>
              <Col span={16}>
                <Switch
                  size="small"
                  checked={layoutData.xaxis.showline}
                  onChange={(e) =>
                    setLayoutData({
                      ...layoutData,
                      xaxis: { ...layoutData.xaxis, showline: e },
                    })
                  }
                />
              </Col>
            </Row>
            <Row className="figure-inputs" gutter={16}>
              <Col span={8}>
                <label>Show grid</label>
              </Col>
              <Col span={16}>
                <Switch
                  size="small"
                  checked={layoutData.xaxis.showgrid}
                  onChange={(e) =>
                    setLayoutData({
                      ...layoutData,
                      xaxis: { ...layoutData.xaxis, showgrid: e },
                    })
                  }
                />
              </Col>
            </Row>
            <Row className="figure-inputs" gutter={16}>
              <Col span={8}>
                <label>Title</label>
              </Col>
              <Col className="gutter-row select-top" span={16}>
                <InputField
                  value={layoutData.xaxis.title.text}
                  onChangeInput={(e) =>
                    setLayoutData({
                      ...layoutData,
                      xaxis: {
                        ...layoutData.xaxis,
                        title: {
                          ...layoutData.xaxis.title,
                          text: e.target.value,
                        },
                      },
                    })
                  }
                />
              </Col>
            </Row>
            <Row className="figure-inputs select-top" gutter={16}>
              <Col span={8}>
                <label>Title size</label>
              </Col>
              <Col span={16}>
                <InputField
                  value={layoutData.xaxis.title.font.size}
                  onChangeInput={(e) =>
                    setLayoutData({
                      ...layoutData,
                      xaxis: {
                        ...layoutData.xaxis,
                        title: {
                          ...layoutData.xaxis.title,
                          font: {
                            ...layoutData.xaxis.title.font,
                            size: e.target.value,
                          },
                        },
                      },
                    })
                  }
                />
              </Col>
            </Row>
            <Row className="figure-inputs select-top" gutter={16}>
              <Col span={8}>
                <label>Title color</label>
              </Col>
              <Col span={16}>
                <ColorPicker
                  value={layoutData.xaxis.title.font.color}
                  onChange={(e) =>
                    setLayoutData({
                      ...layoutData,
                      xaxis: {
                        ...layoutData.xaxis,
                        title: {
                          ...layoutData.xaxis.title,
                          font: {
                            ...layoutData.xaxis.title.font,
                            color: e.target.value,
                          },
                        },
                      },
                    })
                  }
                />
              </Col>
            </Row>
            <Row className="figure-inputs select-top" gutter={16}>
              <Col span={8}>
                <label>Grid color</label>
              </Col>
              <Col span={16}>
                <ColorPicker
                  value={layoutData.xaxis.gridcolor}
                  onChange={(e) =>
                    setLayoutData({
                      ...layoutData,
                      xaxis: { ...layoutData.xaxis, gridcolor: e.target.value },
                    })
                  }
                />
              </Col>
            </Row>
            <div className="header">Y-Axis</div>
            <Row className="figure-inputs" gutter={16}>
              <Col span={8}>
                <label>Show</label>
              </Col>
              <Col span={16}>
                <Switch
                  size="small"
                  checked={layoutData.yaxis.visible}
                  onChange={(e) =>
                    setLayoutData({
                      ...layoutData,
                      yaxis: { ...layoutData.yaxis, visible: e },
                    })
                  }
                />
              </Col>
            </Row>
            <Row className="figure-inputs" gutter={16}>
              <Col span={8}>
                <label>Show tick labels</label>
              </Col>
              <Col span={16}>
                <Switch
                  size="small"
                  checked={layoutData.yaxis.showticklabels}
                  onChange={(e) =>
                    setLayoutData({
                      ...layoutData,
                      yaxis: { ...layoutData.yaxis, showticklabels: e },
                    })
                  }
                />
              </Col>
            </Row>
            <Row className="figure-inputs" gutter={16}>
              <Col span={8}>
                <label>Show line</label>
              </Col>
              <Col span={16}>
                <Switch
                  size="small"
                  checked={layoutData.yaxis.showline}
                  onChange={(e) =>
                    setLayoutData({
                      ...layoutData,
                      yaxis: { ...layoutData.yaxis, showline: e },
                    })
                  }
                />
              </Col>
            </Row>
            <Row className="figure-inputs" gutter={16}>
              <Col span={8}>
                <label>Show grid</label>
              </Col>
              <Col span={16}>
                <Switch
                  size="small"
                  checked={layoutData.yaxis.showgrid}
                  onChange={(e) =>
                    setLayoutData({
                      ...layoutData,
                      yaxis: { ...layoutData.yaxis, showgrid: e },
                    })
                  }
                />
              </Col>
            </Row>
            <Row className="figure-inputs" gutter={16}>
              <Col span={8}>
                <label>Title</label>
              </Col>
              <Col className="gutter-row select-top" span={16}>
                <InputField
                  value={layoutData.yaxis.title.text}
                  onChangeInput={(e) =>
                    setLayoutData({
                      ...layoutData,
                      yaxis: {
                        ...layoutData.yaxis,
                        title: {
                          ...layoutData.yaxis.title,
                          text: e.target.value,
                        },
                      },
                    })
                  }
                />
              </Col>
            </Row>
            <Row className="figure-inputs select-top" gutter={16}>
              <Col span={8}>
                <label>Title size</label>
              </Col>
              <Col span={16}>
                <InputField
                  value={layoutData.yaxis.title.font.size}
                  onChangeInput={(e) =>
                    setLayoutData({
                      ...layoutData,
                      yaxis: {
                        ...layoutData.yaxis,
                        title: {
                          ...layoutData.yaxis.title,
                          font: {
                            ...layoutData.yaxis.title.font,
                            size: e.target.value,
                          },
                        },
                      },
                    })
                  }
                />
              </Col>
            </Row>
            <Row className="figure-inputs select-top" gutter={16}>
              <Col span={8}>
                <label>Title color</label>
              </Col>
              <Col span={16}>
                <ColorPicker
                  value={layoutData.yaxis.title.font.color}
                  onChange={(e) =>
                    setLayoutData({
                      ...layoutData,
                      yaxis: {
                        ...layoutData.yaxis,
                        title: {
                          ...layoutData.yaxis.title,
                          font: {
                            ...layoutData.yaxis.title.font,
                            color: e.target.value,
                          },
                        },
                      },
                    })
                  }
                />
              </Col>
            </Row>
            <Row className="figure-inputs select-top" gutter={16}>
              <Col span={8}>
                <label>Grid color</label>
              </Col>
              <Col span={16}>
                <ColorPicker
                  value={layoutData.yaxis.gridcolor}
                  onChange={(e) =>
                    setLayoutData({
                      ...layoutData,
                      yaxis: { ...layoutData.xaxis, gridcolor: e.target.value },
                    })
                  }
                />
              </Col>
            </Row>
          </div>
        </Panel>
      </Collapse>
    </div>
  );
};

export default Display;
