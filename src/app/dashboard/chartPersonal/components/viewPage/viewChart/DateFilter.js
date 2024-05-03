import React from "react";
import { Button, Col, Row } from "antd";
import moment from "moment";
import InputField from "../../../../../../components/InputField/InputField";
import SelectField from "../../../../../../components/SelectField/SelectField";

const DateFilter = ({
  batchFilters,
  setBatchFilters,
  setIsDatePopupVisible,
}) => {
  const list = ["minutes", "hours", "days", "months", "years"];

  const getDates = (days, duration) => {
    let obj = {};
    obj.endDate = moment().format("YYYY-MM-DD");
    if (duration === "days") {
      obj.startDate = moment().subtract(days, "days").format("YYYY-MM-DD");
    }
    if (duration === "months") {
      obj.startDate = moment().subtract(days, "months").format("YYYY-MM-DD");
    }
    if (duration === "years") {
      obj.startDate = moment().subtract(days, "years").format("YYYY-MM-DD");
    }
    if (duration === "hours") {
      obj.startDate = moment().subtract(days, "hours").format("YYYY-MM-DD");
    }
    if (duration === "minutes") {
      obj.startDate = moment().subtract(days, "minutes").format("YYYY-MM-DD");
    }

    return obj;
  };

  const onApply = () => {
    const date = getDates(batchFilters.time, batchFilters.duration);
    setBatchFilters({
      ...batchFilters,
      startDate: date.startDate,
      endDate: date.endDate,
    });
    setIsDatePopupVisible(false);
  };

  const onClear = () => {
    setBatchFilters({ ...batchFilters, time: "", duration: null });
  };

  return (
    <div className="date-filter">
      <Row>
        <Col span={10}>
          <label>Show only last</label>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={10}>
          <InputField
            type="number"
            placeholder="Enter number"
            name="time"
            value={batchFilters.time}
            onChangeInput={(e) =>
              setBatchFilters({ ...batchFilters, time: e.target.value })
            }
          />
        </Col>
        <Col span={14}>
          <SelectField
            placeholder="Select"
            selectList={list}
            selectedValue={batchFilters.duration}
            name="duration"
            onChangeSelect={(e) =>
              setBatchFilters({ ...batchFilters, duration: e })
            }
            allowClear
          />
        </Col>
      </Row>
      <Row gutter={16} className="mt-row">
        <Col span={10}>
          <Button className="apply" onClick={onApply}>
            Apply
          </Button>
        </Col>
        <Col span={14} className="clear">
          <p onClick={onClear}>Clear</p>
        </Col>
      </Row>
    </div>
  );
};

export default DateFilter;
