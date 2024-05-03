import React, { useState } from "react";
import { Table, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
//cjson
import cjson from "./chartObj2.json";
import ModalComponent from "../../../../../../components/Modal/Modal";

const ViewSearchTable = ({
  setDeepSearch,
  searchViewData,
  setVersionList,
  searchTableData,
  viewData,
  setViewData,
  setViewSearch,
  setData,
  postChartData,
  setPostChartData,
  deepSearch1,
}) => {
  const columns = [
    {
      title: "Name",
      key: "view_name",
      dataIndex: "view_name",
      width: 180,
    },
    {
      title: "View",
      key: "view_disp_id",
      dataIndex: "view_disp_id",
      width: 50,
    },
    {
      title: "Product Number",
      key: "product_num",
      dataIndex: "product_num",
      width: 120,
    },
  ];

  const onDeepSearch = () => {
    setDeepSearch(true);
    deepSearch1.current = true;
    setViewSearch(false);
  };

  return (
    <div className="table-box">
      <Table
        bordered={false}
        columns={columns}
        dataSource={searchTableData}
        pagination={false}
        scroll={{ y: 150 }}
        rowKey="key"
        onRow={(record) => ({
          onClick: () => {
            let tempVersionList = [0];
            searchViewData.current.forEach((ele) => {
              if (ele.view_disp_id === record.view_disp_id) {
                tempVersionList.push(ele.view_version);
                tempVersionList = tempVersionList.sort((a, b) => a - b);
                setVersionList(tempVersionList);
              }
            });
            setViewData({
              ...viewData,
              viewName: record.view_name,
              viewDispId: record.view_disp_id,
              status: record.view_status,
              searchValue: record.view_disp_id,
              chartVersion: record.view_version,
            });
            let newArr = [...postChartData.data];
            newArr.forEach((ele) => {
              (ele.view_id = record.view_disp_id),
                (ele.view_name = record.view_name);
            });
            setPostChartData({ ...postChartData, data: newArr });
            setViewSearch(false);
            setData();
          },
        })}
      />
      <div className="deep-search">
        <p onClick={onDeepSearch}>
          Deep search &nbsp; <SearchOutlined />
        </p>
      </div>
    </div>
  );
};

export default ViewSearchTable;
