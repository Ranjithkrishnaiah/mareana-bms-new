import React from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';

const VariableCard = props => {
	return (
		<Tooltip title={<span>{props.variableName}</span>} key={props.item.id}>
			<div className='var_block_card'>
				<p>{props.variableName}</p>
				<div className='var-btn'>
					<Button>
						<EditOutlined className='edit' />
					</Button>
					<Button onClick={e => props.deleteVariable(props.variableName)}>
						<DeleteOutlined className='delete' />
					</Button>
				</div>
			</div>
		</Tooltip>
	);
};

export default VariableCard;
