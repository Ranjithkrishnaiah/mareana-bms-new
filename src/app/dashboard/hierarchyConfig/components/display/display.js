/**
 * @author Mihir Bagga <mihir.bagga@mareana.com>
 * @Mareana - CPV Product
 * @version 1
 * @Last Modified - 22 April, 2022
 * @Last Changed By - @Mihir 
 */
import React, { useState } from 'react'
import './displayStyles.scss'
import {
    Button,
    Card,
    Collapse,
    Typography,
    Modal,
    Select,
    Input,
    Row,
    Col
} from 'antd';
import Banner from '../../../../../assets/images/Popup-Side.svg';
import { DeleteTwoTone } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';


const { Panel } = Collapse;
const { Text } = Typography;
const { Option } = Select

function Display(props) {

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [hierarchyName, setHierarchyName] = useState('Untilted')

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <div>
            <Card
                className="hierarchy-card-collapse"
                title={<span>Molecule Hierarchy Configuration  <span className="title-button"> <span onClick={() => setIsModalVisible(true)} >Add new hierarchy</span> </span></span>}
            >
                <Collapse className="hierarchy-collapse">
                    <Panel header={<span className="panel-delete-button"><DeleteTwoTone twoToneColor="red" /></span>}></Panel>
                </Collapse>
            </Card>
            <Modal
                className='landing-modal'
                title="Create New View"
                visible={isModalVisible}
                //onOk={handleOk} 
                onCancel={handleCancel}
                footer={[
                    <Button style={{ backgroundColor: '#093185', color: 'white', borderRadius: '4px' }} onClick={() =>
                        props.handleNew(hierarchyName)
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
    )
}

export default Display