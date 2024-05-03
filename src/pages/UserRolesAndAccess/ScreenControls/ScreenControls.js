/**
 * @author Bhanu Thareja <bhanu.thareja@mareana.com>
 * @Mareana - Release 3.5
 * @version  1
 * @Last Modified - 04 May, 2022
 * @Last Changed By - Bhanu Thareja
 */

import { useState } from 'react'
import { Collapse, Select, Button, Row, Col } from 'antd';

import BreadCrumbWrapper from '../../../components/BreadCrumbWrapper/index'
import GoBackSubHeader from '../../../components/GoBackSubHeader/GoBackSubHeader';
import { PlusOutlined, DeleteOutlined, DeleteTwoTone } from '@ant-design/icons';

const { Panel } = Collapse;
const { Option } = Select;

const INITIAL_USER_RESTRICTIONS = [
    {
        userType: 'user',
        restrictions: [
            {
                screens: ['a', 'b'],
                widgets: ['c', 'd']
            }
        ]
    },
    {
        userType: 'admin',
        restrictions: [
            {
                screens: ['e', 'f'],
                widgets: ['g', 'h']
            }
        ]
    },
    {
        userType: 'cmo',
        restrictions: [
            {
                screens: ['i', 'j'],
                widgets: ['k', 'l']
            }
        ]
    }
]
const ScreenControls = () => {

    const [usersAndRestrictions, setUserAndRestrictions] = useState(INITIAL_USER_RESTRICTIONS)

    const onAddRestriction = i => {
        const usersAndRestrictionsCopy = [...usersAndRestrictions]
        const oldRestrictions = usersAndRestrictionsCopy[i].restrictions
        const emptyRestrictions = { screens: [], widgets: [] }
        usersAndRestrictionsCopy[i].restrictions = [...oldRestrictions, emptyRestrictions]
        setUserAndRestrictions([...usersAndRestrictionsCopy])
    }

    const onDeleteRestriction = (i, j) => {
        const usersAndRestrictionsCopy = [...usersAndRestrictions]
        const oldRestrictions = usersAndRestrictionsCopy[i].restrictions
        oldRestrictions.splice(j, 1)
        usersAndRestrictionsCopy[i].restrictions = [...oldRestrictions]
        setUserAndRestrictions([...usersAndRestrictionsCopy])
    }

    const onChangeSelect = (selectedValue, i, j, type) => {
        const usersAndRestrictionsCopy = JSON.parse(JSON.stringify(usersAndRestrictions))
        const restrictions = usersAndRestrictionsCopy[i].restrictions
        restrictions[j][type] = selectedValue
        setUserAndRestrictions([...usersAndRestrictionsCopy])
    }

    const onDeletePanel = (event, index) => {
        event.stopPropagation()
        const usersAndRestrictionsCopy = [...usersAndRestrictions]
        usersAndRestrictionsCopy.splice(index, 1)
        setUserAndRestrictions(usersAndRestrictionsCopy)
    }

    return (
        <>
            <BreadCrumbWrapper />
            <div className='custom-user-roles-wrapper'>
                <GoBackSubHeader currentPage="Application controls" />
                <div className='custom-table-wrapper'>
                    <p>Set application and widget level controls pertaining to each role.</p>

                    <Collapse defaultActiveKey={['0']} expandIconPosition="right">
                        {usersAndRestrictions.length && usersAndRestrictions.map((usersAndRestriction, i) => {
                            return (
                                <Panel header={<span className="panel-delete-button" onClick={e => onDeletePanel(e, i)}>{usersAndRestriction.userType.toUpperCase()} <DeleteTwoTone twoToneColor="red" /></span>} key={i}>
                                    <Row style={{ position: 'relative' }}>
                                        <Col span={18} className="custom-panel">
                                            <p>Restrict this role from</p>
                                            <div className="panel-repeat">
                                                {usersAndRestriction.restrictions && usersAndRestriction.restrictions.map((restriction, j) => {
                                                    return (
                                                        <div key={j} >
                                                            <span>
                                                                <label>Application</label>
                                                                <Select
                                                                    placeholder="Select"
                                                                    value={restriction.screens}
                                                                    mode="multiple"
                                                                    style={{ width: '25%' }}
                                                                    onChange={selectedValue => onChangeSelect(selectedValue, i, j, 'screens')}>
                                                                    <Option value="a">Screen A</Option>
                                                                    <Option value="b">Screen B</Option>
                                                                    <Option value="c">Screen C</Option>
                                                                </Select>
                                                            </span>
                                                            <span>
                                                                <label>Widgets</label>
                                                                <Select placeholder="Select"
                                                                    value={restriction.widgets}
                                                                    mode="multiple"
                                                                    style={{ width: '25%' }}
                                                                    onChange={selectedValue => onChangeSelect(selectedValue, i, j, 'widgets')}>
                                                                    <Option value="d">Widget D</Option>
                                                                    <Option value="e">Widget E</Option>
                                                                    <Option value="f">Widget F</Option>
                                                                    <Option value="g">Widget G</Option>
                                                                </Select>
                                                            </span>
                                                            {usersAndRestriction.restrictions && usersAndRestriction.restrictions.length > 1 &&
                                                                <DeleteOutlined style={{ color: 'red' }} onClick={() => onDeleteRestriction(i, j)} />}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </Col>
                                        <Button type="primary" style={{ position: 'absolute', right: 0, top: 0 }}>Save</Button>
                                        <Col span={6} style={{ position: 'absolute', right: 0, bottom: 0 }}>
                                            <Button type="dashed" block icon={<PlusOutlined />} onClick={() => onAddRestriction(i)}>Add Control</Button>
                                        </Col>

                                    </Row>
                                </Panel>
                            )
                        })}
                    </Collapse>
                </div>
            </div>
        </>
    )
}

export default ScreenControls