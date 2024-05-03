import React from 'react';
import './SelectSearchField.scss';
import { Button, Select } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
const SelectSearchField = props => {
	return (
		<div className='select_field_search'>
			<p>
				{props.label} {props.iconlabel}
			</p>
			<div className='search-block'>
				<Select
					showSearch={props.showSearch}
					placeholder={props.placeholder}
					value={props.selectedValue}
					onChange={props.onChangeSelect}
					onSearch={props.onSearchSelect}
					style={{ width: '100%', margin: '0px' }}>
					{props.options}
				</Select>
				{props.selectedValue !== '' ? (
					<Button onClick={props.handleClearSearch} className='close-search'>
						<CloseOutlined />
					</Button>
				) : (
					<></>
				)}
			</div>
			<p className='field-error'>{props.error}</p>
		</div>
	);
};

export default SelectSearchField;
