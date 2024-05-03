/**
 * @author Dinesh Kumar <dinesh.kumar@mareana.com>
 * @Mareana - CPV Product
 * @version  1
 * @Last Modified - 31 March, 2022
 * @Last Changed By - Dinesh
 */

import React, { useState } from 'react';
import {
	ArrowLeftOutlined,
	DownloadOutlined,
	InboxOutlined,
} from '@ant-design/icons';
import { Tabs, Modal, Upload, message, Button } from 'antd';
import Filter from './genealogyFilter';
import TreePlot from './TreePlot/TreePlot';
import batchIcon from '../../../../assets/images/material.png';
import { useDispatch } from 'react-redux';
import {
	hideLoader,
	showLoader,
	showNotification,
} from '../../../../duck/actions/commonActions';
import {
	getBackwardData,
	getBatchInfo,
	getProcessInfo,
	getForwardData,
	pbrFileUpload,
	downloadDataTable,
} from '../../../../services/genealogyService';
import popupicon from '../../../../assets/images/popup.png';
import GenealogyDrawer from '../components/genealogyDrawer/index.js';
import GenealogyDataTable from './genealogyDataTable';
import ScreenHeader from '../../../../components/ScreenHeader/screenHeader';
import genealogyLanding from '../../../../assets/images/genealogy-landing.png';
import BreadCrumbWrapper from '../../../../components/BreadCrumbWrapper';

const { TabPane } = Tabs;
const { Dragger } = Upload;

