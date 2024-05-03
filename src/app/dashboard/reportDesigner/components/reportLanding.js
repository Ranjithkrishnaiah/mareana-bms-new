import React, { useState, useEffect } from 'react';
import { Card, Input, Divider, Table, Tabs, Avatar, message, Row, Col, Modal, Button } from 'antd';
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import illustrations from '../../../../assets/images/landing_image.png';
import { getReports } from '../../../../services/reportDesignerServices';
import './landing.scss';
import StatusBlock from '../../../../components/StatusBlock/statusBlock';
import { loadReport } from '../../../../services/reportDesignerServices';
import { loadReportGen } from '../../../../services/reportGeneratorServices';
import BreadCrumbWrapper from '../../../../components/BreadCrumbWrapper';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import { sendReport } from '../../../../duck/actions/reportDesignerAction';
import {
    showLoader,
    hideLoader,
    showNotification,
} from '../../../../duck/actions/commonActions';
import Banner from '../../../../assets/images/Popup-Side.svg';

export default function Landing(props) {
    const [resultDate, setResultDate] = useState('');
    const [searched, setSearched] = useState(false);
    const [newsearched, setNewSearched] = useState(false);
    const [reportList, setReportList] = useState([]);
    const [filterTable, setFilterTable] = useState(null);
    const [screen, setScreen] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const { TabPane } = Tabs;
    const history = useHistory();
    const dispatch = useDispatch();

    const columns = [
        {
            title: 'Report Name',
            dataIndex: 'rep_name',
            key: 'rep_name',
            render: (text, record) => {
                return {
                    props: {
                        style: { background: record.color },
                    },
                    children: <div>{text}</div>,
                };
            },
        },
        {
            title: 'Report id',
            dataIndex: 'rep_disp_id',
            key: 'rep_disp_id',
            render: (text, record) => {
                return {
                    props: {
                        style: { background: record.color },
                    },
                    children: <div>{text}</div>,
                };
            },
        },
        {
            title: 'Report Status',
            dataIndex: 'rep_status',
            key: 'rep_status',
            render: (text, record) => {
                return {
                    props: {
                        style: { background: record.color },
                    },
                    children: <div>{text}</div>,
                };
            },
        },
        {
            title: 'Created By',
            dataIndex: 'created_by',
            key: 'created_by',
            render: (text, row, index) => {
                return (
                    <div>
                        <Avatar
                            className='avatar-icon'
                            style={{
                                backgroundColor: getRandomColor(index + 1),
                            }}
                        >
                            {text.split('')[0].toUpperCase()}{' '}
                        </Avatar>
                        <span className='avatar-text'>{text}</span>
                    </div>
                );
            },
        },
    ];

    useEffect(() => {
        updateDate();
        getReportList();
    }, []);

    const updateDate = () => {
        const date = new Date();
        const month = date.toLocaleString('default', { month: 'long' });
        const latestDate = date.getDate();
        const year = date.getFullYear();
        const resultDate = month + ' ' + latestDate + ',' + ' ' + year;
        setResultDate(resultDate);
    };

    const getRandomColor = (index) => {
        let colors = ['#56483F', '#728C69', '#c04000', '#c19578'];
        return colors[index % 4];
    };

    const search = (value) => {
        setSearched(true);
        const tableData = reportList;
        const filterTable = tableData.filter((o) =>
            Object.keys(o).some((k) =>
                String(o[k]).toLowerCase().includes(value.toLowerCase())
            )
        );

        setFilterTable(filterTable);
    };
    const onSearch = (value) => {
        setNewSearched(true);
        const tableData = reportList;
        const filterTable = tableData.filter((o) =>
            Object.keys(o).some((k) =>
                String(o[k]).toLowerCase().includes(value.toLowerCase())
            )
        );

        setFilterTable(filterTable);
    };
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const handleOk = () => {
        setIsModalVisible(false);
    };
    const getReportList = () => {
        let req = { rep_status: 'all' };
        getReports(req).then((res) => {
            setReportList(res['Data']);
        });
    };

    const getLoadReport = async (report_id) => {
        message.success(report_id + ' selected');
        dispatch(showLoader());
        let req = { report_displ_id: report_id };
        let data = await loadReport(req);
        if (data.Status == 200 || data.report_designer) {
            props.getReportData(data);
            props.changeScreen();
        } else {
            dispatch(hideLoader());
            dispatch(showNotification('error', data.Message));
        }
    };

    const getLoadReportGenerator = async (report_id) => {
        message.success(report_id + ' selected');
        dispatch(showLoader());
        let req = { report_displ_id: report_id };
        let data = await loadReportGen(req);
        if (data.report_generator)
            dispatch(sendReport(data.report_generator.data));
        if (data.Status == 200 || data.report_generator) {
            history.push({
                pathname: '/dashboard/report_generator',
            });
        } else {
            dispatch(hideLoader());
            dispatch(showNotification('error', data.Message));
        }
    };
    const NewReportGenerator = async (report_id) => {
        message.success(report_id + ' selected');
        dispatch(showLoader());
        let req = { report_displ_id: report_id };
        let data = await loadReportGen(req);
        if (data.report_generator)
            dispatch(sendReport(data.report_generator.data));
        if (data.Status == 200 || data.report_generator) {
            dispatch(hideLoader());
            dispatch(showNotification('success', `Loaded ${report_id}`));
        } else {
            dispatch(hideLoader());
            dispatch(showNotification('error', data.Message));
        }
    };

    const statusColor = (status) => {
        if (status == 'APRD') {
            return 'aprd';
        }
        if (status == 'DRFT') {
            return 'drft';
        }
        if (status == 'AWAP') {
            return 'awap';
        }
    };


    return (
        <div className="report-landing">
            <div className='custom-wrapper'>
                <div className='sub-header'>
                    <div className='sub-header-title'>
                        <BreadCrumbWrapper />
                    </div>
                </div>
                <div className='custom-content-layout'>
                    <Card className='workflow_head'>
                        <div>
                            <p className='dash-username'>
                                Howdy {localStorage.getItem('username')}!
                            </p>
                            <p className='dash-text'>
                                Let's get designing some report templates!
                            </p>
                        </div>
                        <img src={illustrations} className='illustration' />
                        <span className='resultdate'>{resultDate}</span>
                    </Card>
                    <Card className='landing-card'>
                        <div style={{ width: '750px', marginLeft: '180px' }}>
                            <Input.Search
                                placeholder='Search by view ID, name, product number, creator, status'
                                allowClear
                                className='landing-btn'
                                enterButton='Search'
                                size='large'
                                onSearch={search}
                            />
                            <Tabs
                                className='report-landing-card'
                                defaultActiveKey='1'
                            >
                                <TabPane
                                    tab='Design Report Template'
                                    key='Design Report Template'
                                >
                                    {searched ? (
                                        <Table
                                            className='landing-table'
                                            columns={columns}
                                            dataSource={
                                                filterTable === null
                                                    ? reportList
                                                    : filterTable
                                            }
                                            onRow={(record) => ({
                                                onClick: (e) => {
                                                    // record['color'] = '#D3D3D3'
                                                    // setReportId(record.rep_disp_id)
                                                    // getReportData(record.rep_disp_id, record.rep_status)
                                                    // dispatch(showLoader())
                                                    getLoadReport(
                                                        record.rep_disp_id
                                                    );
                                                    // onOk()
                                                },
                                            })}
                                        />
                                    ) : (
                                        <></>
                                    )}
                                    <div
                                        className='create-new'
                                        onClick={() => props.changeScreen()}
                                    >
                                        <PlusOutlined />
                                        <p>Design new report</p>
                                    </div>
                                    <br />
                                    <h3 className='recent'>
                                        Recently designed report templates
                                    </h3>
                                    <Divider />
                                    <div>
                                        <div className='tile'>
                                            {reportList.length > 0 ? (
                                                reportList.map(
                                                    (i, index) =>
                                                        index < 8 && (
                                                            <div
                                                                onClick={() => {
                                                                    getLoadReport(
                                                                        i.rep_disp_id
                                                                    );
                                                                }}
                                                            >
                                                                <StatusBlock
                                                                    id={
                                                                        i.rep_disp_id
                                                                    }
                                                                    status={
                                                                        i.rep_status
                                                                    }
                                                                />
                                                            </div>
                                                        )
                                                )
                                            ) : (
                                                <></>
                                            )}
                                        </div>
                                    </div>
                                </TabPane>
                                <TabPane
                                    tab='Generate Report Variant'
                                    key='Generate Report Variant'
                                >
                                    {/* <Input.Search
                                    placeholder="Search by view ID, name, product number, creator, status"
                                    allowClear
                                    enterButton='Search'
                                    size='large'
                                    onSearch={search}
                                // onSearch={onSearch}
                                /> */}

                                    {searched ? (
                                        <Table
                                            columns={columns}
                                            dataSource={
                                                filterTable === null
                                                    ? reportList
                                                    : filterTable
                                            }
                                            onRow={(record) => ({
                                                onClick: (e) => {
                                                    // record['color'] = '#D3D3D3'
                                                    // setReportId(record.rep_disp_id)
                                                    // getReportData(record.rep_disp_id, record.rep_status)
                                                    // dispatch(showLoader())
                                                    getLoadReportGenerator(
                                                        record.rep_disp_id
                                                    );
                                                    // onOk()
                                                },
                                            })}
                                        />
                                    ) : (
                                        <></>
                                    )}
                                    <div
                                        className='create-new'
                                        // onClick={() => {
                                        //     history.push({
                                        //         pathname:
                                        //             '/dashboard/report_generator',
                                        //     });
                                        // }}
                                        onClick={() => setIsModalVisible(true)}
                                    >
                                        <PlusOutlined />
                                        <p>Generate new report</p>
                                    </div>
                                    <br />
                                    <h3 className='recent-report'>
                                        Recently created reports
                                    </h3>
                                    <Divider />
                                    <div className='tile'>
                                        {reportList &&
                                            reportList.length > 0 &&
                                            reportList.map(
                                                (i, index) =>
                                                    index < 8 && (
                                                        <div
                                                            onClick={() => {
                                                                getLoadReportGenerator(
                                                                    i.rep_disp_id
                                                                );
                                                            }}
                                                        >
                                                            <StatusBlock
                                                                id={
                                                                    i.rep_disp_id
                                                                }
                                                                status={
                                                                    i.rep_status
                                                                }
                                                            />
                                                        </div>
                                                    )
                                            )}
                                    </div>
                                </TabPane>
                            </Tabs>
                        </div>
                    </Card>
                    <Modal
                        className='landing-modal'
                        title="Create New Dashboard"
                        visible={isModalVisible}
                        //onOk={handleOk} 
                        onCancel={handleCancel}
                        // footer={[
                        //     <Button style={{ backgroundColor: '#093185', color: 'white', borderRadius: '4px' }} onClick={() =>
                        //         handleOk()
                        //     }>Let's Go!</Button>
                        // ]}
                        footer={false}
                    >
                        <div>
                            <Row>
                                <Col span={12}>
                                    <img src={Banner} />
                                </Col>
                                <Col span={12}>
                                    <Row>
                                        <p>Select a report to get started</p>
                                        <Input.Search
                                            onSearch={onSearch}
                                            placeholder='Search by report ID or name'
                                        // onChange={(e) => setHierarchyName(e.target.value)}
                                        // value={hierarchyName}
                                        />
                                    </Row>
                                    <div className="landing-tiles">
                                        {reportList &&
                                            reportList.length > 0 &&
                                            reportList.map(
                                                (i, index) =>
                                                    index < 4 && (
                                                        <div
                                                            onClick={() => {
                                                                getLoadReportGenerator(
                                                                    i.rep_disp_id
                                                                );
                                                            }}
                                                        >
                                                            <div className="landing-tile" >
                                                                <div className="landing-report-id"> {i.rep_disp_id}</div><br />
                                                                <span className="landing-report-name">{i.rep_name}</span>
                                                                {/* {i.id}<br />
                                                                     */}
                                                            </div>
                                                        </div>
                                                    )
                                            )}
                                    </div>
                                    {newsearched ? (
                                        <Table
                                            columns={columns}
                                            scroll={{ y: 150, x: 350 }}
                                            // style={{  height: 'auto' }}
                                            dataSource={
                                                filterTable === null
                                                    ? reportList
                                                    : filterTable
                                            }
                                            pagination={false}
                                            onRow={(record) => ({
                                                onClick: (e) => {
                                                    // record['color'] = '#D3D3D3'
                                                    // setReportId(record.rep_disp_id)
                                                    // getReportData(record.rep_disp_id, record.rep_status)
                                                    // dispatch(showLoader())
                                                    NewReportGenerator(
                                                        record.rep_disp_id
                                                    );
                                                    // onOk()
                                                },
                                            })}
                                        />
                                    ) : (
                                        <></>
                                    )}


                                </Col>

                                <Button style={{ backgroundColor: '#093185', color: 'white', borderRadius: '4px', marginLeft: '88%', marginTop: '70px' }}
                                    onClick={() => {
                                        history.push({
                                            pathname:
                                                '/dashboard/report_generator',
                                        });
                                    }}
                                >Let's Go!</Button>
                            </Row>
                        </div>

                    </Modal>
                </div>
            </div>

        </div>
    );
}
