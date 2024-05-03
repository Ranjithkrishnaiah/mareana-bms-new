/**
 * @author Mihir Bagga <mihir.bagga@mareana.com>
 * @Mareana - CPV Product
 * @version 1
 * @Last Modified - 14 March, 2022
 * @Last Changed By - @Mihir 
 */
import './style.scss';
import React, { useState, useEffect } from 'react';
import {
    Typography
} from 'antd';
import { useSelector } from 'react-redux';

const { Text } = Typography

function ReportDesignerForm(props) {

    const repotData = useSelector(
        (state) => state.reportDesignerReducer.reportData
    );

    const [ReportData, setReportData] = useState(repotData)
    const [reportId, setReportId] = useState('')
    const [reportName, setReportName] = useState('')
    const [reportStatus, setReportStatus] = useState('')
    const [variantname, setVariantname] = useState('')
    const [viewId, setViewId] = useState('')

    useEffect(() => {
        unload(repotData)
    }, [repotData]
    );
    const unload = (ReportData) => {

        let user_details = localStorage.getItem('username')
        let user = user_details && user_details ? user_details : ''
        setReportId(ReportData['rep_disp_id'] ? ReportData['rep_disp_id'] : '')
        setReportName(ReportData['rep_name'] ? ReportData['rep_name'] : '')
        setReportStatus(ReportData['rep_status'] ? ReportData['rep_status'] : 'DRFT')

        if (ReportData['view_id-version']) 
        {
            let view_version = ReportData['view_id-version'] ? ReportData['view_id-version'] : ''
            if (view_version) 
            {
                let view_id = view_version[0]
                setViewId(view_id)
            }
        }
        else 
        {
            if (ReportData['view_disp_id'])
                setViewId(ReportData['view_disp_id'] && ReportData['view_version'] ? ReportData['view_disp_id'] + '-' + ReportData['view_version'] : '')
            else
                setViewId(ReportData['view_id'] && ReportData['view_id'] ? ReportData['view_id'] : '')
        }

        setVariantname(ReportData['variant_name'] ? ReportData['variant_name'] : user + '_variant')
    }

    return (
        <div className="generator-header">
            <div className="header-value">
                Report ID : {reportId}
            </div>
            <div className="header-value">
                Report Name : {reportName}
            </div>
            <div className="header-value">
                Variant : {variantname}
            </div>
            <div className="header-value">
                View : {viewId}
            </div>
            <div className="header-value">
                Status : {reportStatus}
            </div>
        </div>
    );
}

export default ReportDesignerForm;
