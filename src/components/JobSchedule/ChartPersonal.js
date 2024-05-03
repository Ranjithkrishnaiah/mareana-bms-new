import React, { useEffect, useState } from 'react';
import './style.scss';
//antd imports
import { Card, Row, Col, Button, Menu, Dropdown, message, Modal, Tabs } from 'antd';
import { ArrowLeftOutlined, CloudUploadOutlined, MoreOutlined, DesktopOutlined, ArrowRightOutlined } from '@ant-design/icons';
//components
import LandingPage from './landingPage/LandingPage';
import ViewPage from './viewPage/ViewPage';
//cjson object
import chartJson from './viewPage/chartObj.json';
//services
import { saveChartPlotData } from '../../../../services/chartPersonalizationService';
//react-redux
import { useDispatch } from 'react-redux';
import { showLoader, hideLoader } from '../../../../duck/actions/commonActions';
//schedule-alert table
import AlertTable from './scheduled-alerts/scheduledAlertsTable';
//alert evaluation
import AlertEvaluation from './scheduled-alerts/alertEvaluation';


const { TabPane } = Tabs;
//main component
const ChartPersonal = () => {
    //state for showing view page or landing page
    const [showView, setShowView] = useState(false);
    //for showing schedule alert modal
    const [alertModal, setAlertModal] = useState(false);
    //state for chart json data
    const [postChartData, setPostChartData] = useState(chartJson);


    const dispatch = useDispatch();
    //function to back to landing page
    const onBackArrowClick = () => {
        setShowView(false);
    }

    //function for saving chart data
    const saveAs = async () => {
        const obj = {
            ...postChartData,
            savetype: 'saveas'
        }
        const postData = JSON.parse(JSON.stringify(postChartData))
        let access = false;
        postData.data.forEach(element => {
            if (element.chart_name === '') {
                message.error("Chart name required")
                access = true;

                return;
            }
            if (element.chart_description === '') {
                message.error("Chart description required")
                access = true;

                return;
            }
        });
        if (access) {
            return false;
        }
        try {
            dispatch(showLoader());
            const viewRes = await saveChartPlotData(obj);
            const newArr = [...postChartData.data];
            newArr.forEach(element => {
                element.chart_id = viewRes.chart_id;
                element.chart_version = viewRes.chart_version;
                element.chart_status = viewRes.chart_status;
            })
            setPostChartData({ ...postChartData, data: newArr })
            message.success('Chart created successfully');

            dispatch(hideLoader());
        } catch (error) {
            dispatch(hideLoader());
            message.error('Chart creation failed');
        }
    }

    //menu for dropdown
    const menu = (
        <Menu>
            <Menu.Item onClick={saveAs}>Save As</Menu.Item>
            <Menu.Item>Share</Menu.Item>
        </Menu>
    );

    const handleOk = () => {

    }
    const handleCancel = () => {
        setAlertModal(false)
    }

    return (
        <div className='custom-wrapper'>
            <div className='sub-header'>
                <div className='sub-header-title'>
                    <ArrowLeftOutlined className='header-icon' onClick={onBackArrowClick} /> &nbsp;
                    <span className='header-title'>Process Control Charts</span>
                </div>
                {showView && <div className='btns'>
                    <Button onClick={() => setAlertModal(true)}>Schedule Alert</Button>
                    <Button>Save</Button>
                    <Button> <CloudUploadOutlined />
                        Publish</Button>
                    <Dropdown overlay={menu}>
                        <MoreOutlined />
                    </Dropdown>
                </div>}
            </div>
            <div className='custom-content-layout'>
                {!showView && <LandingPage showView={showView} setShowView={setShowView} />}
                {showView && <ViewPage showView={showView} setShowView={setShowView} postChartData={postChartData} setPostChartData={setPostChartData} />}
            </div>
            <Modal title="Schedule Alert" className='schedule-modal' visible={alertModal} onCancel={handleCancel} footer={false} width={1300} >
                <Tabs tabPosition='left' className='schedule-menu'>
                    <TabPane tab={
                        <span style={{ color: 'white' }}>
                            <DesktopOutlined />
                            Alerts
                        </span>
                    }
                        key="1">
                        <AlertEvaluation />
                    </TabPane>
                    <TabPane tab={
                        <span style={{ color: 'white' }}>
                            <DesktopOutlined />
                            Schedule Alerts
                        </span>
                    } key="2">
                        <div className='schedule-alerts'>
                            <div className='alerts-text'>
                                <p className='alert-title'>Scheduled Alerts</p>
                                <span className='alert-arrow'><p ><a style={{backgroundColor:'#093185'}}>View More Details</a></p><ArrowRightOutlined style={{ marginLeft: '10px', color: '#093185' }} /></span>
                            </div>
                            <div>
                                <AlertTable />
                            </div>
                        </div>
                    </TabPane>

                </Tabs>


            </Modal>
        </div>

    )
}

export default ChartPersonal