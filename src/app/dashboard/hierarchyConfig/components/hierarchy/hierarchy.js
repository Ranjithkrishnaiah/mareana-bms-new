
/**
 * @author Mihir Bagga <mihir.bagga@mareana.com>
 * @Mareana - CPV Product
 * @version 1
 * @Last Modified - 22 April, 2022
 * @Last Changed By - @Mihir 
 */

import React, { useState } from 'react'
import { Card, Tabs, Table, Popconfirm, Button, Input, Modal, Row, Col } from 'antd'
import './hierStyle.scss'
import { ArrowRightOutlined, DeleteTwoTone, PlusOutlined } from '@ant-design/icons'
import Banner from '../../../../../assets/images/Popup-Side.svg';
import BreadCrumbWrapper from '../../../../../components/BreadCrumbWrapper';
import Display from '../display/display';

const { TabPane } = Tabs

function Hierarchy() {
    const [hierarchyName, setHierarchyName] = useState('Untilted')

    const [moleculeData, setMoleculeData] = useState([])
    const [stepData, setStepData] = useState([])
    const [stepMappingData, setStepMappingData] = useState([])
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [stepArray, setStepArray] = useState([]);
    const [show, setShow] = useState(false)

    const [count, setCount] = useState(1);
    const [stepCount, setStepCount] = useState(1);
    const [stepMapCount, setStepMapCount] = useState(1);

    const [activeTab, setActiveTab] = useState('Plant and molecules')

    const plantMoleculeColumns =
        [
            {
                title: "Action",
                dataIndex: "action",
                width: "10%",
                render: (_, record) => (
                    <Popconfirm
                        title="Sure to delete?"
                        onConfirm={() => handleDelete(record.key)}
                    >
                        <DeleteTwoTone twoToneColor="red" />
                    </Popconfirm>
                ),
            },
            {
                title: "Molecule",
                dataIndex: "Molecule",
                key: "Molecule",
                width: "20%",
                render: (text, record) =>
                    moleculeData.map((data, index) => {
                        if (record.key === data.key) {
                            return (
                                <Input
                                    type="text"
                                    name="Molecule"
                                    value={data.Molecule}
                                    onChange={(e) => handleChange(index, e)}
                                />
                            );
                        }
                    }),
            },
            {
                title: "Plant",
                dataIndex: "Plant",
                key: "Plant",
                width: "80%",
                render: (text, record) =>
                    moleculeData.map((data, index) => {
                        if (record.key === data.key) {
                            return (
                                <Input
                                    type="text"
                                    name="Plant"
                                    value={data.Plant}
                                    onChange={(e) => handleChange(index, e)}
                                />
                            );
                        }
                    }),
            },
        ]

    const stepMapColumns =
        [
            {
                title: "Action",
                dataIndex: "action",
                width: "10%",
                render: (_, record) => (
                    <Popconfirm
                        title="Sure to delete?"
                        onConfirm={() => handleStepDelete(record.key)}
                    >
                        <DeleteTwoTone twoToneColor="red" />
                    </Popconfirm>
                ),
            },
            {
                title: "Sequence No",
                dataIndex: "Sequence",
                key: "Sequence",
                width: "20%",
                render: (text, record) =>
                    stepData.map((data, index) => {
                        if (record.key === data.key) {
                            return (
                                <Input
                                    type="text"
                                    name="Sequence"
                                    value={data.Molecule}
                                    onChange={(e) => handleStepChange(index, e)}
                                />
                            );
                        }
                    }),
            },
            {
                title: "Process Step",
                dataIndex: "Step",
                key: "Step",
                width: "70%",
                render: (text, record) =>
                    stepData.map((data, index) => {
                        if (record.key === data.key) {
                            return (
                                <Input
                                    type="text"
                                    name="Step"
                                    value={data.Plant}
                                    onChange={(e) => handleStepChange(index, e)}
                                />
                            );
                        }
                    }),
            },
        ]

    const mappingColumns = [
        {
            title: "Product",
            dataIndex: "Product",
            key: "Product",
            width: "200",
        },
        {
            title: "Plant",
            dataIndex: "Plant",
            key: "Plant",
            width: "200",
        },
        {
            title: "Level1",
            dataIndex: "Level1",
            key: "Level 1",
            width: "200",
        },
        {
            title: "Description",
            dataIndex: "Description",
            key: "Description",
            width: "200",
        },
        {
            title: "Process Step",
            dataIndex: "Process Step",
            key: "Process Step",
            width: "200",
        },

    ]

    const handleAdd = () => {
        const newData = {
            key: count,
            Plant: "",
            Molecule: "",
        };
        setMoleculeData([...moleculeData, newData]);
        setCount(count + 1);
    };

    const handleStepAdd = () => {
        const newData = {
            key: stepCount,
            Sequence: "",
            Step: "",
        };
        setStepData([...stepData, newData]);
        setStepCount(stepCount + 1);
    };

    const handleChange = (index, event) => {
        const { name, value } = event.target;
        const rowsInput = [...moleculeData];
        rowsInput[index][name] = value;
        setMoleculeData(rowsInput);
    }

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleStepChange = (index, event) => {

        const { name, value } = event.target;
        const rowsInput = [...stepData];
        rowsInput[index][name] = value;
        setStepArray(rowsInput.map(function (el) { return el.Step; }))
        setStepData(rowsInput);
    }

    const handleDelete = (key) => {
        const dataSource = [...moleculeData];
        setMoleculeData(dataSource.filter((item) => item.key !== key));
        setCount(count - 1);
    };

    const handleStepDelete = (key) => {
        const dataSource = [...stepData];
        setStepData(dataSource.filter((item) => item.key !== key));
        setStepCount(stepCount - 1);
    };

    const handleChangeTab = (value) => {
        setActiveTab(value)
    }

    const handleNext = () => {
        if (activeTab == 'Process steps')
            setActiveTab('Process step mapping')
        if (activeTab == 'Plant and molecules')
            setActiveTab('Process steps')
    }

    const handleNew = (name) =>
    {
        setShow(false)
        setHierarchyName(name)
    }

    return (

        <div className='custom-wrapper'>
             <BreadCrumbWrapper />
             <div className='custom-content-layout'>
                 { !show ? 
            <Card
                className="hierarchy-card"
                title={<span>Molecule Hierarchy Configuration - {hierarchyName} <span className="title-button"> <span onClick={() => setIsModalVisible(true)}>Add new hierarchy</span> <span className="see-all" onClick={()=>setShow(true)}>See all hierarchy <ArrowRightOutlined /></span></span></span>}
            >
                <Tabs className="hier-tab" activeKey={activeTab} onChange={handleChangeTab} tabBarExtraContent={<Button className="tab-button"> {activeTab == 'Process step mapping' ? <span className="tab-button-text">Finish</span> : <span className="tab-button-text" onClick={() => handleNext()}>Next</span>}</Button>}>
                    <TabPane tab="Plant and molecules" key="Plant and molecules">
                        <p className="tab-title">Enter the product and plant details for {hierarchyName}</p>
                        <Table className="hierarchy-table" columns={plantMoleculeColumns} dataSource={moleculeData} pagination={false} />
                        <div className="add-button">
                            <Button
                                onClick={() => handleAdd()}
                                className="add-row-button"
                            >
                                <PlusOutlined />
                                Add new row
                            </Button>
                        </div>
                    </TabPane>
                    <TabPane tab="Process steps" key="Process steps">
                        <p className="tab-title">Enter the process step for {hierarchyName}</p>
                        <Table className="hierarchy-table" columns={stepMapColumns} dataSource={stepData} pagination={false} />
                        <div className="add-button">
                            <Button
                                onClick={() => handleStepAdd()}
                                className="add-row-button"
                            >
                                <PlusOutlined />
                                Add new row
                            </Button>
                        </div>

                    </TabPane>
                    <TabPane tab="Process step mapping" key="Process step mapping">
                        <p className="tab-title">Enter the process step for {hierarchyName}</p>
                        <div className="map-grid">
                            <Table className="hierarchy-map-table" columns={mappingColumns} />
                            <div className="map-box">
                                <p className="map-box-text">Process steps available</p>
                                {stepArray && stepArray.map((i) =>
                                    <div className="map-box-tile">
                                        <p className="map-box-tile-text">{i}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabPane>

                </Tabs>
            </Card> : <Display handleNew={handleNew}/> }
            <Modal
                className='landing-modal'
                title="Create New Dashboard"
                visible={isModalVisible}
                //onOk={handleOk} 
                onCancel={handleCancel}
                footer={[
                    <Button style={{ backgroundColor: '#093185', color: 'white', borderRadius: '4px' }} onClick={() =>
                        handleOk()
                    }>Let's Go!</Button>
                ]}>
                <div>
                    <Row>
                        <Col span={12}>
                            <img src={Banner} />
                        </Col>
                        <Col span={12}>
                            <Row>
                                <p>Name of the drug you want to add</p>
                                <Input
                                    placeholder='Enter Name'
                                    onChange={(e) => setHierarchyName(e.target.value)}
                                    value={hierarchyName}
                                />
                            </Row>

                        </Col>
                    </Row>
                </div>

            </Modal>
             </div>
        </div>
    )
}


export default Hierarchy