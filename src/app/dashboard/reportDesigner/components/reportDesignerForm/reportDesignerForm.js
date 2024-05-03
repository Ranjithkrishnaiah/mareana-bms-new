import React, { useState } from 'react';
import { Button, Input, Select, Typography, Modal, Table, Card } from 'antd';
import { getCharts } from '../../../../../services/reportDesignerServices';
import './styles.scss';
// import { getCharts } from '../../../../../services/reportDesignerServices';


const { Option } = Select;
const { Text } = Typography;
const { TextArea } = Input;

const columns = [
    {
        title: 'Product Num',
        dataIndex: 'product_num',
        key: 'name',
    },
    {
        title: 'View',
        dataIndex: 'view',
        key: 'view_disp_id',
    },
    {
        title: 'View Name',
        dataIndex: 'view_name',
        key: 'view_name',
    },
    {
        title: 'Created By',
        dataIndex: 'created_by',
        key: 'created_by',
    },
];
function ReportDesignerForm(props) {
    const {
        setViewId,
        viewList,
        status,
        setStatus,
        isLoad,
        reportName,
        setReportName,
        mapViewList,
        setViewVersion,
        reportId,
        viewIdVersion,
        setViewIdVersion,
        setSelectedChartList,
        selectedChartList
    } = props;

    const [visible, setVisible] = useState(false);
    // const [loading, setLoading] = useState(false);
    const [filterTable, setFilterTable] = useState(null);
    // const [selectedChartList, setSelectedChartList] = useState([])
    const [chartsList, setChartList] = useState([])




    const handleChange = selectedItems => {
        setSelectedChartList(selectedItems);
    };
    const drag = selectedItems => {

    };

    const onDragEnd = (fromIndex, toIndex) => {
        if (toIndex < 0) return; // Ignores if outside designated area

        const items = [...this.state.data];
        const item = items.splice(fromIndex, 1)[0];
        items.splice(toIndex, 0, item);
        this.setState({ data: items });
    };
    //Get charts based on viewId-version
    const getChartsList = (version, viewId) => {
        if (viewId.length > 0)
            setSelectedChartList([])
        // message.success(`${version} selected`)
        let req = version;
        getCharts(req).then((res) => {

            if (res['status-code'] === 200)
                setChartList(res['data']);
            else
                setChartList([]);
        });
    };

    const search = (value) => {
        const tableData = viewList;
        const filterTable = tableData.filter((o) =>
            Object.keys(o).some((k) =>
                String(o[k]).toLowerCase().includes(value.toLowerCase())
            )
        );

        setFilterTable(filterTable);
    };



    return (
        <Card className="reportInfoCard" title="Report Info" >
            <div className='reportDesigner-grid'>
                <div className='reportDesigner-block-design'>
                    <div>
                        <Text className='filter-text'> Report ID : {reportId ? reportId : "Unassigned"}</Text> <br /> <br />
                        <Text className='filter-text' >Status : {status}</Text><br />
                    </div>
                    <div>
                        <Text className='filter-text'>Report Name <b style={{ color: 'red' }}>*</b></Text><br />
                        <Input
                            className='filter-button'
                            value={reportName}
                            onChange={(e) => setReportName(e.target.value)}
                            required={true}
                            disabled={props.show}
                            placeholder="Enter Report Name"
                        />
                    </div>
                    <div>
                        <Text className='filter-text'>View</Text><br />
                        <div
                            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}
                        >
                            <Select
                                className='filter-button'
                                defaultValue={viewIdVersion}
                                showArrow
                                showSearch
                                onChange={(e, value) => {

                                    let view_value = value.value;
                                    let split_view_id = view_value.split('-');
                                    setViewId(split_view_id[0]);
                                    setViewVersion(split_view_id[1]);
                                    setViewIdVersion(view_value);
                                    getChartsList(view_value, split_view_id[0]);
                                }}
                                value={viewIdVersion}
                                disabled={props.show}
                            >
                                {mapViewList.map((item) => (
                                    <Option value={item.view} key={item.view}>{item.view}</Option>
                                ))}
                            </Select>
                            {/* <Button
                                disabled={isLoad}
                                style={{ width: '40px' }}
                                onClick={() => setVisible(true)}
                            >
                                <BlockOutlined
                                    style={{ marginRight: '5px' }}
                                    twoToneColor='#093185'
                                />
                            </Button> */}
                        </div>
                    </div>
                    <div>
                        <Text className='filter-text' >Chart ID</Text><br />

                            <Select
                                row={1}
                                className="filter-button"
                                mode="multiple"
                                allowClear
                                dropdownStyle={{ border: '10' }}
                                notFoundContent="No Result"
                                placeholder="Select Multiple Charts"
                                value={selectedChartList}
                                onChange={handleChange}
                                style={{ width: '100%', minHeight: '60px', maxHeight: '200px',overflow:'auto' }}
                            >
                                {chartsList.length > 0 ? chartsList.map(item => (
                                    <Option draggable="true" value={item} key={item}>
                                        {item}
                                    </Option>
                                )) : <Option >

                                </Option>}
                            </Select>
                    </div>
                    {/* <div>
                    <Text className='filter-text' >Status</Text><br />
                    <Input className='filter-button' value={status} disabled={props.show || isLoad} />

                </div> */}

                    {/* <Input className='filter-button' value={reportId} disabled /> */}


                </div>
                <Modal
                    title={
                        <p>
                            Select View{' '}
                            <Input.Search
                                className='table-search'
                                placeholder='Search by...'
                                enterButton
                                onSearch={search}
                            />
                        </p>
                    }
                    centered
                    visible={visible}
                    onOk={() => setVisible(false)}
                    onCancel={() => setVisible(false)}
                    width={600}
                    footer={[<Button style={{ backgroundColor: '#093185', color: 'white', borderRadius: '4px' }} onClick={() => setVisible(false)}>OK</Button>,]}

                >
                    <Table
                        dataSource={filterTable === null ? viewList : filterTable}
                        columns={columns}
                        pagination={false}
                        size='small'
                        onRow={(record) => ({
                            onClick: (e) => {
                                setViewId(record.view_disp_id);
                                setStatus('NEW');
                                setViewVersion(record.view_version);
                                setViewIdVersion(record.view);
                                getChartsList(record.view, record.view_disp_id);
                            },
                        })}
                        scroll={{ y: 200 }}
                    // style={{ height: '200px' }}
                    />
                </Modal>
            </div>
        </Card>
    );
}

export default ReportDesignerForm;
