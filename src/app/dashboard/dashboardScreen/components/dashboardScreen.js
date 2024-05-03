import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router';
import BreadCrumbWrapper from '../../../../components/BreadCrumbWrapper';
import { useDispatch } from 'react-redux';
import { showLoader, hideLoader, showNotification } from '../../../../duck/actions/commonActions';
import { getChartList } from '../../../../services/chartPersonalizationService';
import { getChartPlotData } from '../../../../services/workSpaceServices';
import { saveDashboardData } from '../../../../services/dashboardServices';
import InputField from '../../../../components/InputField/InputField';
import { Button,Modal } from 'antd';
import LandingPage from './landingPage/landingPage';
import ChartPage from './viewChart/viewChart';
import queryString from "query-string";
import { ShareAltOutlined ,ExclamationCircleOutlined,CheckCircleOutlined} from '@ant-design/icons';
import './styles.scss';

const DashboardScreen = () => {
    const dispatch = useDispatch();
    const location = useLocation()
    //to show landing page
    const [showChartCard, setShowChartCard] = useState(false);
    //to create the dashboard name
    const [dashboardName, setdashboardName] = useState('');
    const [dashboardId, setDashboardId] = useState('');
    const [dashboardVersion, setDashboardVersion] = useState('');
    //serach table data
    const [searchTableData, setSearchTableData] = useState([]);
    const [rawTableData, setRawTableData] = useState([]);
    const [viewData, setViewData] = useState({ chartName: '', status: '', chartDispId: '', searchValue: '', chartVersion: 0 });
    const searchData = useRef([]);
    const ref = useRef();
    const [landingChartData, setLandingChartData] = useState([]);
    const [landingChartLayout, setLandingChartLayout] = useState([]);
    const [landingChartLayoutX, setLandingChartLayoutX] = useState([]);
    const [landingChartLayoutY, setLandingChartLayoutY] = useState([]);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [saveType, setSaveType] = useState('');

    //for creating new dashboard name
    const settingDashboardName = (value) => {
        setdashboardName(value);
    }
    const onBackArrowClick = () => {
        //setShowDashboard(false);
    }

    const chartCard = (value) => {
        setShowChartCard(value)
    }

    useEffect(() => {
        getTableData();
        idFromUrl();

    }, [])

    useEffect(() => {
        console.log(viewData)
        if (viewData.chartDispId != '') {
            getChartData();
        }

    }, [viewData.chartDispId])


    //get table data
    const getTableData = async () => {
        let req = { chart_status: 'ALL' };
        let login_response = JSON.parse(localStorage.getItem('login_details'));
        let headers = {
            'content-type': 'application/json',
            'x-access-token': login_response.token ? login_response.token : '',
            'resource-name': 'DASHBOARD',
        };
        let antdDataTable = [];

        try {
            dispatch(showLoader());
            const viewRes = await getChartList(req,headers);
            viewRes.data.forEach((item, key) => {
                let antdObj = {};
                antdObj['key'] = key;
                antdObj['created_by'] = item.created_by;
                antdObj['chart_disp_id'] = item.chart_disp_id;
                antdObj['chart_name'] = item.chart_name;
                antdObj['chart_status'] = item.chart_status;
                antdObj['chart_version'] = item.chart_version;
                antdObj['chart_info'] = item.chart_info;
                antdDataTable.push(antdObj);
            });
            searchData.current = JSON.parse(JSON.stringify(antdDataTable));
            setSearchTableData(antdDataTable);
            setRawTableData(JSON.parse(JSON.stringify(antdDataTable)));
            dispatch(hideLoader());
        } catch (error) {
            dispatch(hideLoader());
            dispatch(showNotification('error', error.message));
        }
    };

    //function to handle search
    const searchTable = (value) => {
        const filterData = searchData.current.filter((o) =>
            Object.keys(o).some((k) =>
                String(o[k]).toLowerCase().includes(viewData.searchValue.toLowerCase())
            )
        );
        setSearchTableData(filterData)
    };

    //on search value changes
    const onSearchChange = (e) => {
        if (e.target.value === '') {
            setSearchTableData(searchData.current);
        }
        setViewData({ ...viewData, searchValue: e.target.value });
    }

    //get chart data to plot 
    const getChartData = async () => {
        console.log(viewData);
        let login_response = JSON.parse(localStorage.getItem('login_details'));
        let req = { chartId: viewData.chartDispId }
        let headers = {
            'content-type': 'application/json',
            'x-access-token': login_response.token ? login_response.token : '',
            'resource-name': 'DASHBOARD',
        };
        try {
            dispatch(showLoader());
            const chartResponse = await getChartPlotData(req, headers);
            setLandingChartData(chartResponse.data[0].data);
            setLandingChartLayout(chartResponse.data[0].layout)
            setLandingChartLayoutX(chartResponse.data[0].layout.xaxis)
            setLandingChartLayoutY(chartResponse.data[0].layout.yaxis)
            dispatch(hideLoader());
        } catch (error) {
            dispatch(hideLoader());
            dispatch(showNotification('error', error.Message));
        }
    }

    const idFromUrl = () => {
        const params = queryString.parse(location.search);
        if (params.id) {
            setDashboardId(params.id);
            setDashboardVersion(params.version);
            setShowChartCard(true);
        } else {
            setDashboardId('')
            setShowChartCard(false);
        }

    }
    const layout = {
        xaxis: landingChartLayoutX,
        yaxis: landingChartLayoutY,
        autosize: false,
        width: 150,
        height: 50,
    };

    const chartLayout = {
        xaxis: landingChartLayoutX,
        yaxis: landingChartLayoutY,
        autosize: false,
        width: 580,
        height: 250,
        margin: {
            l: 60,
            r: 50,
            //b: 75,
            t: 10,
            pad: 4
        }
    }

    const handleSave = async (value) => {
        console.log(ref.current.getChildState());
        let json = ref.current.getChildState();
        let login_response = JSON.parse(localStorage.getItem('login_details'));
        let headers = {
            'content-type': 'application/json',
            'x-access-token': login_response.token ? login_response.token : '',
            'resource-name': 'DASHBOARD',
        }
        let req = {
            ...json,
            savetype: value?value:saveType
        }
        try {
            dispatch(showLoader());
            let res = await saveDashboardData(req, headers);
            console.log(res);
            if(res.statuscode==200){
                dispatch(hideLoader());
                dispatch(showNotification('success', `${json.dashboard_name} has been successfully saved`));
                setShowSaveModal(false);
            }else{
                dispatch(hideLoader());
                dispatch(showNotification('error', res.message));
                setShowSaveModal(false);
            }
           
        } catch (error) {
            dispatch(hideLoader());
            dispatch(showNotification('error', error.Message));
        }
        
    }
    const handleSavePopUp=(value)=>{
        setShowSaveModal(true);
        setSaveType(value);
    }

    const handleCancel = () => {
        setShowSaveModal(false);
    };
    const onChangeInputSaveAs=(e)=>{
        console.log(e.target.value);
       setdashboardName(e.target.value);
       
    }
    return (
        <div className='custom-wrapper'>
            {/* <BreadCrumbWrapper /> */}
            <div className='sub-header'>
                <BreadCrumbWrapper />
                {/* <div className='sub-header-title'>
                    <ArrowLeftOutlined className='header-icon' onClick={onBackArrowClick} /> &nbsp;
                    <span className='header-title'>Dashboard</span>
                </div> */}
                {showChartCard && <div className='btns'>
                    <Button onClick={()=>handleSavePopUp('saveAs')}>Save As</Button>
                    {dashboardId && <Button onClick={()=> {setSaveType('save');handleSave('save')}}>Save</Button>}
                    <ShareAltOutlined style={{ color: '#093185', fontSize: '18px' }} />
                </div>}
            </div>
            <div className='custom-content-layout'>

                {!showChartCard &&
                    <LandingPage
                        chartCard={chartCard}
                        dashboarNameFunction={settingDashboardName}
                        dashboardName={dashboardName}
                        searchTableData={searchTableData}
                        setSearchTableData={setSearchTableData}
                        searchTable={searchTable}
                        onSearchChange={onSearchChange}
                        searchData={searchData}
                        viewData={viewData}
                        setViewData={setViewData}
                        plotData={landingChartData}
                        plotLayout={layout}
                        idFromUrl={idFromUrl}


                    />}
                {showChartCard &&
                    <ChartPage
                        ref={ref}
                        dashboardName={dashboardName}
                        plotData={landingChartData}
                        plotLayout={chartLayout}
                        viewData={viewData}
                        searchTableData={searchTableData}
                        setSearchTableData={setSearchTableData}
                        searchTable={searchTable}
                        onSearchChange={onSearchChange}
                        searchData={searchData}
                        setViewData={setViewData}
                        dashboardId={dashboardId}
                        dashboardVersion={dashboardVersion}
                        getChartData={getChartData}
                        rawTableData={rawTableData}
                    />}
                        <Modal
                        className='dashboard-save'
                        title={<span><ExclamationCircleOutlined style={{ color: '#FAAD14', fontSize: '18px', marginRight:'15px' }}/>{saveType=='save'?'Save':'Save As'}</span>}
                        visible={showSaveModal} 
                        //onOk={handleOk} 
                        onCancel={handleCancel}
                        footer={[
                            <Button style={{border:'none'}}onClick={() =>
                                handleCancel()
                            }>Cancel</Button>,
                            <Button style={{ backgroundColor: '#093185', color: 'white', borderRadius: '4px' }} onClick={() =>
                                handleSave()
                            }>Save</Button>
                        ]}>
                        {saveType=='saveAs'&&(
                            <div>
                               <InputField
                                placeholder='Enter dashboard name'
                                label='Dashboard Name'
                                onChangeInput={(e) => onChangeInputSaveAs(e)}
                                value={dashboardName}
                            /> 
                            </div>
                        )}
                        
                        
                      </Modal>
                
            </div>
        </div>
    )
}

export default DashboardScreen