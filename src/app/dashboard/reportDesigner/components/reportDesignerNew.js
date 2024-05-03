/**
 * @author Mihir Bagga <mihir.bagga@mareana.com>
 * @Mareana - CPV Product
 * @version 1
 * @Last Modified - 14 March, 2022
 * @Last Changed By - @Mihir 
 */
import './stylesNew.scss';
import React, { useEffect, useState } from 'react';
import {
  BlockOutlined,
  CloudUploadOutlined,
  EllipsisOutlined
} from '@ant-design/icons';
import { useLocation } from 'react-router';
import {
  Form,
  Select,
  Button,
  Modal,
  Table,
  Input,
  Empty,
  Dropdown,
  Menu
} from 'antd';
// import ChartSelector from './reportDesignerFilter/chartSelector';
import ReportDesignerForm from './reportDesignerForm/reportDesignerForm';
import ReportDesignerDynamicSections from './reportDesignerDynamicSections/reportDesignerDynamicSections'
// import ReportDesigneTable from './reportDesignerDynamicSections/ReportDesigneTable'
import { getViews, getCharts, saveReportDesign, getReports } from '../../../../services/reportDesignerServices';
import SaveModal from '../../../../components/SaveModal/saveModal'
import { useDispatch } from 'react-redux';
import { sendReport, screenChange } from '../../../../duck/actions/reportDesignerAction';
import { showLoader, hideLoader, showNotification } from '../../../../duck/actions/commonActions';
import Signature from '../../../../components/ElectronicSignature/signature'
import queryString from "query-string";
import { loginUrl } from '../../../../services/loginService';
import { adenabled } from '../../../../config/config';
import { sendUrl } from '../../../../duck/actions/loginAction';
import BreadCrumbWrapper from '../../../../components/BreadCrumbWrapper';
import { loadReport } from '../../../../services/reportDesignerServices';


//Columns For The view Selection modal
const columns = [
  {
    title: 'Report ID',
    dataIndex: 'rep_disp_id',
    key: 'rep_disp_id',
    render: (text, record) => {
      return {
        props: {
          style: { background: record.color },
        },
        children: <div>{text}</div>,
      };
    },
  },
  {
    title: 'Report Name',
    dataIndex: 'rep_name',
    key: 'rep_name',
    render: (text, record) => {
      return {
        props: {
          style: { background: record.color },
        },
        children: <div>{text}</div>,
      };
    },

  },
  {
    title: 'Report Status',
    dataIndex: 'rep_status',
    key: 'rep_status',
    render: (text, record) => {
      return {
        props: {
          style: { background: record.color },
        },
        children: <div>{text}</div>,
      };
    },
  },
  {
    title: 'Created By',
    dataIndex: 'created_by',
    key: 'created_by',
    render: (text, record) => {
      return {
        props: {
          style: { background: record.color },
        },
        children: <div>{text}</div>,
      };
    },
  },
];

