import React, { useState, useEffect } from "react";
import { Table } from "antd";

const DataTable = ({ postChartData }) => {
  const [dataTable, setDataTable] = useState([]);

  let columns = [];
  let objkeys =
    dataTable !== undefined && dataTable.length > 0
      ? Object.keys(dataTable[0])
      : [];
  const first = "batch_num";
  objkeys = objkeys.sort(function (x, y) {
    return x == first ? -1 : y == first ? 1 : 0;
  });

  const uniqueArr = (value, index, self) => {
    return self.indexOf(value) === index;
  };
  const filterColumn = objkeys.filter(uniqueArr);
  filterColumn.map((item, i) => {
    columns.push({
      title: item.toUpperCase().replace("_", " "),
      dataIndex: item,
      key: `${item}-${i}`,
      width: item === "uom_code" || item === first ? 150 : 250,
    });
  });

  useEffect(() => {
    const newCovArr = JSON.parse(JSON.stringify(postChartData));
    newCovArr &&
      newCovArr.data &&
      newCovArr.data.forEach((ele) => {
        if (ele.extras && ele.extras.data_table) {
          setDataTable(ele.extras.data_table);
        }
      });
  }, [postChartData]);

  return (
    <div>
      <Table
        style={{ width: "fit-content" }}
        columns={columns}
        pagination={false}
        scroll={{ y: 350 }}
        dataSource={dataTable}
        rowKey={(record) => record.batch_num}
      />
    </div>
  );
};

export default DataTable;
