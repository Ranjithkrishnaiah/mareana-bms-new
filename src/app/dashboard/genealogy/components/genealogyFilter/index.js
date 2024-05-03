/**
 * @author Dinesh Kumar <dinesh.kumar@mareana.com>
 * @Mareana - CPV Product
 * @version 1
 * @Last Modified - 14 March, 2022
 * @Last Changed By - Dinesh Kumar
 */

import React, { useEffect, useState } from 'react';
import { Button, Select } from 'antd';
import { getGeanealogyFilter } from '../../../../../services/genealogyService.js';
import './style.scss';
import SelectSearchField from '../../../../../components/SelectSearchField/SelectSearchField';
import Toggle from '../../../../../components/Toggle';
import { showNotification } from '../../../../../duck/actions/commonActions.js';
import { useDispatch } from 'react-redux';

function Filter(props) {
	const [disabled, setDisabled] = useState(true);
	const [isCheck, setisCheck] = useState(true);
	const [isBackward, setisBackward] = useState(true);
	const [isForward, setisForward] = useState(false);
	const [isEmptyPlant, setIsEmptyPlant] = useState(false);
	const [isEmptyProduct, setIsEmptyProduct] = useState(false);
	const [isEmpty, setIsEmptyProductType] = useState(false);
	const [isEmptyBatch, setIsEmptyBatch] = useState(false);

	const [selectParam, setselectParam] = useState({
		plant: '',
		productCode: '',
		batchNum: '',
		productType: '',
	});
	const [paramList, setParamList] = useState({
		plantList: [],
		produtList: [],
		batchList: [],
		productTypeList: [],
	});
	const dispatch = useDispatch();
	useEffect(() => {
		getGenealogyFilterData();
	}, []);

	const handleChangeToggle = e => {
		setisCheck(typeof isCheck === 'boolean' ? !isCheck : e.target.value);
	};

	const onChangeParam = (value, field) => {
		if (value != null) {
			if (field === 'plant') {
				getGenealogyFilterData(
					value,
					selectParam['batchNum'],
					selectParam['productCode'],
					selectParam['productType'],
					'',
					'',
					'',
					''
				);
				setselectParam(prevState => {
					return { ...prevState, plant: value };
				});
				setIsEmptyPlant(false);
			}
			if (field === 'batch_num') {
				getGenealogyFilterData(
					selectParam['plant'],
					value,
					selectParam['productCode'],
					selectParam['productType'],
					'',
					'',
					'',
					''
				);
				setselectParam(prevState => {
					return { ...prevState, batchNum: value };
				});
				setIsEmptyBatch(false);
			} else if (field === 'product_code') {
				getGenealogyFilterData(
					selectParam['plant'],
					selectParam['batchNum'],
					value,
					selectParam['productType'],
					'',
					'',
					'',
					''
				);
				setselectParam(prevState => {
					return { ...prevState, productCode: value };
				});
				setIsEmptyProduct(false);
			} else if (field === 'product_type') {
				getGenealogyFilterData(
					selectParam['plant'],
					selectParam['batchNum'],
					selectParam['productCode'],
					value,
					'',
					'',
					'',
					''
				);
				setselectParam(prevState => {
					return { ...prevState, productType: value };
				});
				setIsEmptyProductType(false);
			}
			setDisabled(false);
		}
	};

	const clearSearch = (e, field) => {
		if (field === 'plant') {
			setselectParam(prevState => {
				return { ...prevState, plant: '' };
			});
			getGenealogyFilterData(
				'',
				selectParam['batchNum'],
				selectParam['productCode'],
				selectParam['productType'],
				'',
				'',
				'',
				''
			);
		} else if (field === 'product') {
			setselectParam(prevState => {
				return { ...prevState, productCode: '' };
			});
			getGenealogyFilterData(
				selectParam['plant'],
				selectParam['batchNum'],
				'',
				selectParam['productType'],
				'',
				'',
				'',
				''
			);
		} else if (field === 'batch') {
			setselectParam(prevState => {
				return { ...prevState, batchNum: '' };
			});
			getGenealogyFilterData(
				selectParam['plant'],
				'',
				selectParam['productCode'],
				selectParam['productType'],
				'',
				'',
				'',
				''
			);
		} else if (field === 'product_type') {
			setselectParam(prevState => {
				return { ...prevState, productType: '' };
			});
			getGenealogyFilterData(
				selectParam['plant'],
				selectParam['batchNum'],
				selectParam['productCode'],
				'',
				'',
				'',
				'',
				''
			);
		}
	};

	const onSearchParam = (type, field) => {
		if (type != null) {
			if (field === 'plant') {
				getGenealogyFilterData(
					selectParam['plant'],
					selectParam['batchNum'],
					selectParam['productCode'],
					selectParam['productType'],
					'',
					type,
					'',
					''
				);
				setIsEmptyPlant(false);
			} else if (field === 'product_code') {
				getGenealogyFilterData(
					selectParam['plant'],
					selectParam['batchNum'],
					selectParam['productCode'],
					selectParam['productType'],
					'',
					'',
					type,
					''
				);

				setIsEmptyProduct(false);
			} else if (field === 'batch_num') {
				getGenealogyFilterData(
					selectParam['plant'],
					selectParam['batchNum'],
					selectParam['productCode'],
					selectParam['productType'],
					type,
					'',
					'',
					''
				);

				setIsEmptyBatch(false);
			} else if (field === 'product_type') {
				getGenealogyFilterData(
					selectParam['plant'],
					selectParam['batchNum'],
					selectParam['productCode'],
					selectParam['productType'],
					'',
					'',
					'',
					type
				);

				setIsEmptyProductType(false);
			}
		}
	};
	const getGenealogyFilterData = async (
		selectedPlantValue,
		selectedBatchValue,
		selectedProductValue,
		selectedProductType,
		batchText,
		plantText,
		matText,
		productText
	) => {
		let reqFilter = {
			batch_no: selectedBatchValue ? selectedBatchValue : '',
			material: selectedProductValue ? selectedProductValue : '',
			plant_no: selectedPlantValue ? selectedPlantValue : '',
			product_type: selectedProductType ? selectedProductType : '',
			batchText: batchText ? batchText : '',
			plantText: plantText ? plantText : '',
			matText: matText ? matText : '',
			productText: productText ? productText : '',
		};

		try {
			const filterRes = await getGeanealogyFilter(reqFilter);

			if (filterRes.statuscode === 200) {
				setParamList(() => {
					return {
						plantList: filterRes && filterRes.plant_no,
						batchList: filterRes && filterRes.batch_no,
						produtList: filterRes && filterRes.material,
						productTypeList: filterRes && filterRes.product_type,
					};
				});
			} else if (filterRes.data.statuscode === 400) {
				dispatch(showNotification('error', filterRes.data.message));
			}
		} catch (err) {
			dispatch(showNotification('error', err));
		}
	};

	const OnSearchTree = () => {
		let paramDetail = {
			plant: selectParam['plant'],
			product: selectParam['productCode'],
			batch: selectParam['batchNum'],
			productType: selectParam['productType'],
			treeType: isCheck ? 'Backward' : 'Forward',
		};

		if (paramDetail.plant === '') {
			setIsEmptyPlant(true);
			setIsEmptyProduct(false);
			setIsEmptyBatch(false);
			setIsEmptyProductType(false);
		} else if (paramDetail.product === '') {
			setIsEmptyProduct(true);
			setIsEmptyPlant(false);
			setIsEmptyBatch(false);
			setIsEmptyProductType(false);
		} else if (paramDetail.batch === '') {
			setIsEmptyBatch(true);
			setIsEmptyPlant(false);
			setIsEmptyProduct(false);
			setIsEmptyProductType(false);
		} else {
			props.parameterDetails(paramDetail);
			setIsEmptyPlant(false);
			setIsEmptyProduct(false);
			setIsEmptyBatch(false);
			setIsEmptyProductType(false);
		}

		if (isCheck) {
			setisBackward(true);
			setisForward(false);
		} else {
			setisForward(true);
			setisBackward(false);
		}
	};

	const handleClear = () => {
		setselectParam(prevState => {
			return {
				...prevState,
				plant: '',
				productCode: '',
				batchNum: '',
				productType: '',
			};
		});
		setDisabled(true);
		setIsEmptyPlant(false);
		setIsEmptyProduct(false);
		setIsEmptyBatch(false);
		setIsEmptyProductType(false);
		getGenealogyFilterData();
	};

	const optionsPlant = paramList['plantList'].map((item, index) => (
		<Select.Option key={index} value={item}>
			{item}
		</Select.Option>
	));
	const optionsBatch = paramList['batchList'].map((item, index) => (
		<Select.Option key={index} value={item}>
			{item}
		</Select.Option>
	));
	const optionsProduct = paramList['produtList'].map((item, index) => (
		<Select.Option key={index} value={item}>
			{item}
		</Select.Option>
	));
	const optionsProductType = paramList['productTypeList'].map((item, index) => (
		<Select.Option key={index} value={item}>
			{item}
		</Select.Option>
	));

	return (
		<div className='param-filter-wrap'>
			<div className='param-filter'>
				<SelectSearchField
					showSearch
					label='Plant *'
					placeholder='Select'
					onChangeSelect={value => onChangeParam(value, 'plant')}
					onSearchSelect={type => onSearchParam(type, 'plant')}
					options={optionsPlant}
					handleClearSearch={e => clearSearch(e, 'plant')}
					error={isEmptyPlant ? 'Please select plant' : null}
					selectedValue={selectParam['plant']}
				/>
				<SelectSearchField
					showSearch
					label='Product *'
					placeholder='Select'
					onChangeSelect={value => onChangeParam(value, 'product_code')}
					onSearchSelect={type => onSearchParam(type, 'product_code')}
					options={optionsProduct}
					handleClearSearch={e => clearSearch(e, 'product')}
					error={isEmptyProduct ? 'Please select product' : null}
					selectedValue={selectParam['productCode']}
				/>
				<SelectSearchField
					showSearch
					label='Batch *'
					placeholder='Select'
					onChangeSelect={value => onChangeParam(value, 'batch_num')}
					onSearchSelect={type => onSearchParam(type, 'batch_num')}
					handleClearSearch={e => clearSearch(e, 'batch')}
					error={isEmptyBatch ? 'Please select batch' : null}
					options={optionsBatch}
					selectedValue={selectParam['batchNum']}
				/>
				<SelectSearchField
					showSearch
					label='Product Type '
					placeholder='Select'
					onChangeSelect={value => onChangeParam(value, 'product_type')}
					onSearchSelect={type => onSearchParam(type, 'product_type')}
					handleClearSearch={e => clearSearch(e, 'product_type')}
					//error={isEmptyProductType ? 'Please select product type' : null}
					options={optionsProductType}
					selectedValue={selectParam['productType']}
				/>
				<Toggle
					name='isChecked'
					checked={isCheck}
					inline={true}
					labels={['Backward', 'Forward']}
					handleChange={handleChangeToggle}
				/>
			</div>
			<div className='param-filter-btn'>
				<Button
					type='primary'
					className='custom-secondary-btn'
					onClick={OnSearchTree}
					disabled={disabled}>
					Search
				</Button>
				<Button
					type='link'
					className='custom-secondary-btn-link'
					onClick={handleClear}>
					Clear
				</Button>
			</div>
		</div>
	);
}

export default Filter;