let initialPanes = [
	{ title: ' ', content: '', key: '1', closable: false, class: '' },
];
function Genealogy() {
	const [chartType, setchartType] = useState('backward');
	const [isBackward, setisBackward] = useState(true);
	const [isForward, setisForward] = useState(false);
	const [genealogyData, setGenealogyData] = useState([]);
	const [showTree, setShowTree] = useState(false);
	const [productCode, setProductCode] = useState('');
	const [activateKey, setActivateKey] = useState('1');
	const [isDrawer, setIsDrawer] = useState(false);
	const [batchInfo, setBatchInfo] = useState([]);
	const [purchaseInfo, setPurchaseInfo] = useState([]);
	const [processInput, setProcessInput] = useState([]);
	const [processOutput, setProcessOutput] = useState([]);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [isDrawerRef, setIsDrawerRef] = useState(false);
	const [panes, setPanes] = useState(initialPanes);
	const [limsBatchInfo, setLimsBatchInfo] = useState([]);
	const [showView, setShowView] = useState(false);
	const [nodeType, setNodeType] = useState('');
	const [limsBatch, setLimsBatch] = useState('');
	const [isUploadVisible, setIsUploadVisible] = useState(false);
	const [selectedFileList, setSelectedFileList] = useState([]);
	const [selectedFile, setSelectedFile] = useState(null);
	const [uploadFile, setUploadFile] = useState();
	const [uploading, setUploading] = useState(false);
	const [uploadId, setUploadId] = useState('');

	const [type, setType] = useState('');

	const dispatch = useDispatch();

	const onClickNode = node => {
		if (node.clickType === 'backward') {
			setGenealogyData([]);
			let _reqBackward = {
				levels: 5,
				batch_id: node.nodeId,
				backward: true,
			};
			getBackwardGeneology(_reqBackward);
			setActivateKey('2');
			setchartType('backward');
			setProductCode(node.product);
		} else if (node.clickType === 'forward') {
			setGenealogyData([]);
			let _reqFor = {
				levels: 5,
				batch_id: node.nodeId,
				backward: false,
			};
			getForwardGeneology(_reqFor);
			setActivateKey('2');
			setchartType('forward');
			setProductCode(node.product);
		} else if (node.clickType === 'view') {
			if (node.nodeType === 'Material') {
				let batchInfoDetails = {
					product: node.nodeData.matNo,
					batch: node.nodeData.batchNo,
					product_desc: node.nodeData.matDesc,
					node_id: node.nodeData.nodeId,
				};
				setType(node.nodeData.type);
				setBatchInfo(batchInfoDetails);
				setIsDrawerOpen(true);
				setIsDrawerRef(false);
				setNodeType(node.nodeType);
				let nodeSplit = node.nodeId.split('|');

				let _reqBatchInfo = {
					entity_type: 'Lims',
					relation_id: 'batch_to_lims',
					batch_id: nodeSplit[2],
					// 'ABV4103',
				};
				setLimsBatch(nodeSplit[2]);
				getNodeBatchInfo(_reqBatchInfo);
			} else if (node.nodeType === 'Process Order') {
				setNodeType(node.nodeType);
				let _reqProcessInput = {
					entity_type: 'Batch',
					process_order_id: `${node.nodeData.plant}|${node.nodeData.poNo}`,
					relation_id: 'input_process_order_to_batch',
				};
				let _reqProcessOutput = {
					entity_type: 'Batch',
					process_order_id: `${node.nodeData.plant}|${node.nodeData.poNo}`,
					relation_id: 'output_batch_to_process_order',
				};
				setIsDrawerOpen(true);
				setIsDrawerRef(false);
				setNodeType(node.nodeType);
				getNodeProcessInput(_reqProcessInput);
				getNodeProcessOutput(_reqProcessOutput);
			} else if (node.nodeType === 'Purchase Order') {
				let purchaseInfo = {
					node_id: node.nodeData.nodeId,
					plant: node.nodeData.plant,
					purchase_id: node.nodeData.pur_ord_no,
					vendor_no: node.nodeData.vendor_no,
				};
				setPurchaseInfo(purchaseInfo);
				setIsDrawerOpen(true);
				setIsDrawerRef(false);
				setNodeType(node.nodeType);
			}
		} else if (node.clickType === 'upload_files') {
			const uploadNodeId =
				node.nodeType === 'Purchase Order'
					? node.nodeId
					: node.nodeType === 'Material'
					? node.product
					: node.nodeType === 'Process Order'
					? node.nodeData.poNo
					: '';
			setUploadId(uploadNodeId);
			setIsUploadVisible(true);
			setSelectedFileList([]);
		}
	};

	const selectedParameter = param => {
		const product = param && param.product.split('-');
		const plant = param && param.plant.split('-');
		const selectedValue = plant[0] + '|' + product[0] + '|' + param.batch;
		setShowView(false);
		setGenealogyData([]);
		if (param.treeType === 'Backward') {
			let _reqBack = {
				levels: 5,
				batch_id: selectedValue.replace(/\s/g, ''),
				backward: true,
				mat_type: param.productType,
			};
			//setActivateKey('2');
			setisBackward(true);
			setisForward(false);
			getBackwardGeneology(_reqBack);
			setchartType('backward');
			setProductCode(product[0]);
		} else {
			let _reqFor = {
				levels: 5,
				batch_id: selectedValue.replace(/\s/g, ''),
				backward: false,
				mat_type: param.productType,
			};
			//setActivateKey('2');
			setisBackward(false);
			setisForward(true);
			getForwardGeneology(_reqFor);
			setchartType('forward');
			setProductCode(product[0]);
		}

		if (isDrawerRef === false) {
			initialPanes.push({
				title: '',
				content: '',
				key: '2',
				closable: true,
				class: 'tree-wrap site-drawer-render-in-current-wrapper',
			});
			setPanes(initialPanes);
		} else {
			console.log(isDrawerRef);
		}
	};
	/**
	 * TODO: get backward genealogy data from selected parameters or from on node click
	 */
	const getBackwardGeneology = async _reqBack => {
		try {
			dispatch(showLoader());
			const backwardRes = await getBackwardData(_reqBack);

			if (backwardRes.statuscode === 200) {
				setGenealogyData(backwardRes.data);
				setisBackward(true);
				setisForward(false);
				setShowTree(true);
				setIsDrawerRef(true);
				setActivateKey('2');
				dispatch(hideLoader());
			} else if (backwardRes.status === 400) {
				setGenealogyData([]);
				dispatch(hideLoader());
				dispatch(showNotification('error', 'No Data Found'));
				setShowTree(false);
				setActivateKey('1');
			}
		} catch (error) {
			dispatch(hideLoader());
			dispatch(showNotification('error', error));
		}
	};
	/**
	 * TODO: get forward genealogy data from selected parameters or from on node click
	 */
	const getForwardGeneology = async _reqFor => {
		try {
			dispatch(showLoader());
			const forwardRes = await getForwardData(_reqFor);
			if (forwardRes.statuscode === 200) {
				setGenealogyData(forwardRes.data);
				setisBackward(false);
				setisForward(true);
				setShowTree(true);
				setIsDrawerRef(true);
				setActivateKey('2');
				dispatch(hideLoader());
			} else if (forwardRes.status === 400) {
				dispatch(hideLoader());
				dispatch(showNotification('error', 'No Data Found'));
				setShowTree(false);
				setActivateKey('1');
			}

			dispatch(hideLoader());
		} catch (error) {
			dispatch(hideLoader());
			dispatch(showNotification('error', error));
		}
	};

	/**
	 * TODO: get bacth info of node
	 */
	const getNodeBatchInfo = async _reqBatch => {
		try {
			dispatch(showLoader());
			const batchRes = await getBatchInfo(_reqBatch);
			if (batchRes.length > 0) {
				setLimsBatchInfo(batchRes);
			} else if (batchRes.status === 404) {
				setLimsBatchInfo();
				dispatch(showNotification('error', batchRes.detail));
			}
			dispatch(hideLoader());
		} catch (error) {
			dispatch(hideLoader());
			dispatch(showNotification('error', 'No Data Found'));
		}
	};

	/**
	 *TODO: get Process Input of node
	 */
	const getNodeProcessInput = async _reqProcessInfo => {
		try {
			dispatch(showLoader());
			const processResInput = await getProcessInfo(_reqProcessInfo);
			if (processResInput.length > 0) {
				setProcessInput(processResInput);
			}
			dispatch(hideLoader());
		} catch (error) {
			dispatch(hideLoader());
			dispatch(showNotification('error', 'No Data Found'));
		}
	};

	/**
	 *TODO: get Process output of node
	 */
	const getNodeProcessOutput = async _reqProcessInfo => {
		try {
			dispatch(showLoader());
			const processResOutput = await getProcessInfo(_reqProcessInfo);
			if (processResOutput.length > 0) {
				setProcessOutput(processResOutput);
			}
			dispatch(hideLoader());
		} catch (error) {
			dispatch(hideLoader());
			dispatch(showNotification('error', 'No Data Found'));
		}
	};

	const isDrawerVisible = val => {
		setIsDrawer(val);
		setShowView(true);
		setIsDrawerOpen(false);

		setActivateKey('3');
	};

	const onCloseDrawer = val => {
		setIsDrawerOpen(val);
	};

	const handleChangeTab = activateKey => {
		setActivateKey(activateKey);
	};

	const onEditTab = (targetKey, action) => {
		remove(targetKey);
	};

	const downloadFile = async val => {
		let uri =
			'SELECT * FROM tran_product_params WHERE batch_num=' + `'${limsBatch}'`;

		let login_response = JSON.parse(localStorage.getItem('login_details'));
		let req = {
			export_csv: true,
			query: uri,
			table_name: 'tran_product_params',
			'x-access-token': login_response.token ? login_response.token : '',
			'resource-name': 'GENEALOGY',
		};
		try {
			dispatch(showLoader());
			const download = await downloadDataTable(req);

			dispatch(hideLoader());
		} catch (error) {
			dispatch(hideLoader());
			dispatch(showNotification('error', 'error'));
		}
	};

	const fileUpload = async _fileRequest => {
		try {
			setUploading(true);
			const fileResponse = await pbrFileUpload(_fileRequest);
			if (fileResponse.Status === 202) {
				dispatch(showNotification('success', fileResponse.Message));
				setUploading(false);
			} else {
				dispatch(showNotification('error', fileResponse.Message));
			}
			dispatch(hideLoader());
		} catch (error) {
			dispatch(hideLoader());
			dispatch(showNotification('error', error));
		}
	};

	const handleClickUpload = () => {
		const file = uploadFile;
		fileUpload(file);
	};

	const remove = targetKey => {
		let newActiveKey = activateKey;
		let lastIndex;
		panes.forEach((pane, i) => {
			if (pane.key === targetKey) {
				lastIndex = i - 1;
			}
		});
		initialPanes.forEach((pane, i) => {
			if (pane.key === targetKey) {
				lastIndex = i - 1;
			}
		});
		const newPanes = panes.filter(pane => pane.key !== targetKey);
		const newInitPanes = initialPanes.filter(pane => pane.key !== targetKey);
		if (newInitPanes.length && newActiveKey === targetKey) {
			if (lastIndex >= 0) {
				newActiveKey = newInitPanes[lastIndex].key;
			} else {
				newActiveKey = newInitPanes[0].key;
			}
		}
		if (newPanes.length && newActiveKey === targetKey) {
			if (lastIndex >= 0) {
				newActiveKey = newPanes[lastIndex].key;
			} else {
				newActiveKey = newPanes[0].key;
			}
		}

		initialPanes = newInitPanes;
		setIsDrawerRef(false);
		setPanes(newPanes);
		setActivateKey(newActiveKey);
	};

	const onChangeFile = info => {
		const nextState = {};
		if (info.file.status === 'uploading') {
			nextState.selectedFileList = [info.file];
		} else if (info.file.status === 'done') {
			nextState.selectedFileList = [info.file];
			nextState.selectedFile = info.file;

			var formData = new FormData();
			formData.append('file', info.file.originFileObj);
			formData.append('method', 'aws');

			setUploadFile(formData);
		} else if (info.file.status === 'error') {
			nextState.selectedFileList = [];
			nextState.selectedFile = null;

			message.error(`${info.file.name} file upload failed.`);
		}

		setSelectedFile(nextState.selectedFile);
		setSelectedFileList(nextState.selectedFileList);
	};

	const files = {
		progress: {
			strokeColor: {
				'0%': '#108ee9',
				'100%': '#87d068',
			},
			strokeWidth: 8,
			showInfo: true,
			format: percent => `${parseFloat(percent.toFixed(2))}%`,
		},
		onDrop(e) {
			console.log('Dropped files', e.dataTransfer.files);
		},
	};

	const dummyRequest = ({ onSuccess }) => {
		setTimeout(() => {
			onSuccess('ok');
		}, 0);
	};

	const handleCancel = () => {
		setIsUploadVisible(false);
		setUploading(false);
	};

	return (
		<div className='custom-wrapper'>
			<BreadCrumbWrapper />
			<div className='custom-content-layout'>
				{activateKey == '1' ? (
					<div style={{ marginBottom: '9px' }}>
						<ScreenHeader
							bannerbg={{
								background: 'linear-gradient(180deg, #FFFFFF 0%, #B9D6FF 100%)',
							}}
							title='Hello there,'
							description='Shall we get down to tracing some batches and materials?'
							source={genealogyLanding}
							sourceClass='geanealogy-image'
						/>
					</div>
				) : (
					<></>
				)}

				<Tabs
					className='custom-tabs'
					activeKey={activateKey}
					onChange={handleChangeTab}
					onEdit={onEditTab}
					hideAdd
					//</div>type='editable-card'
				>
					<TabPane tab='Select Parameter' key='1'>
						<Filter parameterDetails={selectedParameter} />
					</TabPane>
					<TabPane
						closable={true}
						tab={
							genealogyData &&
							genealogyData.length > 0 && (
								<p className='tab-label'>
									<img className='tree-type-icon' src={batchIcon} />
									{productCode}-{chartType}
								</p>
							)
						}
						className='tree-wrap site-drawer-render-in-current-wrapper'
						key='2'>
						<>
							{genealogyData && genealogyData.length > 0 && (
								<TreePlot
									chartType={chartType}
									Backward={isBackward}
									Forward={isForward}
									data={genealogyData[0]}
									nodeClick={onClickNode}
									firstNode={productCode}
									//handleChartClick={handleClickNode}
								/>
							)}
							<GenealogyDrawer
								type={type}
								drawerVisible={isDrawerOpen}
								isDrawer={isDrawerVisible}
								drawerClose={onCloseDrawer}
								limsBatchInfo={limsBatchInfo}
								purchaseInfo={purchaseInfo}
								batchInfo={batchInfo}
								processInput={processInput}
								processOutput={processOutput}
								fileDownload={downloadFile}
								productCode={productCode}
								productType={chartType}
							/>
							<Modal
								width={520}
								visible={isUploadVisible}
								title={'Upload file to ' + uploadId}
								className='file-upload-modal'
								onCancel={handleCancel}
								footer={null}>
								<Dragger
									{...files}
									onChange={onChangeFile}
									customRequest={dummyRequest}
									fileList={selectedFileList}>
									<p className='ant-upload-drag-icon'>
										<InboxOutlined />
									</p>
									<p className='ant-upload-text'>
										Click or drag file to this area to upload
									</p>
									<p className='ant-upload-hint'>
										Upload files of PDF or PNG format. You may carry out single
										or bulk upload. Strictly refrain from uploading company data
										or other band files
									</p>
								</Dragger>
								{selectedFileList.length > 0 ? (
									<div className='file-upload-section'>
										<div className='upload-btn'>
											<Button
												disabled={selectedFileList.length === 0}
												loading={uploading}
												onClick={() => handleClickUpload()}>
												{uploading ? 'Uploading' : 'Upload'}
											</Button>
											<Button onClick={handleCancel}>Cancel</Button>
										</div>
									</div>
								) : null}
							</Modal>
						</>
					</TabPane>
					<TabPane
						closable={true}
						tab={
							showView && (
								<p className='tab-label'>
									<img className='tree-type-icon' src={popupicon} />
									Popout - {productCode}
								</p>
							)
						}
						key='3'>
						<div className='popout-table'>
							<div className='drawer-title'>
								<img className='tree-type-icon' src={batchIcon} />
								<p>
									{productCode}-{type}
								</p>
								<span className='download-file'>
									<DownloadOutlined />
								</span>
							</div>
							<GenealogyDataTable
								className={isDrawer ? 'drawer-collapse' : 'popout-collapse'}
								type={nodeType}
								limsBatchInfo={limsBatchInfo}
								purchaseInfo={purchaseInfo}
								batchInfo={batchInfo}
								processInput={processInput}
								processOutput={processOutput}
							/>
						</div>
					</TabPane>
				</Tabs>
			</div>
		</div>
	);
}

export default Genealogy;
