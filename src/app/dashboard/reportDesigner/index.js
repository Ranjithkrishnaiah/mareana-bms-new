import React, { useEffect, useState } from 'react';
import DesignCharts from './components/reportDesignerNew';
import ReportGenerator from '../reportGenerator/components/reportGenerator';
import { useSelector, useDispatch } from 'react-redux';
import Landing from './components/reportLanding';
import queryString from "query-string";
import { useLocation } from 'react-router';



function Report() {
    const screen = useSelector((state) => state.reportDesignerReducer.screen)
    const [screenChange, setScreenChange] = useState(false)
    const [getData, setData] = useState({})
    const [isParam, setIsParam] = useState(false)
    const location = useLocation()


    const changeScreen = () => {
        setScreenChange(true)
    }

    const getReportData = (data) => {
        setData(data)
    }
    useEffect(() => {
        const params = queryString.parse(location.search);
        if (Object.keys(params).length > 0) {
            {
                setIsParam(true)
            }
        }
    }, [])
    return (
        <div>
            {!screenChange && !isParam ? <Landing changeScreen={changeScreen} getReportData={getReportData} /> :
                <> {screen ?
                    <div><ReportGenerator  screenChange={screenChange}/></div> :
                    <div><DesignCharts loadData={getData} /></div>

                } </>}


        </div>
    )
}
export default Report;
