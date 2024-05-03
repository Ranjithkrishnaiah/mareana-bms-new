import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux';
import {
    hideLoader,
    showLoader,
    showNotification,
} from '../../../../duck/actions/commonActions';
import ScreenHeader from "../../../../components/ScreenHeader/screenHeader";
import illustrations from "../../../../assets/images/Dashboard-Banner.svg";
import { Table } from 'antd';
import { getPbrTemplateData } from '../../../../services/pbrService'
import { tableColumns } from '../../../../utils/TableColumns'
import './styles.scss'
function multiDocExtraction() {
    const dispatch = useDispatch();
    const [templateData, setTemplateData] = useState([])
    const [templateColumns, setTemplateColumns] = useState([])
    useEffect(() => {
        cardTableData()
    }, []);
    const cardTableData = async () => {
        let req = ``
        try {
            dispatch(showLoader());
            const tableResponse = await getPbrTemplateData(req);
            const tableColumn = tableColumns(tableResponse?.Data[0])
            const newArray1 = tableColumn.filter(item => item.dataIndex != 'changed_by' && item.dataIndex != 'changed_on' && item.dataIndex != 'created_by' && item.dataIndex != 'created_on' && item.dataIndex != 'cust_key' && item.dataIndex != 'pbr_template_info')
            if (tableResponse['status-code'] === 200) {
                setTemplateColumns(newArray1)
                setTemplateData(tableResponse.Data);
                dispatch(hideLoader());
            }
            else if (tableResponse['status-code'] === 404) {
                setTemplateData(tableResponse.Data);
                dispatch(hideLoader());
                dispatch(showNotification('error', tableResponse.Message));
            }
        }


        catch (error) {

            dispatch(hideLoader());
            dispatch(showNotification('error', error.Message));
        }
       
    }

    const columns1 = [
        {
            title: 'File Name',
            key: 'name',
            dataIndex: 'name',
            sorter: (a, b) => a.view_name.localeCompare(b.view_name)
        }
    ]
    const columns2 = [
        {
            title: 'File Name',
            key: 'name',
            dataIndex: 'name',
            sorter: (a, b) => a.view_name.localeCompare(b.view_name)
        },
        {
            title: 'File Name',
            key: 'name',
            dataIndex: 'name',
            sorter: (a, b) => a.view_name.localeCompare(b.view_name)
        }

    ]
    const data1 = [
        {
            key: '1',
            name: 'asgdsagdsad.pdf',
        },
        {
            key: '2',
            name: 'asgdsagdsad.pdf',
        },
        {
            key: '3',
            name: 'asgdsagdsad.pdf',
        },
        {
            key: '4',
            name: 'asgdsagdsad.pdf',
        },

    ]
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === 'Disabled User',
            name: record.name,
        }),
    };
    return (
        <div className='custom-wrapper'>
            <div className='sub-header'>
            </div>
            <div className='custom-content-layout'>
                <div>
                    <ScreenHeader
                        bannerbg={{
                            background:
                                "linear-gradient(180deg, rgba(199, 144, 129, 0.15) 0%, rgba(223, 165, 121, 0.56) 100%)",
                        }}
                        title={`Howdy ${localStorage.getItem("username")},`}
                        description="Lets get designing some report templates"
                        source={illustrations}
                        sourceClass="dashboard-image"
                    />
                </div>
                <div className='content_section' >
                    <div >
                        <Table
                            style={{ width: 300 }}
                            rowSelection={{
                                type: 'radio',
                                ...rowSelection,
                            }}
                            columns={columns1}
                            dataSource={data1}
                            pagination={false}
                        />
                    </div>
                    <div style={{ marginTop: 20 }}>
                        <Table

                            columns={templateColumns}
                            dataSource={templateData}
                            pagination={false}
                            scroll={{ x: 450 }}
                            style={{ border: '1px solid #ececec', borderRadius: '2px' }}
                        />
                    </div>
                </div>



            </div>
        </div>
    )
}

export default multiDocExtraction