function ReportDesignerNew(props) {

  const { loadData } = props
  const { Option } = Select;
  const location = useLocation()

  const [loading, setLoading] = useState(false);
  const [isLoad, setIsLoad] = useState(false);
  const [isSave, setIsSave] = useState(false);
  const [reportName, setReportName] = useState('');
  const [isNew, setIsNew] = useState(true);
  const [visible, setVisible] = useState(false);
  const [popvisible, setPopVisible] = useState(false);
  const [filterTable, setFilterTable] = useState(null);
  const [viewId, setViewId] = useState('');
  const [reportId, setReportId] = useState('');
  const [viewVersion, setViewVersion] = useState('');
  const [viewIdVersion, setViewIdVersion] = useState('');
  const [selectedChartList, setSelectedChartList] = useState([]);
  const [status, setStatus] = useState('');
  const [viewList, setViewList] = useState('');
  const [chartList, setChartList] = useState([]);
  const [reportList, setReportList] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [formData, setFormData] = useState({});
  const [mainJson, setMainJson] = useState({});
  const [isPublish, setIsPublish] = useState(false);
  const [params, setParams] = useState(false)
  const [selectedSectionCharts, setSelectedSectionCharts] = useState([])
  const [sectionCharts, setCharts] = useState([])
  const [publishResponse, setPublishResponse] = useState({});
  const [approveReject, setApproveReject] = useState('')
  const [sectionKeys, setSectionKeys] = useState({})
  const [sectionAddedCharts, setSectionAddedCharts] = useState({})
  const [chartsLayout, setChartsLayout] = useState({})
  const [ad, setAd] = useState(false)
  const [form] = Form.useForm();

  const menu = (
    <Menu>
      <Menu.Item onClick={() => {
        PrepareJson(mainJson, 'save_as')
      }}>
        Save As
      </Menu.Item>
    </Menu>
  );


  const dispatch = useDispatch();

  // const savedData = useSelector((state) => state.reportDesignerReducer);


  useEffect(() => {
    const params = queryString.parse(location.search);
    if (Object.keys(params).length > 0) {
      dispatch(showLoader())
      unloadUrl(params)
    }

    getViewsList();
    getReportList();
  }, []
  );

  useEffect(() => {
    if (loadData) {
      let data = loadData.report_designer ? loadData.report_designer : {}
      if (data.data)
        LoadData(data.data)
    }
  }, []
  );
  useEffect(() => { form.resetFields() }, [formData]);

  const unloadUrl = async (params) => {
    try {
      dispatch(showLoader())
      setParams(true);
      let req = { report_displ_id: params.id}
      let data = await loadReport(req)
      data = data.report_designer
      data = data.data

      setReportId(params.id)
      if (data) {
        LoadData(data)
        setTimeout(() => {
          setIsLoad(true);
          setVisible(false)
          setPopVisible(false);
          dispatch(hideLoader())
        }, 2000)
      }
      else {
        dispatch(hideLoader())
        dispatch(showNotification('error', "Error in loading data"))
      }
    }
    catch (err) {
      dispatch(showNotification('error', err))
    }
  }

  const onLogin = async () => {
    window.open(`${loginUrl}?is_ui=true&ui_type='sign`, '_self')
  }

  const setSectionCharts = (chartName, addedCharts) => {
    selectedSectionCharts.push(chartName)
    setSelectedSectionCharts(selectedSectionCharts)
    setCharts(addedCharts)
  }
  const setSectionAddKey = (data) => {
    setSectionKeys(data)
  }
  const setSectionAddCharts = (data) => {
    setSectionAddedCharts(data)
  }


  const onApprove = (item) => {
    localStorage.setItem('status', item);
    //setApproveReject(item);
    window.open(`${loginUrl}?is_ui=true&ui_type=sign`, '_self')
    dispatch(sendUrl(window.location.href));
    localStorage.setItem('redirectUrl', window.location.href);
  }
  const checkChanges = (reportData, mainJson) => {

    let json_data = reportData
    let jayson = mainJson

    json_data = json_data[0] ? json_data[0] : []
    json_data = json_data['layout_info'] ? json_data['layout_info'] : {}

    if (Object.keys(json_data).length > 0 && Object.keys(jayson).length > 0) {
      return true
    }
    else if (Object.keys(json_data).length == 0 && Object.keys(jayson).length == 0) {
      return true
    }
    else if (Object.keys(json_data).length == 0 && Object.keys(jayson).length > 0) {
      return true
    }
    else
      return false
  };

  const mapViewList = viewList && viewList.length > 0 ? viewList : []
  const mapReportList = reportList && reportList.length > 0 ? reportList : []

  const OnNewClick = () => {
    setIsNew(true);
    setIsLoad(false);
    setFormData({})
    setSelectedChartList([])
    setReportName('')
    setViewVersion('')
    setReportId('')
    setViewId('')
    setViewIdVersion('')
    setStatus('NEW')
    setChartList([])
  }

  const onOk = async () => {
    const unloadResponse = await unLoadJson(reportData);
    if (unloadResponse) {
      dispatch(hideLoader());
      setIsLoad(true);
      setVisible(false)
      setPopVisible(false);
    }
    else {
      dispatch(hideLoader());
    }
  }


  // Get form values
  const handleValuesChange = (changedValues, values) => {
    setMainJson(convertToJson(values));
  };

  const handleClose = () => {
    setIsPublish(false)
  };

  const PublishResponse = (res) => {
    setPublishResponse(res)
    setStatus(res.rep_stauts)
  }
  //Get view table data
  const getViewsList = () => {
    let req = {};
    getViews(req).then((res) => {
      setViewList(res['Data']);
    });
  };

  const getReportList = () => {
    let req = { rep_status: 'all' };
    getReports(req).then((res) => {
      setReportList(res['Data']);
    });
  };

  // const setPublish = () => {
  //   setIsPublish(true)
  // };

  const getReportData = async (rep_id, rep_status) => {
    // message.success(`${rep_id} selected`)
    let req = { rep_status: rep_status ? rep_status : 'DRFT' };
    if (rep_id)
      req['rep_disp_id'] = rep_id
    let data = await getReports(req)

    if (data['Data']) {
      setReportData(data['Data']);
      return data['Data']
    }
  };


  //Get charts based on viewId-version
  const getChartsList = (version) => {
    if (viewId.length > 0)
      setSelectedChartList([])
    // message.success(`${version} selected`)
    let req = version;
    getCharts(req).then((res) => {

      if (res['status-code'] === 200)
        setChartList(res['data']);
      else
        setChartList([]);
    });
  };

  // Converting form json into layout info required by the report generator json
  const convertToJson = (json_data) => {

    let arr = {};
    let section_arr = [];
    json_data = json_data['response']
    json_data.map((item, index) => {
      let obj = {};
      obj['heading'] = item.sectionName;
      if (index == 0)
        obj['numbered'] = true;
      else
        obj['numbered'] = true;
      let content_arr = [];
      content_arr = item.dymamic_rows.map((i, index) => {
        // let objj = {};
        let key_obj = {}
        key_obj['value'] = i.value
        key_obj['editable'] = i.editable==undefined ? false : i.editable
        key_obj['id'] = index + 1
        key_obj['key'] = i.keyName

        return key_obj;
      });
      obj['content'] = content_arr;
      obj['id'] = index;

      if (index == 0)
        arr['titlepage'] = obj;
      else
        section_arr.push(obj);
    });
    arr['sections'] = section_arr;

    return arr;
  };


  // searching values in table
  const search = (value) => {
    const tableData = reportList;
    const filterTable = tableData.filter((o) =>
      Object.keys(o).some((k) =>
        String(o[k]).toLowerCase().includes(value.toLowerCase())
      )
    );
    setFilterTable(filterTable);
  };


  // Saving the json
  const PrepareJson = (formData, saveType) => {
    let check = checkChanges(reportData, formData)

    if (check) {
      let obj = {}
      obj['view_disp_id'] = viewId;
      obj['chart_int_ids'] = selectedChartList;
      obj['view_version'] = viewVersion;
      obj['rep_name'] = reportName;
      obj['rep_status'] = status;
      obj['selected_charts'] = [...new Set(selectedSectionCharts)];
      obj['charts_layout'] = sectionCharts;
      obj['chart_details'] = selectedChartList;
      obj['add_charts_layout'] = sectionAddedCharts;
      obj['add_keys_layout'] = sectionKeys;

      if (saveType == 'save_as') {
        obj['rep_disp_id'] = '';
        obj['saveType'] = saveType
      }
      if (saveType == 'save') {
        obj['rep_disp_id'] = reportId;
        obj['saveType'] = saveType
      }
      if (saveType == 'publish') {
        obj['rep_disp_id'] = reportId;
        obj['saveType'] = saveType
      }

      obj['layout_info'] = { 'layout_info': formData, 'chart_details': selectedChartList, 'add_charts_layout': sectionAddedCharts, 'add_keys_layout': sectionKeys, 'charts_layout': sectionCharts };
      let req = {}
      req['data'] = obj

      if (reportName.length > 0) {
        saveReportDesign(req).then((res) => {
          if (res && res['msg'] && res['msg'] == 'success') {
            setReportId(res['rep_disp_id'])
            req.data['rep_disp_id'] = res['rep_disp_id']
            setStatus(res['rep_stauts'])
            setIsSave(true)
          }
          else
            dispatch(showNotification('error', 'Not Saved'));
        })
        dispatch(sendReport(req['data']))
      }
      else {
        dispatch(showNotification('error', 'Report Name Is Required'));
      }
    }
    else {
      dispatch(showNotification('error', 'No Changes To Save'));
      dispatch(sendReport(mainJson))
    }

  }

  // unloading the json into component readable form 
  // getting json from GET service distrupting json for each component (as required)
  const convertContent = (obj) => {

    let content_obj = obj
    let rows = []
    content_obj.map((i) => {
      let o = {}
      o['keyName'] = i.key
      o['value'] = i.value
      o['editable'] = i.editable

      rows.push(o)
    })

    return rows
  }

  const LoadData = (json_data) => {
    try {
      dispatch(showLoader())
      setIsLoad(true);

      let status = json_data['rep_status'] ? json_data['rep_status'] : ''
      if (status)
        setStatus(status)

      let ReportName = json_data['rep_name'] ? json_data['rep_name'] : ''
      if (ReportName)
        setReportName(ReportName)

      let ReportID = json_data['rep_disp_id'] ? json_data['rep_disp_id'] : ''
      if (ReportID)
        setReportId(ReportID)


      let view_version = json_data['view_id-version'] ? json_data['view_id-version'] : ''

      if (view_version) {

        let view_id = view_version[0].split('-')
        setViewId(view_id[0])
        setViewIdVersion(view_version)
      }

      let layout_data = json_data['layout_info']

      if (layout_data) {

        setChartsLayout(layout_data['charts_layout'] ? layout_data['charts_layout'] : {})

        let section_keys = layout_data['add_keys_layout'] ? layout_data['add_keys_layout'] : {}
        setSectionKeys(section_keys)

        let section_added_charts = layout_data['add_charts_layout'] ? layout_data['add_charts_layout'] : {}
        setSectionAddCharts(section_keys)

        let res = []
        let layout_info = layout_data.layout_info ? layout_data.layout_info : {}
        let chartList = layout_data['chart_details'] && layout_data['chart_details'].length > 0 ? layout_data['chart_details'] : []
        if (chartList.length > 0)
          setSelectedChartList(chartList)
        else
          setSelectedChartList([])

        let title_page = layout_info['titlepage'] ? layout_info['titlepage'] : {}
        let title_section = title_page['heading'] ? title_page['heading'] : {}
        let title_rows = title_page['content'] ? convertContent(title_page['content']) : {}

        let title_obj = {}
        title_obj['sectionName'] = title_section ? title_section : ''
        title_obj['dymamic_rows'] = title_rows ? title_rows : []
        res.push(title_obj)


        let section_area = layout_info['sections'] ? layout_info['sections'] : ''
        if (section_area) {
          section_area.map((item) => {
            let section_obj = {}
            section_obj['sectionName'] = item['heading'] ? item['heading'] : ''
            section_obj['dymamic_rows'] = item['content'] ? convertContent(item['content']) : []
            res.push(section_obj)
          })

          let form_res = {}
          form_res['response'] = res
          setFormData(form_res)
          form.setFieldsValue(form_res);
          // return true
        }
        else {
          setFormData({})
          form.setFieldsValue({});
          // return true
        }
      }
      else {
        setFormData({})
        form.setFieldsValue({});
        // setViewId('')
        // setSelectedChartList([])
        // setViewIdVersion('')
        // setChartList([])
        // return false
      }


    }
    catch
    {
      dispatch(showNotification('error', 'Error in Loading Data'));
      dispatch(hideLoader())
    }
    setTimeout(() => {
      dispatch(hideLoader())
    }, 3000);
  }


  const unLoadJson = async (json_data) => {
    dispatch(showLoader())
    try {
      let status = json_data['rep_status'] ? json_data['rep_status'] : ''
      if (status)
        setStatus(status)

      let ReportName = json_data['rep_name'] ? json_data['rep_name'] : ''
      if (ReportName)
        setReportName(ReportName)

      let view = json_data['view_disp_id'] ? json_data['view_disp_id'] : ''
      if (view)
        setViewId(view)

      let chartList = json_data['chart_details'].length > 0 ? json_data['chart_details'] : []
      if (chartList.length > 0)
        setSelectedChartList(chartList)

      let view_version = json_data['view_version'] ? json_data['view_version'].toString() : ''
      setViewVersion(view_version)
      getChartsList(view + '-' + view_version)
      setViewIdVersion(view + '-' + view_version)
      json_data = json_data['layout_info']
      if (json_data) {

        let res = []
        let layout_info = json_data ? json_data : {}
        let title_page = layout_info['titlepage'] ? layout_info['titlepage'] : {}

        let title_section = title_page['heading'] ? title_page['heading'] : {}
        let title_rows = title_page['content'] ? convertContent(title_page['content']) : {}
        let title_obj = {}
        title_obj['sectionName'] = title_section ? title_section : ''
        title_obj['dymamic_rows'] = title_rows ? title_rows : ''

        res.push(title_obj)

        let section_area = layout_info['sections'] ? layout_info['sections'] : ''

        if (section_area) {
          section_area.map((item) => {
            let section_obj = {}
            section_obj['sectionName'] = item['heading'] ? item['heading'] : ''
            section_obj['dymamic_rows'] = item['content'] ? convertContent(item['content']) : ''
            res.push(section_obj)
          })
          let form_res = {}
          form_res['response'] = res
          setFormData(form_res)
          form.setFieldsValue(form_res);
          return true
        }
        else {
          setFormData({})
          form.setFieldsValue({});
          return true
        }
      }
      else {
        setFormData({})
        form.setFieldsValue({});
        setViewId('')
        setSelectedChartList([])
        setViewIdVersion('')
        setChartList([])
        return false
      }
    }
    catch
    {
      dispatch(showNotification('error', 'Loading Data.....'));
    }
    dispatch(hideLoader())
  }

  const isStyledDifferently = (rowObject, index) => {
    return rowObject.isActive ? true : false;
  }




  return (
    <div className='custom-wrapper'>
      <div className='sub-header'>
        <div className='sub-header-title'>
          <BreadCrumbWrapper />
        </div>
        <div className='sub-header-btns'>
          {/* {isLoad || params ? <> </> : (
            <Button
              className='custom-primary-btn'
              onClick={() => OnNewClick()}
            >
              New
            </Button>)} */}
          {/* {!params ?
            <Button
              className='custom-primary-btn'
              onClick={() => { setVisible(true); setIsNew(false); }}
            >
              Load
            </Button> : <></>
          } */}
          {
            (isLoad || isNew) && !params ?
              <>
                <Button
                  className='custom-primary-btn'
                  onClick={() => {
                    PrepareJson(mainJson, 'save')
                  }}
                >

                  Save
                </Button>
                {isLoad ?
                  <Button
                    className='custom-primary-btn'
                    onClick={() => {
                      PrepareJson(mainJson, 'save_as')
                    }}
                  >

                    Save As
                  </Button> : <></>}
                <Button
                  className='custom-primary-btn'
                  onClick={() => dispatch(screenChange(true))}
                >
                  Preview
                </Button>
                <Button
                  className="custom-secondary-btn"
                  onClick={() => {setIsPublish(true); setApproveReject('P')}}
                >
                  <CloudUploadOutlined />
                  Publish
                </Button>
                <Dropdown overlay={menu} placement="bottomLeft" arrow={{ pointAtCenter: true }}>
                  <EllipsisOutlined style={{transform:'rotate(-90deg)',fontSize:'20px',marginLeft:'5px'}} />
                </Dropdown> </>
              : <> </>
          }
          {
            params ? <div>
              <Button
                className='viewCreation-rejectBtn'
                onClick={() => {
                  setIsPublish(true);
                  setApproveReject('R');
                }}
                // onClick={() => { adenabled ? onApprove('R') : setIsPublish(true); setApproveReject('R'); }}
              >
                Reject
              </Button>
              <Button
                className='viewCreation-publishBtn'
                onClick={() => {
                  setIsPublish(true);
                  setApproveReject('A');
                }}
                // onClick={() => { adenabled ? onApprove('A') : setIsPublish(true); setApproveReject('A'); }}
              >
                Approve
              </Button></div> : <></>
          }

        </div>
      </div>

      <div className='custom-content-layout'>
        <ReportDesignerForm
          setViewId={setViewId}
          viewList={viewList}
          setStatus={setStatus}
          status={status}
          isLoad={isLoad}
          reportName={reportName}
          setReportName={setReportName}
          viewVersion={viewVersion}
          setViewVersion={setViewVersion}
          reportId={reportId}
          viewIdVersion={viewIdVersion}
          setViewIdVersion={setViewIdVersion}
          getChartsList={getChartsList}
          mapViewList={mapViewList}
          show={params}
          selectedChartList={selectedChartList}
          setSelectedChartList={setSelectedChartList}
          chartList={chartList}
        />

        {(isLoad || isNew) && loading == false && viewId == '' ? <div className='new-empty-block'>
          <Empty description={
            <span>
              Fill in ‘Report info’ to add new section
            </span>
          }
            className='empty-block'
            image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div> : <></>

        }

        {(isLoad || isNew) && loading == false && viewId !== '' ?
          <div className="reportDesigner-grid-tables">
            <Form
              className="report-form"
              name="report-generator-form"
              form={form}
              onValuesChange={handleValuesChange}
              initialValues={formData}
            >
              <ReportDesignerDynamicSections formData={formData} show={params} list={selectedChartList} setSectionCharts={setSectionCharts} sectionKeys={sectionKeys} sectionAddedCharts={sectionAddedCharts} setSectionAddKey={setSectionAddKey} setSectionAddCharts={setSectionAddCharts} charts_layout={chartsLayout} isLoad={isLoad} />
            </Form>
          </div> :
          <></>
        }
        <Modal
          title="Select Report"
          visible={visible}
          onCancel={() => setVisible(false)}
          width={500}
          style={{ marginRight: '800px' }}
          footer={[<Button style={{ backgroundColor: '#093185', color: 'white', borderRadius: '4px' }} onClick={() =>
            onOk()
          }>OK</Button>,]}
        >
          <Select className="filter-button" defaultValue={reportId} onChange={(e, value) => {
            let view_value = value.value ? value.value : ''
            setReportId(view_value)
            getReportData(view_value)
          }}
            value={reportId}
            showSearch
            showArrow
            style={{ backgroundColor: 'white', borderRadius: '4px' }}
            onMouseDown={e => { e.stopPropagation(); }}
          >
            {mapReportList.length >= 0 ? mapReportList.map((item) =>

              <Option value={item.rep_disp_id} key={item.rep_disp_id}>{item.rep_disp_id}</Option>
            ) :
              <></>
            }
          </Select>
          <Button onClick={() => setPopVisible(true)}><BlockOutlined twoToneColor="#093185" /></Button>
        </Modal>
        <Modal
          title="Select Report"
          visible={popvisible}
          onCancel={() => setPopVisible(false)}
          width={600}
          title={<p>Select Report  <Input.Search
            className='table-search'
            placeholder='Search by...'
            enterButton
            onSearch={search}
            style={{ borderRadius: '4px' }}
          /></p>}
          centered
          width={500}
          footer={[<Button style={{ backgroundColor: '#093185', color: 'white', borderRadius: '4px' }} onClick={() => {
            dispatch(showLoader());
            onOk()
          }}>OK</Button>,]}
        >
          <Table
            // rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'}
            rowHighlightTest={isStyledDifferently}
            dataSource={filterTable === null ? reportList : filterTable}
            columns={columns}
            onRow={record => ({
              onClick: e => {
                record['color'] = '#D3D3D3'
                setReportId(record.rep_disp_id)
                getReportData(record.rep_disp_id, record.rep_status)
                dispatch(showLoader())
              }
            })}
            scroll={{ y: 200 }}
            size='small'
            pagination={false}
          />
        </Modal>
        <SaveModal isSave={isSave} setIsSave={setIsSave} id={reportId} />

      </div>
      <Signature isPublish={isPublish} handleClose={handleClose} screenName="Report Designer" PublishResponse={PublishResponse} appType="REPORT" dispId={reportId} version={0} status={approveReject} />
    </div>
  );
}

export default ReportDesignerNew;
