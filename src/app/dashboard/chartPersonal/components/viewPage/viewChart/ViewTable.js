import React, { useState } from "react";
import { Button, Table, Avatar, message } from "antd";

const ViewTable = ({
  searchTableData,
  deepSearch1,
  setDeepSearch,
  onSelectedView,
}) => {
  const [rowData, setRowdata] = useState({});
  function generateRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  const columns = [
    {
      title: "Product Number",
      key: "product_num",
      dataIndex: "product_num",
      width: 150,
    },
    {
      title: "View",
      key: "view_disp_id",
      dataIndex: "view_disp_id",
      width: 100,
    },
    {
      title: "View Name",
      key: "view_name",
      dataIndex: "view_name",
      width: 220,
    },
    {
      title: "Creator",
      key: "created_by",
      dataIndex: "created_by",
      width: 260,
      render: (text, record) => {
        return (
          <span>
            <Avatar
              style={{
                color: "#FFFFFF",
                backgroundColor: generateRandomColor(),
              }}
            >
              {record.created_by.substring(0, 1)}
            </Avatar>{" "}
            &nbsp; &nbsp;
            {record.created_by}
          </span>
        );
      },
    },
    {
      title: "Status",
      key: "view_status",
      dataIndex: "view_status",
      width: 100,
    },
  ];

  const onCancel = () => {
    setDeepSearch(false);
    deepSearch1.current = false;
  };

  return (
    <div className="viewPopup">
      <Table
        columns={columns}
        pagination={false}
        dataSource={searchTableData}
        scroll={{ y: 250 }}
        onRow={(record) => ({
          onClick: () => {
            setRowdata(record);
            message.success(`${record.view_disp_id} is Selected`);
          },
        })}
      />
      <div className="footer-btns">
        <Button className="custom-primary-btn" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          className="custom-secondary-btn"
          onClick={() => onSelectedView(rowData)}
        >
          Ok
        </Button>
      </div>
    </div>
  );
};

export default ViewTable;
