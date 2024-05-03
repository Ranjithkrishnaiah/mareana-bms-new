import React from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';

const CreateVariable = props => {
	return (
		<div className={props.className}>
			{props.title === 'Create Variable' && (
				<div onClick={props.addVariable}>
					<PlusOutlined />
					<p>Create Variable</p>
				</div>
			)}
			{props.title === 'Select parameters' && (
				<>
					<PlusOutlined />
					<p>Select parameters</p>
				</>
			)}
			{props.title === 'Done' && (
				<Button
					type='text'
					onClick={props.createVar}
					className='custom-primary-btn '>
					Done
				</Button>
			)}
		</div>
	);
};

export default CreateVariable;
