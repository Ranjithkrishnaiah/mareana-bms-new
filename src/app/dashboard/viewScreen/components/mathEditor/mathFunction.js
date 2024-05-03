import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Input, Modal, Alert } from 'antd';
import FunctionKey from '../../../../../assets/images/key1.png';
import InputField from '../../../../../components/InputField/InputField';
import { InfoCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import {
	saveAsViewFunction,
	saveViewFunction,
	sendFunctionName,
	sendFunDetails,
} from '../../../../../duck/actions/viewAction';

const MathFunction = props => {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isFunctionVisible, setIsFunctionVisible] = useState(false);
	const [functionName, setFunctionName] = useState('');
	const [mathEditorValue, setMathEditorValue] = useState('');
	const [isAlertFunction, setIsAlertFunction] = useState(false);
	const dispatch = useDispatch();
	const showModal = () => {
		dispatch(saveViewFunction(false));
		setIsModalVisible(true);
		let funDetails = mathEditorValue;
		// mathEditorValue && mathEditorValue.split(/\W+/);
		dispatch(sendFunDetails(funDetails));
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	const handleChangeFunction = e => {
		setMathEditorValue(e.target.value);
		setIsFunctionVisible(true);
	};
	const onChangeFunName = e => {
		setFunctionName(e.target.value);
	};

	const handleSave = () => {
		dispatch(sendFunctionName(functionName));
		dispatch(saveViewFunction(true));
		setIsModalVisible(false);
		setIsAlertFunction(true);
		setTimeout(() => {
			setFunctionName('');
			setIsAlertFunction(false);
		}, 1000);
	};

	return (
		<>
			<div className='function-editor'>
				{isAlertFunction ? (
					<div className='function-alert'>
						<p>{`Function '${functionName}' created `}</p>
						<span>
							<CheckCircleOutlined />
						</span>
					</div>
				) : (
					<Input
						onChange={e => handleChangeFunction(e)}
						placeholder='Create variables using parameters below to use them here'
						suffix={
							<span>
								{isFunctionVisible && (
									<Button
										onClick={showModal}
										type='text'
										className='custom-primary-btn '>
										Create Function
									</Button>
								)}
								<img src={FunctionKey} />
							</span>
						}
						value={mathEditorValue}
					/>
				)}
			</div>
			<Modal
				width={400}
				visible={isModalVisible}
				onCancel={handleCancel}
				footer={null}>
				<div className='function-modal'>
					<p className='heading'>
						<InfoCircleOutlined className='heading-icon' /> Save
					</p>
					<div className='function-input'>
						<InputField
							label='Enter function name'
							placeholder='E.g. Function 1'
							onChangeInput={e => onChangeFunName(e)}
							value={functionName}
						/>

						<div className='function-btn'>
							<Button
								onClick={() => dispatch(saveAsViewFunction(true))}
								type='link'
								className='custom-secondary-btn-link '>
								Cancel
							</Button>
							<Button type='text' className='custom-primary-btn '>
								Save as a copy
							</Button>
							<Button
								onClick={() => {
									handleSave();
								}}
								type='text'
								className='custom-secondary-btn '>
								Save
							</Button>
						</div>
					</div>
				</div>
			</Modal>
		</>
	);
};

export default MathFunction;
