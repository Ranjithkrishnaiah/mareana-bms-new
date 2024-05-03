/**
 * @author Ranjith <ranjith.k@mareana.com>
 * @Mareana - BMS PBR
 * @version 1
 * @Last Modified - 05 May, 2022
 * @Last Changed By - @ranjith
 */

import { Input, Select, Form, Space, Button, Collapse } from 'antd';
import Dragger from 'antd/lib/upload/Dragger';
import React, { useEffect } from 'react';
import InputField from '../../../../../components/InputField/InputField';
import './styles.scss';

import { PlusOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Panel } = Collapse;

function AddParameter(props) {
    const { paramaterAdded, setParamaterAdded } = props;
    const [form] = Form.useForm();

    const parameterAddingHandler = () => {
        setParamaterAdded(true);
    };

    return (
        <div className='addParameterContainer'>
            <div className='addParameterBlock'>
                <div className='singleParameterBlock'>
                    <Form.List name='dymamic-sections'>
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <div
                                        key={key}
                                        className='parameterAdded-block'
                                    >
                                        <Collapse
                                            accordion
                                            expandIconPosition='right'
                                            defaultActiveKey={['1']}
                                            className='paramererAddingCollapse'
                                        >
                                            <Panel
                                                header={`Parameter ${
                                                    key + 1
                                                } created`}
                                                key='1'
                                            >
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'mainName']}
                                                    label='Name'
                                                >
                                                    <Input placeholder='Enter Name' />
                                                </Form.Item>

                                                <div className='parameterAddingBlock parameterValueBlock'>
                                                    <p>Value</p>
                                                    <p></p>
                                                    <Dragger className='draggerSnippet'>
                                                        <p className='ant-upload-drag-icon'>
                                                            <PlusOutlined />
                                                        </p>
                                                        <p className='ant-upload-text'>
                                                            Drag and drop anchor
                                                        </p>
                                                        <div className='ant-upload-text-input'>
                                                            <Form.Item
                                                                {...restField}
                                                                name={[
                                                                    name,
                                                                    'anchorValue',
                                                                ]}
                                                                className='uploadSnippetInput'
                                                            >
                                                                <Input placeholder='Enter Anchor Value' />
                                                            </Form.Item>
                                                        </div>
                                                    </Dragger>
                                                    <Dragger className='draggerSnippet'>
                                                        <p className='ant-upload-drag-icon'>
                                                            <PlusOutlined />
                                                        </p>
                                                        <p className='ant-upload-text'>
                                                            Drag and drop
                                                            snippet
                                                        </p>
                                                        <div className='ant-upload-text-input'>
                                                            <span>
                                                                Or enter snippet
                                                                number
                                                            </span>
                                                            <Form.Item
                                                                {...restField}
                                                                name={[
                                                                    name,
                                                                    'snippetValue',
                                                                ]}
                                                                className='uploadSnippetInput'
                                                            >
                                                                <Input placeholder='Enter Snippet Value' />
                                                            </Form.Item>
                                                        </div>
                                                    </Dragger>
                                                    <Form.Item name='valueFormat'>
                                                        <Select defaultValue='FORMAT'>
                                                            <Option value='FORMAT'>
                                                                FORMAT
                                                            </Option>
                                                        </Select>
                                                    </Form.Item>
                                                    <Form.Item name='valueTransformation'>
                                                        <Input placeholder='Enter transformation' />
                                                    </Form.Item>
                                                    <Form.Item name='valueArea'>
                                                        <Input placeholder='Enter area' />
                                                    </Form.Item>
                                                    <Form.Item name='valueAnchorDirection'>
                                                        <Select defaultValue='AnchorDirection'>
                                                            <Option value='AnchorDirection'>
                                                                Anchor Direction
                                                            </Option>
                                                        </Select>
                                                    </Form.Item>
                                                </div>
                                            </Panel>
                                        </Collapse>
                                    </div>
                                ))}
                                <div
                                    className='firstParameter-para'
                                    onClick={parameterAddingHandler}
                                >
                                    <p onClick={() => add()}>
                                        {paramaterAdded
                                            ? 'Add another paramater'
                                            : 'Add your first Parameter'}
                                    </p>
                                </div>
                            </>
                        )}
                    </Form.List>
                </div>
            </div>
        </div>
    );
}

export default AddParameter;
