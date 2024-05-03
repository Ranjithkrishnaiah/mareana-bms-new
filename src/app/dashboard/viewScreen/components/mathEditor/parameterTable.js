import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table, Empty, Radio, Select, Tag, Checkbox } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import {
	createSummaryData,
	createVariable,
	selectParamType,
	viewFunctionMap,
	viewParamMap,
} from '../../../../../duck/actions/viewAction';

let paramType = '';

let count = 0;
let counter = 0;

const ParameterTable = props => {
	const paramReducer = useSelector(state => state.viewCreationReducer);
	const isLoadView = useSelector(state => state.viewCreationReducer.isLoad);
	const selectedTableData = useSelector(
		state => state.viewCreationReducer.selectedParamData
	);

	const saveFunction = useSelector(state => state.viewCreationReducer.save);

	const functionName = useSelector(
		state => state.viewCreationReducer.functionName
	);

	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const [selectedRow, setSelectedRow] = useState([]);
	const [aggregationValue, setAggregationValue] = useState('');
	const [tableData, setTableData] = useState([]);
	const [selectedPrimaryData, setSelectedPrimaryData] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [reloadTable, setReloadTable] = useState(true);
	const [checked, setChecked] = useState(null);
	const [parameters, setParameters] = useState({});
	const [variableParam, setVariableParam] = useState({});

	const {
		rowDisable,
		variableCreate,
		setVariableCreate,
		parentBatches,
		viewSummaryBatch,
		setViewSummaryBatch,
		ischeckBox,
		viewJson,
		setViewJson,
		varClick,
		setVarClick,
	} = props;

	const dispatch = useDispatch();

	let columns = [
		{
			title: 'PARAMETER NAME',
			dataIndex: 'parameter_name',
			key: 'parameter_name',
			width: 150,
			fixed: 'left',
		},
		{
			title: 'PRIMARY',
			dataIndex: 'primary',
			key: 'primary',
			width: 100,
			fixed: 'left',
			render: (text, record, index) => {
				return (
					<Radio
						checked={paramType === record.parameter_name}
						onChange={e =>
							onRadioChange({
								checked: e.target.checked ? e.target.checked : false,
								type: record.parameter_name,
								primary: 'primary',
								record: record,
								index: index,
							})
						}></Radio>
				);
			},
		},
		{
			title: 'AGGREGATION',
			dataIndex: 'aggregation',
			key: 'aggregation',
			width: 120,
			fixed: 'left',
			render: (text, record, index) => {
				return (
					<Select
						style={{ width: '100px' }}
						placeholder='Aggregation'
						onChange={(e, value) => {
							handleAggregationChange(text, record, value, index);
						}}
					//	value={aggregationValue}
					>
						<Option key='1' value='Min'>
							Min
						</Option>
						<Option key='2' value='Mean'>
							Mean
						</Option>
						<Option key='3' value='Max'>
							Max
						</Option>
						<Option key='4' value='First'>
							First
						</Option>
						<Option key='5' value='last'>
							last
						</Option>
					</Select>
				);
			},
		},
	];
	const data =
		tableData !== undefined && tableData.length > 0
			? Object.keys(tableData[0])
			: [];
	const uniqueArr = (value, index, self) => {
		return self.indexOf(value) === index;
	};

	const paramColumn = data && data.filter(uniqueArr);

	paramColumn.map((item, i) => {
		if (
			item === 'parameter_name' ||
			item === 'primary' ||
			item === 'aggregation' ||
			item === 'id' ||
			item === 'key' ||
			item === 'sourceType' ||
			item === 'coverage'
		) {
			console.log('i');
		} else {
			columns.push({
				title: item,
				dataIndex: item,
				key: `${item}-4`,
				width: 80,
				render: (value, record, rowIndex) => {
					if (!rowDisable) {
						if (value) {
							return (
								<Checkbox
									className='custom-check'
									onChange={e => onChangeBatch(e, record, rowIndex, item)}
									checked={value}
								/>
							);
						} 
						else if (value === '') {
							return (
								<Checkbox
									className='custom-check'
									onChange={e => onChangeBatch(e, record, rowIndex, item)}
								/>
							);
						}
						else {
							return (
								<span className='batchClosed'>
									<CloseOutlined />
								</span>
							);
						}
					} else {
						if (value) {
							return (
								<span className='batchChecked'>
									<CheckOutlined />
								</span>
							);
						} else {
							return (
								<span className='batchClosed'>
									<CloseOutlined />
								</span>
							);
						}
					}
					// else if (value === '') {
					// 	return (
					// 		<Checkbox
					// 			className='custom-check'
					// 			onChange={e => onChangeBatch(e, record, rowIndex, item)}
					// 		/>
					// 	);
					// }
				},
			});
		}
	});

	useEffect(() => {
		if (ischeckBox) {
			setReloadTable(false);
			setIsLoading(true);
			if (ischeckBox) {
				setInterval(() => {
					setReloadTable(true);
					setIsLoading(false);
				}, 300);
			}
		}
	}, [ischeckBox]);

	useEffect(() => {
		if (paramReducer.selectedParamData) {
			setTableData([...selectedTableData]);
		}
	}, [paramReducer]);

	useEffect(() => {
		if (isLoadView) {
			//	onChangeColumnsHandler();
			setTableData([...selectedTableData]);
		}
	}, [isLoadView]);

	useEffect(() => {
		if (!varClick) {
			setSelectedRowKeys([]);
			setSelectedRow([]);
		}
	}, [varClick]);

	useEffect(() => {
		let varArr = [];
		let varObj = {};
		let variableObj = {};
		if (variableCreate === true) {
			count++;

			const varParameter = [...parameters];

			varParameter.forEach(element => {
				varArr.push(element);
			});

			variableParam[`${'V' + count}`] = varParameter;
			setVariableParam(variableParam);

			const viewDataJson = [...viewJson];
			viewDataJson.forEach((element, index) => {
				return (element.parameters = variableParam);
			});

			setViewJson(viewDataJson);
			dispatch(createVariable(variableParam));
			dispatch(viewParamMap(variableParam));
			setVariableCreate(false);
		}
	}, [variableCreate]);

	useEffect(() => {
		if (saveFunction) {
			counter++;
			let arr = [];

			let primarySelectedData = { ...selectedPrimaryData };
			let functionTable = [...viewSummaryBatch];
			functionTable.forEach(item => {
				let obj = {};
				Object.entries(primarySelectedData).forEach(([key, value]) => {
					if (key === item.batch) {
						obj[functionName] = true;
					}
				});
				arr.push(obj);
			});

			const arr3 = functionTable.map((item, i) =>
				Object.assign({}, item, arr[i])
			);

			setViewSummaryBatch(arr3);
			dispatch(createSummaryData(arr3));

			primarySelectedData.parameter_name = functionName;
			let funObj1 = {};
			let fun = {};
			funObj1['name'] = functionName;
			funObj1['defination'] = paramReducer.funDetails;
			//`{${'V' + counter}}`;
			fun[counter] = funObj1;

			const varData = [...viewJson];
			varData.forEach(element => {
				element.functions = fun;
			});

			dispatch(viewFunctionMap(fun));
		}
	}, [saveFunction]);

	const onRadioChange = ({ checked, type, primary, record, index }) => {
		if (checked) {
			const newPrimaryData = [...tableData];
			const primaryJson = [...parameters];
			newPrimaryData[index].primary = 1;
			let radioObj = [record];
			radioObj.forEach(element => {
				element.primary = 0;
			});

			setTableData(newPrimaryData);
			setSelectedPrimaryData(radioObj[0]);
			dispatch(selectParamType(type));
			paramType = type;
		}
	};

	const handleAggregationChange = (text, record, value, index) => {
		let newAggrValue = [...tableData];
		newAggrValue[index].aggregation =
			value.value !== undefined ? value.value : '';
		const aggJson = [...parameters];
		aggJson[index].aggregation = value.value !== undefined ? value.value : '';
		setParameters(aggJson);
		setTableData(newAggrValue);
		setAggregationValue(value.value !== undefined ? value.value : '');
	};

	const onChangeBatch = (e, record, rowIndex, key) => {
		setChecked(e.target.checked);
		const batchRecord = [...tableData];

		batchRecord[rowIndex][key] =
			e.target.checked == false ? '' : e.target.checked;

		const batchExcludeJson = [...parameters];
		batchExcludeJson.forEach((element, index) => {
			if (element.parameter_name === record.parameter_name) {
				//batchExc.push(key);
				element.batch_exclude.push(key);
			}
		});
		setParameters(batchExcludeJson);
		setTableData(batchRecord);
	};

	return (
		<>
			{reloadTable && (
				<Table
					rowClassName={index =>
						index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
					}
					locale={{
						emptyText: (
							<Empty
								image={Empty.PRESENTED_IMAGE_SIMPLE}
								description={
									<span>Add parameters from under the Process Hierarchy</span>
								}
							/>
						),
					}}
					//rowKey='key'
					rowSelection={{
						selectedRowKeys,
						onChange: (selectedRowKeys, selectedRows) => {
							let paramArr = [];
							const rowData = [...selectedRows];
							rowData.forEach((element, index) => {
								let paramsObj = {};
								const materialKey = element.key.split('-');
								paramsObj['source_type'] = element.sourceType;
								paramsObj['material_id'] = materialKey[1];
								paramsObj['parameter_name'] = element.parameter_name;
								paramsObj['batch_exclude'] = [];
								paramsObj['priority'] = index;
								paramsObj['aggregation'] = element.aggregation;
								paramArr.push(paramsObj);
							});
							setParameters(paramArr);
							props.callbackCheckbox(true);
							setSelectedRowKeys(selectedRowKeys);
							setSelectedRow(selectedRows);
						},
						getCheckboxProps: record => {
							return {
								disabled: rowDisable,
							};
						},
					}}
					columns={columns}
					dataSource={tableData}
					size='small'
					scroll={{ y: 450 }}
					pagination={false}
					loading={isLoading}
				/>
			)}
		</>
	);
};

export const MemoizedParameterTable = React.memo(ParameterTable);
