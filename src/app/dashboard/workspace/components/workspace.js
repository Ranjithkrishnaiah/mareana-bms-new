import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import { Card, Input, Space, Avatar, Row, Col, Tabs, Divider, Empty } from 'antd';
import illustrations from '../../../../assets/images/Group 33808.svg';
import DeviationTable from './deviationTable/deviationTable';
import DataQuality from './dataQuality/dataQuality';
import Chart from './chartComponent/chartComponent';
import {
  BellOutlined,
  LayoutOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import {
  hideLoader,
  showLoader,
  showNotification,
} from '../../../../duck/actions/commonActions';
import { getCountData } from '../../../../services/workFlowServices';
import { getChartExceptionData, getUpdatedChartsViewsData } from '../../../../services/workSpaceServices';
import {getJob} from '../../../../services/jobScheduleService';
import { FaCircle } from "react-icons/fa";
import './styles.scss';

const { Search } = Input;
const { TabPane } = Tabs;

const Workspace = () => {
  const [resultDate, setResultDate] = useState('');
  const [tilesData, setTilesData] = useState([]);
  const [userApproval, setUserApproval] = useState([]);
  const [chartIdException, setChartIdException] = useState([]);
  const [lastupdatedCharts, setLastUpdatedCharts] = useState([]);
  const [lastupdatedViews, setLastUpdatedViews] = useState([]);
  const [scheduleChartAlerts, setScheduleChartAlerts] = useState([]);
  const [scheduleReportAlerts, setScheduleReportAlerts] = useState([]);
  const [activeTab, setActiveTab] = useState('');
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    updateDate();
    getTilesData();
    getChartId();
    lastUpdatedChartsViews();
    getScheduleChartAlertsData();
    getScheduleReportAlertsData();
  }, []);

  //get todays date
  const updateDate = () => {
    const date = new Date();
    const month = date.toLocaleString('default', { month: 'long' });
    const latestDate = date.getDate();
    const year = date.getFullYear();
    const resultDate = month + ' ' + latestDate + ',' + ' ' + year;
    setResultDate(resultDate);
  };

  //workflow approval card function
  const getTilesData = async () => {
    let req = {};
    try {
      dispatch(showLoader());
      const tilesResponse = await getCountData(req);
      setTilesData(tilesResponse['Data']);
      setUserApproval(tilesResponse['counts'])
      dispatch(hideLoader());
    } catch (error) {
      dispatch(hideLoader());
      dispatch(showNotification('error', error.message));
    }
  };

  //job scheduling chart alert counts
  const getScheduleChartAlertsData = async () => {
    let login_response = JSON.parse(localStorage.getItem('login_details'));
    let req = {
      app_type:'CHART'
    };
    let headers = {
      'content-type': 'application/json',
      'x-access-token': login_response.token ? login_response.token : '',
      'resource-name': 'WORKITEMS',
  };
    try {
      dispatch(showLoader());
      const alertResponse = await getJob(req,headers);
      setScheduleChartAlerts(alertResponse.Data)
      dispatch(hideLoader());
    } catch (error) {
      dispatch(hideLoader());
      dispatch(showNotification('error', error.message));
    }
  };

   //job scheduling chart alert counts
   const getScheduleReportAlertsData = async () => {
    let login_response = JSON.parse(localStorage.getItem('login_details'));
    let req = {
      app_type:'REPORT'
    };
    let headers = {
      'content-type': 'application/json',
      'x-access-token': login_response.token ? login_response.token : '',
      'resource-name': 'WORKITEMS',
  };
    try {
      dispatch(showLoader());
      const alertResponse = await getJob(req,headers);
      setScheduleReportAlerts(alertResponse.Data)
      dispatch(hideLoader());
    } catch (error) {
      dispatch(hideLoader());
      dispatch(showNotification('error', error.message));
    }
  };


  //top 5 charts with exception function
  const getChartId = async () => {
    let req = { limit: 5, username: localStorage.getItem('user') }
    try {
      dispatch(showLoader());
      const chartIdResponse = await getChartExceptionData(req);
      setChartIdException(chartIdResponse.Data);
      setActiveTab(chartIdResponse.Data[0]?.chart_disp_id + '_' + chartIdResponse.Data[0]?.chart_version)
      dispatch(hideLoader());
    } catch (error) {
      dispatch(hideLoader());
      dispatch(showNotification('error', error.Message));
    }
  }

  //last updated views and chart function
  const lastUpdatedChartsViews = async () => {
    let req = { limit: 5 }
    try {
      dispatch(showLoader());
      const chartResponse = await getUpdatedChartsViewsData(req);
      setLastUpdatedCharts(chartResponse.last_created_or_changed_charts);
      setLastUpdatedViews(chartResponse.last_created_or_changed_views);
      dispatch(hideLoader());
    } catch (error) {
      dispatch(hideLoader());
      dispatch(showNotification('error', error.Message));
    }
  }

  //changing of tabs
  const changeTab = activeKey => {
    setActiveTab(activeKey);
  };

  //changing tiles color
  const statusColor = (status) => {
    if (status == 'APRD') {
      return 'aprd'
    }
    if (status == 'DRFT') {
      return 'drft'
    }
    if (status == 'AWAP') {
      return 'awap'
    }
  }
  return (
    <div className='custom-wrapper'>
      <div className='workspace-subheader'>
        <Search
          placeholder='Search'
          allowClear
          //onSearch={ }
          style={{ width: 304 }}
        />
        <BellOutlined style={{ margin: '0px 25px', fontSize: '20px' }} />
        <div>
          <Avatar style={{ backgroundColor: 'orange' }}>
            {localStorage.getItem('username') && localStorage.getItem('username').split('')[0].toUpperCase()}{' '}
          </Avatar>
          <span style={{ padding: '0px 10px' }}>
            {localStorage.getItem('username')}
          </span>
        </div>
      </div>
      <div className='custom-content-layout'>
        <Card className='workspace_head'>
          <div>
            <p className='workspace-username'>
              Howdy {localStorage.getItem('username')}! Good Morning
            </p>
            <p className='workspace-text'>
              Let's see what you have on your plate today!
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
            <img src={illustrations} className='workspace-illustration' />
          </div>
          <div>
            <span className='workspace-resultdate'>{resultDate}</span>
          </div>
        </Card>
        <div className='workspace-wrapper'>
          <div className='workspace-main-block'>
            <div className='workspace-innerColumn'>
              <div className='workspace-card1'>
                <div className='innercard'>
                  <LayoutOutlined
                    style={{ color: '#0CE7CC', fontSize: '15px' }}
                  />
                  <span className='deviation-text'> Workflow Approvals</span>
                  <span style={{ float: 'right' }}>
                    <ArrowRightOutlined
                      style={{ color: '#0CE7CC', fontSize: '15px' }}
                    />
                    <a
                      className='workspace-review'
                      onClick={() => history.push('/dashboard/workflow')}
                    >
                      Review
                    </a>
                  </span>

                  <Row gutter={4}>
                    {tilesData?.filter(el => el.item_count > 0).map((item, index) => {
                      return (
                        <Col className='gutter-row' span={4}>
                          {item.item_count > 0 && (
                            <div style={{ marginTop: '15px' }} key={index}>
                              <p className='approval-text'>
                                {item.text.split(' ')[0]}
                              </p>
                              <p className='approval-count'>
                                {item.item_count}
                              </p>
                            </div>
                          )}
                        </Col>
                      );
                    })}
                  </Row>
                </div>
                <div className='avatar-block'>
                  <p>{`${userApproval?.length} People awaiting your approval!`} </p>
                  <Avatar.Group
                    maxCount={4}
                    maxStyle={{
                      color: '#0CE7CC',
                      backgroundColor: '#fde3cf',
                    }}
                  >
                    {userApproval.length > 0 && userApproval.map((e, j) => {
                      return (
                        <Avatar
                          style={{
                            backgroundColor: '#0CE7CC',
                          }}
                        >
                          {e.created_by.split("")[0].toUpperCase()}
                        </Avatar>
                      )
                    })}
                    {/* <Avatar
                      style={{
                        backgroundColor: '#0CE7CC',
                      }}
                    >
                      A
                    </Avatar>
                    <Avatar
                      style={{
                        backgroundColor: '#0CE7CC',
                      }}
                    >
                      B
                    </Avatar>
                    <Avatar
                      style={{
                        backgroundColor: '#0CE7CC',
                      }}
                    >
                      C
                    </Avatar>
                    <Avatar
                      style={{
                        backgroundColor: '#0CE7CC',
                      }}
                    >
                      D
                    </Avatar>
                    <Avatar
                      style={{
                        backgroundColor: '#0CE7CC',
                      }}
                    >
                      E
                    </Avatar> */}
                  </Avatar.Group>
                </div>
              </div>
              <div className='workspace-card2'>
                <div className='innercard'>
                  <LayoutOutlined
                    style={{ color: '#0CE7CC', fontSize: '15px' }}
                  />
                  <span className='deviation-text'>Paper Batch Records</span>
                  <span style={{ float: 'right' }}>
                    <ArrowRightOutlined
                      style={{ color: '#0CE7CC', fontSize: '15px' }}
                    />
                    <a
                      onClick={() => console.log('PBR')}
                      className='workspace-review'
                    >
                      View All
                    </a>
                  </span>
                  <div className='paper-batch-card'>
                    <p className='paper-batch-count'>5</p>
                    <p className='paper-batch-desc'>
                      New paper batch records are awaiting your approval!
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className='workspace-chart'>
              <div className='innercard'>
                <LayoutOutlined
                  style={{ color: '#0CE7CC', fontSize: '15px' }}
                />
                <span className='deviation-text'>Process Control Charts</span>
                <div>
                  <Tabs
                    className='workspace-tabs'
                    activeKey={activeTab}
                    onChange={changeTab}
                  >
                    {chartIdException.map((el, i) => {
                      return (
                        <TabPane tab={el.chart_disp_id} key={`${el.chart_disp_id}_${el.chart_version}`}>
                          <Chart chartId={el.chart_disp_id} chartVersion={el.chart_version} activeTab={activeTab} current_tab={`${el.chart_disp_id}_${el.chart_version}`} />
                        </TabPane>
                      )
                    })}
                    {/* <TabPane tab='Chart ID 1009' key='1'>
                      <p>content 1</p>
                    </TabPane> */}
                  </Tabs>
                </div>
              </div>
            </div>
            <div className='workspace-innerColumn'>
              <div className='workspace-card2'>
                <div className='innercard'>
                  <LayoutOutlined
                    style={{ color: '#0CE7CC', fontSize: '15px' }}
                  />
                  <span className='deviation-text'>Report Alerts</span>
                  <span style={{ float: 'right' }}>
                    <ArrowRightOutlined
                      style={{ color: '#0CE7CC', fontSize: '15px' }}
                    />
                    <a
                      href="https://bms-cpvdev.mareana.com/airflow/login/?next=https%3A%2F%2Fbms-cpvdev.mareana.com%2Fairflow%2Fhome"
                      target="_blank"
                      className='workspace-review'
                    >
                      View All
                    </a>
                  </span>
                  <div className='paper-batch-card'>
                    <p className='paper-batch-count'>{scheduleReportAlerts.length>0?scheduleReportAlerts.length:0}</p>
                    <p className='paper-batch-desc'>
                      of your report alerts configured
                    </p>
                  </div>
                </div>
              </div>
              <div className='workspace-card2'>
                <div className='innercard'>
                  <LayoutOutlined
                    style={{ color: '#0CE7CC', fontSize: '15px' }}
                  />
                  <span className='deviation-text'>Process Control Chart Alerts</span>
                  <span style={{ float: 'right' }}>
                    <ArrowRightOutlined
                      style={{ color: '#0CE7CC', fontSize: '15px' }}
                    />
                    <a
                      href="https://bms-cpvdev.mareana.com/airflow/login/?next=https%3A%2F%2Fbms-cpvdev.mareana.com%2Fairflow%2Fhome"
                      target="_blank"
                      className='workspace-review'
                    >
                      View All
                    </a>
                  </span>
                  <div className='paper-batch-card'>
                    <p className='paper-batch-count'>{scheduleChartAlerts.length>0?scheduleChartAlerts.length:0}</p>
                    <p className='paper-batch-desc'>
                      charts configured with alerts
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='workspace-outerColumn'>
            <div className='workspace-table1'>
              <div className='innercard'>
                <LayoutOutlined
                  style={{ color: '#0CE7CC', fontSize: '15px' }}
                />
                <span className='deviation-text'> Recent Deviations</span>
                <DeviationTable />
              </div>
            </div>
            <div className='workspace-table2'>
              <div className='innercard'>
                <LayoutOutlined
                  style={{ color: '#0CE7CC', fontSize: '15px' }}
                />
                <span className='deviation-text'> Data Quality</span>
                <DataQuality />
              </div>
            </div>
          </div>
        </div>
        <div className='workspace-recent'>
          <div className='recentcard'>
            <LayoutOutlined
              style={{ color: '#0CE7CC', fontSize: '15px' }}
            />
            <span className='deviation-text'>Recently Approved Creations</span>
            <div className="workspace-legend">
              <span>
                <FaCircle style={{ color: '#363636' }} />  {" "}
                Draft
              </span>
              <span style={{ margin: '0px 15px' }}>
                <FaCircle style={{ color: '#F7BB61' }} />  {" "}
                Awaiting Approval
              </span>
              <span>
                <FaCircle style={{ color: '#A4F588' }} />  {" "}
                Approved
              </span>
            </div>
            <Row>
              <Col span={11}>
                <div className='workspace-processChart-main'>
                  <p className='workspace-processCharts'>Process Control Charts</p>
                  <Row gutter={[6, 12]}>
                    {lastupdatedCharts.length > 0 ? lastupdatedCharts.map((j, k) => {
                      return (
                        <Col className='gutter-row' span={8}>

                          <div className='workspace-processChart-card' onClick={() => history.push(`/dashboard/chart_personalization?id=${j.chart_disp_id}&version=${j.chart_version}`)}>
                            <div className={`tile-status ${statusColor(j.chart_status)}`} >{j.chart_status}</div>
                            <p className='workspace-processCharts-id'>
                              {j.chart_disp_id}
                            </p>
                            <p className='workspace-processCharts-name'>
                              {j.chart_name}
                            </p>

                          </div>

                        </Col>
                      )
                    }) :
                      (
                        <Empty
                          className='empty-workspace'
                          description={
                            <span>
                              Nothing to see here
                            </span>
                          } />
                      )}
                  </Row>
                </div>
              </Col>
              <Col span={1}>
                <Divider type="vertical" style={{ height: "100%", border: '-0.9px solid #CACACA' }} />
              </Col>
              <Col span={11}>
                <div className='workspace-processView-main'>
                  <p className='workspace-processView'>Views</p>
                  <Row gutter={[6, 12]}>
                    {lastupdatedViews.length > 0 ? lastupdatedViews.map((m, n) => {
                      return (
                        <Col className='gutter-row' span={8}>
                          <div className='workspace-processView-card' onClick={() => history.push(`/dashboard/view_creation?id=${m.view_disp_id}&version=${m.view_version}&fromScreen=Workspace`)}>
                            <div className={`tile-status ${statusColor(m.view_status)}`} >{m.view_status}</div>
                            <p className='workspace-processView-id'>
                              {m.view_disp_id}
                            </p>
                            <p className='workspace-processView-name'>
                              {m.view_name}
                            </p>

                          </div>

                        </Col>
                      )
                    }) : (
                      <Empty
                        className='empty-workspace'
                        description={
                          <span>
                            Nothing to see here
                          </span>
                        } />
                    )}

                  </Row>
                </div>
              </Col>
            </Row>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Workspace;
