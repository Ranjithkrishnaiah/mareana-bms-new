/**
 * @author Dinesh Kumar <dinesh.kumar@mareana.com>
 * @Mareana - CPV Product
 * @version  1
 * @Last Modified - 4 April, 2022
 * @Last Changed By - Dinesh
 */
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Tree, message, Input } from 'antd';
import { PlusOutlined, CheckOutlined } from '@ant-design/icons';
import {
	batchCoverage,
	sendSelectedParamData,
} from '../../../../../duck/actions/viewAction';
import './style.scss';
const { TreeNode } = Tree;
const { Search } = Input;

let setKey = [];
let selectedData = [];
let finalData = [];
const MaterialTree = props => {
	const [selectedKeys, setSelectedKeys] = useState([]);
	const [checkedKeys, setCheckedKeys] = useState([]);
	const [count, setCount] = useState('');
	const [selectedAllKey, setSelectedAllKey] = useState([]);
	const [expandedKeys, setExpandedKeys] = useState([]);
	const [searchValue, setSearchValue] = useState('');
	const [autoExpandParent, setAutoExpandParent] = useState();

	const dispatch = useDispatch();

	const { materialsList, parentBatches } = props;

	const onSelect = (keys, info) => {
		setSelectedKeys(keys);
	};
	const onCheck = checkedKeys => {
		setCheckedKeys(checkedKeys);
	};
	const handleClickParam = (e, keys, param, record) => {
		let rowData = {};
		let batchData = {};
		let newBatchData = {};

		setKey.push(keys);
		setSelectedAllKey[setKey];
		let tree = [...materialsList];
		let molBatch = [...parentBatches];

		tree.forEach(a => {
			a.children.forEach(b => {
				b.children.forEach(c => {
					if (c.key === keys) {
						selectedData.push(c);
					}
				});
			});
		});
		molBatch.map((el, index) => {
			if (record.batches.includes(el.batch)) {
				batchData[el.batch] = true;
				newBatchData[el.batch] = true;
			} else {
				batchData[el.batch] = false;
				newBatchData[el.batch] = false;
			}
		});
		batchData['id'] = count;

		setCount(count + 1);
		const indexDuplicate = selectedData.findIndex(
			x => x.parameter_name == param
		);

		if (indexDuplicate != -1) {
			rowData = Object.assign(batchData);
			rowData.sourceType = 'material';
			rowData.parameter_name = record.parameter_name;
			rowData.coverage = record.coverage;
			rowData.key = record.key;
			rowData.primary = 0;
			rowData.aggregation = '';

			let data = { ...rowData };
			finalData.push(data);

			dispatch(batchCoverage(newBatchData));
			dispatch(sendSelectedParamData(finalData));
		} else {
			message.error('Function already exists');
		}
	};
	const treeMap = materialsList;

	return (
		<>
			{treeMap &&
				treeMap.map(item => {
					return (
						<Tree
							//	checkable
							onSelect={onSelect}
							onCheck={onCheck}
							checkedKeys={checkedKeys}
							selectedKeys={selectedKeys}
							className='custom-treenode'>
							<TreeNode title={item.process_step} key={item.key}>
								{item.children.map(a => {
									return (
										<TreeNode title={a.product_description} key={a.key}>
											{a.children.map(b => {
												return (
													<TreeNode
														title={
															<div className='treenode-block'>
																<div className='tree-block-param'>
																	<p className='treenode-param'>
																		{b.parameter_name}
																	</p>
																	<p className='treenode-coverage'>
																		{b.coverage}
																	</p>
																</div>
																<span
																	onClick={e =>
																		handleClickParam(
																			e,
																			b.key,
																			b.parameter_name,
																			b
																		)
																	}>
																	{!selectedKeys ? (
																		<CheckOutlined />
																	) : (
																		<PlusOutlined />
																	)}
																</span>
															</div>
														}
														key={b.key}
													/>
												);
											})}
										</TreeNode>
									);
								})}
							</TreeNode>
						</Tree>
					);
				})}
		</>
	);
};

export default MaterialTree;
