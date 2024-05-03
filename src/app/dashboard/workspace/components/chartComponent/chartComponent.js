import React, { useEffect, useState } from 'react';
import { Alert } from 'antd';
import { useDispatch } from 'react-redux';
import Plot from 'react-plotly.js';
import { getChartPlotData } from '../../../../../services/workSpaceServices';
import {
    hideLoader,
    showLoader,
    showNotification,
} from '../../../../../duck/actions/commonActions';
import './styles.scss';
import 'antd/dist/antd.css';

const chartComponent = (props) => {
    const [workspaceChartData, setWorkSpaceChartData] = useState([]);
    const [workspaceChartLayout, setWorkSpaceChartLayout] = useState([]);
    const [workspaceChartLayoutXAxis, setWorkSpaceChartLayoutXAxis] = useState([]);
    const [workspaceChartLayoutYAxis, setWorkSpaceChartLayoutYAxis] = useState([]);
    const dispatch = useDispatch();
    useEffect(() => {
        if (props.activeTab == props.current_tab) {
            getChartData();
        }
    }, [props.activeTab])

    const getChartData = async () => {
        let req = { chartId: props.chartId }
        let login_response = JSON.parse(localStorage.getItem('login_details'));
        let headers={
                'content-type': 'application/json',
                'x-access-token': login_response.token ? login_response.token : '',
                'resource-name': 'WORKITEMS',
        }
        try {
            dispatch(showLoader());
            const chartResponse = await getChartPlotData(req,headers);
            setWorkSpaceChartData(chartResponse.data[0].data);
            setWorkSpaceChartLayout(chartResponse.data[0].layout)
            setWorkSpaceChartLayoutXAxis(chartResponse.data[0].layout.xaxis)
            setWorkSpaceChartLayoutYAxis(chartResponse.data[0].layout.yaxis)
            dispatch(hideLoader());
        } catch (error) {
            dispatch(hideLoader());
            dispatch(showNotification('error', error.Message));
        }
    }
    const layout = {
        xaxis: workspaceChartLayoutXAxis,
        yaxis: workspaceChartLayoutYAxis,
        autosize: false,
        width: 800,
        height: 300,
        // margin: {
        //     l: 50,
        //     r: 50,
        //     b: 75,
        //     t: 30,
        //     pad: 4
        // },
        title: {
            text: ""
        }
    };
    console.log(workspaceChartData);
    return (
        <div className='workspace-plot'>
            <Plot
                data={workspaceChartData}
                layout={layout}
            />
            <Alert
                style={{marginTop:'-10px'}}
                message="Alert"
                description={`The voilation of [action] has triggered an alert for Chart ID ${props.chartId}`}
                type="warning"
                showIcon
            />
        </div>
    )
}

export default chartComponent;