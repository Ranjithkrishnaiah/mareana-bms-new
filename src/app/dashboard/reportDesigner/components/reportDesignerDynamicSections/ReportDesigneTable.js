import React, { useState } from 'react';
import { Form, Input, Space, Popconfirm, Card, Button } from 'antd';
import { DeleteTwoTone, PlusOutlined, CheckCircleTwoTone } from '@ant-design/icons';
import './styles.scss';
import ReportDesignerDynamicRow from './reportDesignerDynamicRow/reportDesignerDynamicRow';
import ChartTable from '../reportChart/reportChart';

function ReportDesigneTable(props) {

    const { formData, list } = props;

    const [count, setCount] = useState(0)
    const [alertCount, setAlertCount] = useState([0]);
    const [showCharts, setShowCharts] = useState(false)
    const [addedCharts, setAddedCharts] = useState([])
    const [selected, setSelected] = useState('')


    let chartsObj = {

    }

    const handleClick = () => {
        setCount(count + 1);
        setAlertCount([...alertCount, count + 1]);
    }

    const showChart = (y) => {
        if (!y)
            setShowCharts(true)
        if (y)
            setShowCharts(false)
    }

    const addCharts = (chartname, name) => {

        let arr = [...addedCharts]
        arr.push(chartname)
        setSelected(chartname)
        setAddedCharts(arr)
        // setAddedCharts(addedCharts.push(chartname));
        // setCount(count + 1);
        // setAlertCount([...alertCount, count + 1]);
    }



    return (
        <Card className="reportTableCard" title="Report Table" >
            <div className="designer-block">
                <Form.List name={["response"]}>
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <div style={{ border: "1px solid #486BC9", marginBottom: "10px", minHeight: "160px", borderRadius: "4px" }}>
                                    <div style={{ marginLeft: '35px', marginTop: '20px' }}>
                                        <p className="section-count">Section {name + 1}</p>
                                    </div>
                                    <Form.Item {...restField} name={[name, 'sectionName']}>
                                        <Input placeholder="Section Name" style={{ marginLeft: '35px', width: '150px' }} bordered={false} className="input-section" disabled={props.show} />
                                    </Form.Item>

                                    <div style={{ marginLeft: '1100px' }}>
                                        {/* <Button>+Add Chart</Button> */}
                                        <span>
                                            <div className="add-chart" onClick={() => showChart(showCharts)}>+ Add Chart</div>
                                            <Popconfirm title="Are you Sure you want to delete the section?" onConfirm={() => remove(name)} disabled={props.show}>
                                                <DeleteTwoTone twoToneColor="red" style={{ marginBottom: '100px' }} />
                                            </Popconfirm>
                                        </span>
                                    </div>

                                    <Space
                                        className="designer-spaceSection"
                                        key={key}
                                        style={{ display: 'flex', justifyContent: 'center' }}
                                        align="baseline"
                                    >
                                        <table className="designer-table">
                                            <thead className="designer-thead">
                                                <tr>
                                                    <th className="action-clm">Action</th>
                                                    <th className="key-clm">Key</th>
                                                    <th className="value-clm">Value</th>
                                                    <th className="edit-clm">Editable?</th>
                                                </tr>
                                            </thead>
                                            <tbody className="designer-tbody">
                                                <ReportDesignerDynamicRow fieldKey={name} show={props.show} />
                                            </tbody>
                                        </table>

                                    </Space>

                                    <div className="chart-block">
                                        {showCharts &&
                                            list.map((i) =>
                                            (<Form.Item {...restField} name={[name, 'select']}>
                                                <div className='chart-tiless' onClick={(e) => addCharts(e.target.innerHTML, name)}>
                                                    {/* <div className="chart-tile"><CheckCircleTwoTone twoToneColor="green" /></div> */}
                                                    <p className="charttile-content">{i}</p>
                                                </div>
                                            </Form.Item>

                                            ))

                                        }


                                        {/* <PlusOutlined twoToneColor="#eb2f96" style={{ fontSize: '16px', marginLeft: '10px', color: '#093185', background: "white", position: "absolute", bottom: 0, right: 0, padding: "2px", borderRadius: "50px" }} onClick={() => add()} /> <u disabled={props.show}></u> */}
                                    </div>
                                    <center>
                                        <div className='create-chart' onClick={() => showChart()} >
                                            <Button className="add-chart-btn">Add Chart</Button>
                                        </div>
                                    </center>
                                    {addedCharts.map((i) =>
                                    (
                                        <Form.Item>
                                            {i}
                                            <ChartTable />
                                        </Form.Item>
                                    ))}
                                </div>

                            ))}
                            <Form.Item >
                                <p disabled={props.show}>
                                    <div classname="dynamicDiv" style={{ border: "1px solid #486BC9", marginBottom: "10px", minHeight: "160px", borderRadius: "4px" }}>
                                        <div className="add-box">
                                            <div className='create-new' onClick={() => handleClick()} >
                                                <PlusOutlined />
                                                <p>Add Key and value</p>
                                            </div>
                                            <div className="box" onClick={() => handleClick()} >Add Key and value</div>
                                            <div className="box" onClick={() => add()} >ADD</div>
                                        </div>
                                    </div>
                                    <PlusOutlined twoToneColor="#eb2f96" style={{ fontSize: '16px', marginLeft: '10px', color: '#093185', background: "white", position: "absolute", bottom: 6, right: -10, padding: "2px", borderRadius: "50px" }} onClick={() => add()} /> <u disabled={props.show}></u>
                                </p>
                            </Form.Item>

                        </>
                    )}
                </Form.List>
            </div>

        </Card>
    );
}

export default ReportDesigneTable;



