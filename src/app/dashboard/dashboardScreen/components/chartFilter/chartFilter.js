import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Input, Select, Switch, DatePicker, Button } from 'antd';
import ChartTable from '../landingPage/chartTableLoad';
import SelectField from '../../../../../components/SelectField/SelectField';
import InputField from '../../../../../components/InputField/InputField';
import moment from 'moment';
import './styles.scss';

export default function chartFilter(props) {
    const { Search } = Input;
    const [chartSearch, setChartSearch] = useState(false);
    const[searchTableData,setSearchTableData]=useState(props.rawTableData);
    const [viewData, setViewData] = useState({ chartName: '', status: '', chartDispId: '', searchValue: props?.chartId, chartVersion: 0 });
    const ref = useRef(null);
    useEffect(() => {
        document.addEventListener('mousedown', closeTableView);
    }, [])
    const focus = () => {
        setChartSearch(true);
    }
    const onFocusRemove = (value) => {
        setChartSearch(value);
    }
    const closeTableView = (e) => {
        if (ref.current && !ref.current.contains(e.target)) {
            setChartSearch(false);

        }
    }

       //function to handle search
       const searchTable = (value) => {
        const filterData = props.rawTableData.filter((o) =>
            Object.keys(o).some((k) =>
                String(o[k]).toLowerCase().includes(viewData.searchValue.toLowerCase())
            )
        );
        setSearchTableData(filterData)
    };

    //on search value changes
    const onSearchChange = (e) => {
        if (e.target.value === '') {
            setSearchTableData(props.rawTableData);
        }
        setViewData({ ...viewData, searchValue: e.target.value });
    }

    console.log("propssss",props.typeChartValue)

    return (
        <div style={{ padding: '12px 18px' }}>
            <Row gutter={[16, 24]}>
                <Col className="gutter-row" span={8}>
                    <SelectField
                        label='Type of Charts'
                        placeholder='Select Charts'
                        selectedValue={props.typeChartValue}
                        onChangeSelect={props.onChangeTypeCharts}
                        selectList={props.typeOfChartsOptions} />
                </Col>
                <Col className="gutter-row" span={16} ref={ref}>
                    <p className='import-chart'>Import chart</p>
                    <Search placeholder="Search"
                        onFocus={focus}
                        value={viewData.searchValue}
                        onChange={onSearchChange}
                        onSearch={searchTable} />
                    {chartSearch && <ChartTable style={{ position: 'absolute', zIndex: 999 }}
                        searchTableData={searchTableData}
                        viewData={viewData}
                        setViewData={setViewData}
                        setChartSearch={onFocusRemove}
                        parentCallback={props.searchCallback}
                     />}
                </Col>
            </Row>
            <Row gutter={[16, 24]} style={{ marginTop: '20px' }}>
                <Col className="gutter-row" span={8}>
                    <div className='show-data'>
                        <p style={{ color: '#777777' }}>Show Unapproved data</p>
                        <Switch type='primary' size='small' checked={props.checked} onChange={props.checkboxChange} />

                    </div>
                </Col>
                <Col className="gutter-row" span={6}>
                    <SelectField
                        placeholder='Site'
                        onChangeSelect={props.onSiteChange}
                        selectedValue={props.siteValue}
                        selectList={props.siteOption} />

                </Col>
                <Col className="gutter-row" span={5}>
                    <DatePicker
                        value={props.dateRange.split("/")[0]?moment(props.dateRange.split("/")[0],"YYYY-MM-DD"):''}
                        onChange={props.onInnerStart}
                    />
                </Col>
                <Col className="gutter-row" span={5}>
                    <DatePicker 
                    value={props.dateRange.split("/")[1]?moment(props.dateRange.split("/")[1],"YYYY-MM-DD"):''} 
                    onChange={props.onInnerEnd} />
                </Col>
            </Row>
            <Row style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                <Col>
                    <Button className= 'show-preview-btns'onClick={props.showPreview}
                    >Show preview
                    </Button>
                </Col>
            </Row>

        </div>
    )
}
