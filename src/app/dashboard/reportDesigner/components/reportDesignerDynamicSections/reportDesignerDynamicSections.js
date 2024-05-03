import React, { useEffect, useState } from 'react';
import { Form, Input, Space, Popconfirm, Card } from 'antd';
import { CheckCircleOutlined, DeleteTwoTone, PlusOutlined, EditOutlined } from '@ant-design/icons';
import './styles.scss';
import ReportDesignerDynamicRow from './reportDesignerDynamicRow/reportDesignerDynamicRow';
import Chart from '../reportChart/chartComponent/chartComponent'
import { showLoader, hideLoader } from '../../../../../duck/actions/commonActions';
import { useDispatch } from 'react-redux';



function ReportDesignerDynamicSections(props) {

    useEffect(() => {
        LoadData()
    })

    const dispatch = useDispatch();
    const [addedCharts, setAddedCharts] = useState(props.chart_layout ? props.chart_layout : {})
    const [addedKeys, setAddedKeys] = useState({})
    const [chartList, setChartList] = useState([])
    const [showChart, setShowChart] = useState({})
    const [showAddSection, setShowAddSection] = useState(false)
    const [editable, setEditable] = useState(false)

    const { list } = props;



    const deleteChart = (chartName, section) => {

        dispatch(showLoader())
        section = section + 1
        let chart_index = addedCharts[`${section}`].indexOf(chartName)
        if (chart_index > -1) {
            addedCharts[`${section}`].splice(chart_index, 1)  // 2nd parameter means remove one item only
        }
        dispatch(hideLoader())
    }

    const handleEdit = (value) => {
        setEditable(!value)
    }

    const addChart = (chartName, section) => {

        dispatch(showLoader())
        section = section + 1
        if (`${section}` in addedCharts) {
            addedCharts[`${section}`].push(chartName)
            setAddedCharts(addedCharts)
            dispatch(hideLoader())
        }
        else {
            if (addedCharts && !addedCharts[`${section}`]) {
                addedCharts[`${section}`] = []
                addedCharts[`${section}`].push(chartName)
                setAddedCharts(addedCharts)
                dispatch(hideLoader())
            }
            else {
                addedCharts[`${section}`].push(chartName)
                setAddedKeys(addedCharts)
            }
            dispatch(hideLoader())
        }
        props.setSectionCharts(chartName, addedCharts)

    }

    const sectionAddKey = (section) => {

        dispatch(showLoader())
        section = section - 1
        if (`${section}` in addedKeys) {
            if (addedKeys[`${section}`]) {
                addedKeys[`${section}`] = false
                setAddedKeys(addedKeys)
                dispatch(hideLoader())
            }
            else {
                addedKeys[`${section}`] = true
                setAddedKeys(addedKeys)
                dispatch(hideLoader())
            }
        }
        else {
            addedKeys[`${section}`] = true
            setAddedKeys(addedKeys)
            dispatch(hideLoader())
        }
        props.setSectionAddKey(addedKeys)
    }

    const trackCharts = (section) => {
        dispatch(showLoader())

        if (`${section}` in addedKeys) {
            if (showChart[`${section}`]) {
                showChart[`${section}`] = false
                setShowChart(showChart)
                dispatch(hideLoader())
            }
            else {
                showChart[`${section}`] = true
                setShowChart(showChart)
                dispatch(hideLoader())
            }
        }
        else {
            showChart[`${section}`] = true
            setShowChart(showChart)
            dispatch(hideLoader())
        }
        props.setSectionAddCharts(showChart)
    }

    const LoadData = () => {
        setAddedCharts(props.charts_layout)
        setShowChart(props.sectionAddedCharts)
        setAddedKeys(props.sectionKeys)
    }


    return (
        <div className="reportDesigner-dynamicSections bg-white">
            <Card className="reportTableCard" title="Report Table" >
                <div className="designer-block">
                    <Form.List name={["response"]}>
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <div style={{ border: "1px solid #486BC9", marginBottom: "30px", minHeight: "160px", borderRadius: "4px" }}>

                                        {name >= 0 ? setShowAddSection(true) : setShowAddSection(false)}
                                        <p className="section-name">Section {name + 1} </p>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridGap: '10px' }}>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                                                <Form.Item {...restField} name={[name, 'sectionName']}>
                                                    <Input placeholder="Section" style={{ width: '150px', marginBottom: '10px', marginLeft: '35px' }} className="input-section" disabled={props.show} disabled={editable} />
                                                </Form.Item>
                                                <EditOutlined style={{ marginTop: '8px', marginLeft: '10px' }} onClick={() => handleEdit(editable)} />
                                            </div>

                                            <div className="add-chart" onClick={() => trackCharts(name)} >{!showChart[name] ? <span>+ Add Chart </span> : <span> - Remove  </span>} </div>

                                            <div style={{ marginLeft: '15%' }}>
                                                <Popconfirm title="Are you Sure you want to delete the section?" onConfirm={() => remove(name)} disabled={props.show}>
                                                    <DeleteTwoTone twoToneColor="red" style={{ fontSize: '18px', marginTop: '5px' }} />
                                                </Popconfirm>
                                            </div>

                                        </div>
                                        {!addedKeys[name] ?
                                            <center>
                                                <div style={{ height: '90px', width: '100px', opacity: '1px', border: '1px dashed #D9D9D9', marginTop: '30px', alignContent: 'center', justifyContent: 'center' }} onClick={() => sectionAddKey(name + 1)}> <PlusOutlined style={{ color: 'gray', marginTop: '10px' }} /> <br />Add Key and value</div>
                                            </center> :
                                            <></>
                                        }
                                        {addedKeys[name] ?
                                            <>
                                                <Space
                                                    className="dynamicSections-spaceSection"
                                                    key={key}
                                                    style={{ display: 'flex', justifyContent: 'center' }}
                                                    align="baseline"
                                                >
                                                    <table className="dynamicSections-table" style={{ width: '1210px' }}>
                                                        <thead className="dynamicSections-thead">
                                                            <tr>
                                                                <th className="action-clm">Action</th>
                                                                <th className="key-clm">Key</th>
                                                                <th className="value-clm">Value</th>
                                                                <th className="edit-clm">Editable?</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="dynamicSections-tbody">
                                                            <ReportDesignerDynamicRow fieldKey={name} show={props.show} />
                                                        </tbody>
                                                    </table>
                                                </Space>
                                                {/* <center>
                                                    <PlusOutlined style={{ color: 'gray' }} />
                                                    <div>Click on add chart to add charts in the section</div>
                                                </center> */}
                                            </> : <></>
                                        }
                                        <div >
                                            <div className="chart-block">
                                                {showChart[name] ?
                                                    list.map((i) =>
                                                    (<Form.Item {...restField} name={[name, 'select']}>
                                                        <div className='chart-tiless' onClick={(e) => addChart(e.target.innerHTML, name)}>
                                                            {addedCharts[`${name + 1}`] && addedCharts[`${name + 1}`].map((j) => (j == i ? <div className="chart-tile"> <CheckCircleOutlined style={{ color: 'green' }} /></div> : <></>))}
                                                            <p className="charttile-content">{i}</p>
                                                        </div>
                                                    </Form.Item>
                                                    )
                                                    ) : <></>
                                                }
                                                {/* <PlusOutlined twoToneColor="#eb2f96" style={{ fontSize: '16px', marginLeft: '10px', color: '#093185', background: "white", position: "absolute", bottom: 0, right: 0, padding: "2px", borderRadius: "50px" }} onClick={() => add()} /> <u disabled={props.show}></u> */}
                                            </div>
                                        </div>
                                        {props.charts_layout[`${name + 1}`] && props.charts_layout[`${name + 1}`].map((i) =>
                                        (
                                            <div>
                                                <p className="chart-name">{i} <Popconfirm title="Are you Sure you want to delete the chart?" onConfirm={() => deleteChart(i, name)} disabled={props.show}>
                                                    <DeleteTwoTone twoToneColor="red" style={{ marginLeft: '20px' }} />
                                                </Popconfirm></p>
                                                <Chart chartName={i} />
                                            </div>
                                        ))}
                                        <PlusOutlined style={{ fontSize: '16px', marginLeft: '99.5%', color: '#093185', background: "white", padding: "2px", borderRadius: "50px" }} twoToneColor="#eb2f96" onClick={() => add()} />

                                    </div>
                                ))}
                                <Form.Item >
                                    {showAddSection ? <></> :
                                        <p disabled={props.show}>
                                            <center>
                                                <div style={{ height: '60px', width: '80px', opacity: '1px', border: '1px dashed #D9D9D9', marginTop: '30px', alignContent: 'center', justifyContent: 'center' }} onClick={() => add()}> <PlusOutlined twoToneColor="#eb2f96" style={{ marginTop: '10px' }} /> <br />Add Section</div>
                                            </center>
                                            {/* <PlusOutlined twoToneColor="#eb2f96" style={{ fontSize: '16px', marginLeft: '10px', color: '#093185', background: "white", position: "absolute", bottom: -10, right: -10, padding: "2px", borderRadius: "50px" }} onClick={() => add()} /> */}
                                        </p>
                                    }
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </div>
            </Card>
        </div>
    );
}

export default ReportDesignerDynamicSections;
