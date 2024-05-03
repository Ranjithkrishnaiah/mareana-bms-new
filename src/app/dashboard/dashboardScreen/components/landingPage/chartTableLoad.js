
import React from 'react';
import { Table } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
//cjson
//import cjson from './chartObj2.json';

const ChartSearchTable = (props) => {

    const columns = [
        {
            title: 'Name',
            key: 'chart_name',
            dataIndex: 'chart_name',
            
        },
        {
            title: 'Chart',
            key: 'chart_disp_id',
            dataIndex: 'chart_disp_id',
            width:'100px'
            
            
        },
        {
            title: 'Chart Version',
            key: 'chart_version',
            dataIndex: 'chart_version',
           
        }
    ]

    return (
        <div style={props.style}>
            <Table
                bordered={false}
                columns={columns}
                dataSource={props.searchTableData}
                pagination={false}
                scroll={{ y: 150 ,x:350}}
                rowKey='key'
                onRow={(record) => ({
                    onClick: () => {
                        console.log(record)
                        // let tempVersionList = [0];
                        // props.searchData.current.forEach((ele) => {
                        //     if (ele.view_disp_id === record.view_disp_id) {
                        //         tempVersionList.push(ele.view_version);
                        //         tempVersionList = tempVersionList.sort((a, b) => a - b);
                        //         setVersionList(tempVersionList);
                        //     }
                        // })
                        props.setViewData?.({ ...props.viewData, chartName: record.chart_name, chartDispId: record.chart_disp_id, status: record.chart_status, searchValue: record.chart_disp_id, chartVersion: record.chart_version,createdBy:record.created_by, viewId:record.chart_info[0].view_id });
                        props.parentCallback?.({ ...props.viewData, chartName: record.chart_name, chartDispId: record.chart_disp_id, status: record.chart_status, searchValue: record.chart_disp_id, chartVersion: record.chart_version,createdBy:record.created_by, viewId:record.chart_info[0].view_id });

                        // let newArr = [...postChartData.data];
                        // newArr.forEach((ele) => {
                        //     ele.view_id = record.view_disp_id,
                        //         ele.view_name = record.view_name
                        // })
                        props.setChartSearch(false);
                        
                    },
                })}
            />
        </div>
    )
}

export default ChartSearchTable;