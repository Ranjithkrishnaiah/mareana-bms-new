import React from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
//antd imports
import { Table, Avatar } from "antd";

const LoadTable = ({ chartList }) => {
  const match = useRouteMatch();
  const history = useHistory();
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
      title: "Molecule",
      dataIndex: "product_num",
      key: "product_num",
      width: 100,
    },
    {
      title: "Chart ID",
      dataIndex: "chart_disp_id",
      key: "chart_disp_id",
      width: 100,
    },
    {
      title: "Chart Name",
      dataIndex: "chart_name",
      key: "chart_name",
      width: 150,
    },
    {
      title: "Creator",
      dataIndex: "created_by",
      key: "created_by",
      width: 150,
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
      dataIndex: "chart_status",
      key: "chart_status",
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={chartList}
        pagination={false}
        scroll={{ y: 150 }}
        bordered={false}
        rowKey="key"
        onRow={(record) => ({
          onClick: () => {
            history.push(`${match.url}/${record.chart_disp_id}`);
          },
        })}
      />
    </div>
  );
};

export default LoadTable;
