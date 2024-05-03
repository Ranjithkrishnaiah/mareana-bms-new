import { Card, Empty, Table } from 'antd';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
	CheckOutlined,
	CloseOutlined,
	DeleteOutlined,
} from '@ant-design/icons';
import LabelTag from '../../../../../components/LabelTag';
import './styles.scss';

const ViewSummaryData = props => {
	let columns = [];
	const summaryTableData = useSelector(
		state => state.viewCreationReducer.summaryTableData
	);
	const functionName = useSelector(
		state => state.viewCreationReducer.functionName
	);
	const isLoadView = useSelector(state => state.viewCreationReducer.isLoad);
	const [tableColumn, setTableColumn] = useState(columns);

	const [funTableData, setFunTableData] = useState([]);

	const {
		viewDisplayId,
		viewStatus,
		viewVersion,
		viewJson,
		setViewJson,
		parentBatches,
	} = props;

	useEffect(() => {
		if (functionName !== '') {
			setFunTableData(summaryTableData);
		}
	}, [summaryTableData]);

	useEffect(() => {
		if (funTableData.length > 0) {
			const objKey =
				funTableData !== undefined && funTableData.length > 0
					? Object.keys(funTableData[0])
					: [];

			const uniqueArr = (value, index, self) => {
				return self.indexOf(value) === index;
			};

			const summaryColumn = objKey.filter(uniqueArr);

			summaryColumn.map((item, i) => {
				if (item === 'batch' || item === 'batch_year') {
					columns.push({
						title: item.toUpperCase().replace('_', ' '),
						dataIndex: item,
						key: `${item}-${i}`,
						width: 100,
					});
				} else {
					columns.push({
						title: (
							<div className='summary-column'>
								<p>{item.toUpperCase().replace('_', ' ')}</p>
								<span onClick={() => handleRemoveColumn(item)}>
									<DeleteOutlined className='delete' />
								</span>
							</div>
						),
						dataIndex: item,
						key: `${item}-${i}`,
						render: value =>
							value ? (
								<span className='batchChecked'>
									<CheckOutlined />
								</span>
							) : (
								<span className='batchClosed'>
									<CloseOutlined />
								</span>
							),
						width: 100,
					});
				}
			});

			const tableColumns = [...columns];
			setTableColumn(tableColumns);
		}
	}, [funTableData]);

	useEffect(() => {
		if (isLoadView) {
			let fun = [];
			let funData = [];

			const loadViewJson = [...viewJson];
			loadViewJson.forEach(element => {
				fun.push(element.functions.name);
			});
			if (parentBatches.length > 0) {
				const loadTableData =
					parentBatches !== undefined && parentBatches.length > 0
						? parentBatches
						: {};

				loadTableData.forEach(element => {
					let funObj = {};
					funObj[fun[0]] = true;
					funData.push(funObj);
				});

				const mergeArr = loadTableData.map((item, i) =>
					Object.assign({}, item, funData[i])
				);

				const funKey =
					mergeArr !== undefined && mergeArr.length > 0
						? Object.keys(mergeArr[0])
						: [];
				const uniqueArr = (value, index, self) => {
					return self.indexOf(value) === index;
				};
				const funColumn = funKey.filter(uniqueArr);

				funColumn.map((item, i) => {
					columns.push({
						title: item.toUpperCase().replace('_', ' '),
						dataIndex: item,
						key: `${item}-${i}`,
					});
				});
				setTableColumn(columns);
				setFunTableData(mergeArr);
			}
			// });
		}
	}, [isLoadView, parentBatches]);

	const handleRemoveColumn = item => {
		let newColumns = [];
		const tableColumns = tableColumn.filter(ele => {
			return ele.dataIndex !== item;
		});

		const column = columns.filter(ele => {
			return ele.dataIndex !== item;
		});

		columns = column;
		newColumns = tableColumns;

		setTableColumn(newColumns);
	};

	return (
		<Card title='View Summary'>
			<div className='view-summary_lable' style={{ paddingTop: '20px' }}>
				<LabelTag lableName='View ID' lableValue={viewDisplayId} />
				<LabelTag lableName='Status' lableValue={viewStatus} />
				<LabelTag lableName='Version' lableValue={viewVersion} />
			</div>

			<div className='summary-table_block'>
				<Table
					rowClassName={index =>
						index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
					}
					locale={{
						emptyText: (
							<Empty
								image={Empty.PRESENTED_IMAGE_SIMPLE}
								description={
									<span>You will see the created fucntions here</span>
								}
							/>
						),
					}}
					columns={tableColumn}
					dataSource={funTableData}
					size='small'
					scroll={{ y: 250 }}
					pagination={false}
				/>
			</div>
		</Card>
	);
};

export const MemoizedViewSummaryData = React.memo(ViewSummaryData);
