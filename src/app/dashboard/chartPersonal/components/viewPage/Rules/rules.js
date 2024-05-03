import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "./styles.scss";
import {
  Button,
  Checkbox,
  Collapse,
  Input,
  message,
  Skeleton,
  Row,
  Col,
} from "antd";
import { PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import reactStringReplace from "react-string-replace";
import { getRuleList } from "../../../../../../services/chartPersonalizationService";
import {
  showLoader,
  hideLoader,
} from "../../../../../../duck/actions/commonActions";
import { useDispatch } from "react-redux";
import { postChartPlotData } from "../../../../../../services/chartPersonalizationService";
const { Panel } = Collapse;

const rules = ({ postChartData, setPostChartData }) => {
  const [ruleList, setRuleList] = useState([]);
  const postChartClone = useRef({});
  const [checked, setChecked] = useState([]);
  const [selectedRules, setSelectedRules] = useState([]);
  const [loadRuleList, setLoadRuleList] = useState({});
  const dispatch = useDispatch();
  const { id } = useParams();

  const getRules = async () => {
    try {
      const rulesResponse = await getRuleList();
      const newArr = JSON.parse(JSON.stringify(postChartData));
      if (Number(id) !== 0) {
        Object.entries(rulesResponse.rules_list).map(([key, value]) => {
          value.map((ele) => {
            if (ele.applied === true) {
              checked.push(ele.rule_id);
            }
            newArr.data[0].rules &&
              newArr.data[0].rules.map((el) => {
                if (el.rule_id === ele.rule_id) {
                  ele.default_params = el.default_params;
                  ele.applied = true;
                }
              });
          });
        });
      }
      setRuleList(rulesResponse.rules_list);
    } catch (error) {
      message.error("Unable to fetch rules");
    }
  };

  const getChecked = (e, id) => {
    if (e.target.checked) {
      if (!checked.includes(id)) {
        let newChecked = [...checked];
        newChecked.push(id);
        setChecked(newChecked);
      }
    } else {
      if (checked.includes(id)) {
        let newChecked = [...checked];
        newChecked.splice(checked.indexOf(id), 1);
        setChecked(newChecked);
      }
    }
  };
  const handleChange = (event, id, key) => {
    let tempArr = [...selectedRules];
    let objIndex = tempArr.findIndex((obj) => obj.rule_id === id);
    tempArr[objIndex].default_params[key] = event.target.value;
    setSelectedRules(tempArr);
  };

  const onApply = async () => {
    const selected = JSON.parse(JSON.stringify(selectedRules));
    selected.forEach((ele) => {
      delete ele.rule_desc;
      delete ele.rule_disp_id;
    });
    const select = selected.filter((person) =>
      checked.includes(person.rule_id)
    );
    select.forEach((ele) => {
      ele.applied = true;
    });
    const newArr = JSON.parse(JSON.stringify(postChartData));
    newArr.data[0].rules = select;
    try {
      dispatch(showLoader());
      const viewRes = await postChartPlotData(newArr);
      let newdataArr = [...postChartData.data];
      newdataArr[0].violations = viewRes.data[0].violations;
      newdataArr[0].data = viewRes.data[0].data;
      newdataArr[0].rules = viewRes.data[0].rules;
      setPostChartData({ ...postChartData, data: newdataArr });
      getRules();
      dispatch(hideLoader());
    } catch (error) {
      dispatch(hideLoader());
      message.error("Unable to save rules");
    }
  };

  const onReset = async () => {
    setRuleList({});
    setChecked([]);
    const newArr = JSON.parse(JSON.stringify(postChartData));
    newArr.data[0].rules = postChartClone.current.data[0].rules;
    try {
      dispatch(showLoader());
      const viewRes = await postChartPlotData(newArr);
      let newdataArr = [...postChartData.data];
      newdataArr[0].rules = viewRes.data[0].rules;
      newdataArr[0].violations = viewRes.data[0].violations;
      newdataArr[0].data = viewRes.data[0].data;
      setPostChartData({ ...postChartData, data: newdataArr });
      getRules();
      dispatch(hideLoader());
    } catch (error) {
      dispatch(hideLoader());
      message.error("Unable to fetch rules");
    }
  };

  useEffect(() => {
    getRules();
    postChartClone.current = JSON.parse(JSON.stringify(postChartData));
  }, []);

  useEffect(() => {
    if (ruleList) {
      let tempArr = [...Object.values(ruleList)];
      tempArr = tempArr.flat();
      setSelectedRules(tempArr);
      if (Number(id) !== 0) {
        const tempObj = {};
        const checked = [];
        Object.entries(ruleList).map(([key, value]) => {
          value.map((ele) => {
            if (ele.applied === true) {
              checked.push(ele.rule_id);
            }
          });
          tempObj[key] = value.filter((ele) => ele.applied === true);
        });
        setChecked(checked);
        setLoadRuleList(tempObj);
      }
    }
  }, [ruleList]);

  return (
    <div className="rule-container">
      {Object.keys(ruleList).length === 0 && <Skeleton />}
      {Object.keys(ruleList).length !== 0 && (
        <>
          <Collapse
            expandIconPosition="left"
            style={{ textTransform: "capitalize" }}
            ghost
            className="collapse-rule"
          >
            {Object.entries(ruleList).map(([key, value]) => {
              return (
                <Panel header={`${key} RULE`} key={key} className="panel-rule">
                  <Collapse
                    expandIconPosition="left"
                    expandIcon={({ isActive }) =>
                      isActive ? (
                        <MinusCircleOutlined />
                      ) : (
                        <PlusCircleOutlined />
                      )
                    }
                    ghost
                    className="rule-content"
                  >
                    {value.map((item, index) => {
                      let html = item.rule_desc;
                      item &&
                        item.default_params &&
                        Object.keys(item.default_params).map((key, index) => {
                          html = reactStringReplace(html, `<${key}>`, () => (
                            <span key={key} style={{ color: "red" }}>
                              <Input
                                type="number"
                                defaultValue={item.default_params[key]}
                                onChange={(e) =>
                                  handleChange(e, item.rule_id, key)
                                }
                              />
                            </span>
                          ));
                        });

                      return (
                        <Panel header={item.rule_disp_id} key={item.rule_id}>
                          <div className="rules">
                            <span>
                              <Checkbox
                                defaultChecked={
                                  item.applied ? item.applied : false
                                }
                                onChange={(e) => getChecked(e, item.rule_id)}
                              />
                              &nbsp;
                              <span id="my-inputs">{html}</span>
                            </span>
                          </div>
                        </Panel>
                      );
                    })}
                  </Collapse>
                </Panel>
              );
            })}
          </Collapse>
          {Number(id) !== 0 && Object.keys(loadRuleList).length !== 0 && (
            <div className="selected-rules">
              <h3>Selected Rules</h3>
              {Object.keys(loadRuleList).map((ele, index) => {
                if (loadRuleList[ele].length >= 1) {
                  return (
                    <div key={index}>
                      <Row className="rules">
                        <Col span={10}>
                          <p>
                            {loadRuleList[ele].length >= 1 && `${ele} Rule`}
                          </p>
                        </Col>
                        <Col span={14} className="rules-selected">
                          {/* {loadRuleList[ele].map((item) => {
                            return <span>{item.rule_disp_id}, </span>;
                          })} */}
                          {loadRuleList[ele].map((tag, i) => (
                            <span key={i}>
                              {i > 0 && ", "}
                              {tag.rule_disp_id}
                            </span>
                          ))}
                        </Col>
                      </Row>
                    </div>
                  );
                }
              })}
            </div>
          )}
          <div className="apply-cont">
            <p onClick={onReset}>Reset</p>
            <Button className="custom-primary-btn" onClick={onApply}>
              Apply
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default rules;
