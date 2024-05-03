import React, { useState, useEffect,useRef } from 'react'
import { useDispatch } from 'react-redux';
import {
    hideLoader,
    showLoader,
    showNotification,
} from '../../../../duck/actions/commonActions';
import ScreenHeader from "../../../../components/ScreenHeader/screenHeader";
import illustrations from "../../../../assets/images/Dashboard-Banner.svg";
import { Table,Button,Input, Space } from 'antd';
import { getPbrReviewerData } from '../../../../services/pbrService'
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import './styles.scss'

function PbrReviewer() {
    const dispatch = useDispatch();
    const [templateData, setTemplateData] = useState([])
    const [templateColumns, setTemplateColumns] = useState([])
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const refSearchInput = useRef();
    useEffect(() => {
        cardTableData()
    }, []);
    const cardTableData = async () => {
        let req = ``
        try {
            dispatch(showLoader());
            const tableResponse = await getPbrReviewerData(req);
            if (tableResponse['status'] === 200) {
                // setTemplateColumns(newArray1)
                setTemplateData(tableResponse.Data);
                dispatch(hideLoader());
            }
            else if (tableResponse['status'] === 404) {
                dispatch(hideLoader());
                setTemplateData(tableResponse.Data);
                dispatch(showNotification('error', tableResponse.Message));
            }
        }
        catch (error) {
            dispatch(hideLoader());
            dispatch(showNotification('error', error.Message));
        }
    }

    const getColumnSearchProps = (
        dataIndex,
        searchInput,
        searchText,
        setSearchText,
        searchedColumn,
        setSearchedColumn
      ) => ({
        filterDropdown: ({
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters
        }) => (
          <div style={{ padding: 8 }}>
            <Input
              ref={(node) => (searchInput = node)}
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex, setSearchText, setSearchedColumn)}
              style={{ width: 240, marginBottom: 8, display: "block" }}
            />
            <Space>
              <Button
                type="primary"
                onClick={() =>
                  handleSearch(
                    selectedKeys,
                    confirm,
                    dataIndex,
                    setSearchText,
                    setSearchedColumn
                  )
                }
                icon={<SearchOutlined />}
                size="small"
                style={{ width: 90 }}
              >
                Search
              </Button>
              <Button
                onClick={() =>
                  handleReset(
                    clearFilters,
                    setSearchText,
                    setSearchText,
                    setSearchedColumn
                  )
                }
                size="small"
                style={{ width: 90 }}
              >
                Reset
              </Button>
              <Button
                type="link"
                size="small"
                onClick={() => {
                  confirm({ closeDropdown: false });
                  setSearchText(selectedKeys[0]);
                  setSearchedColumn(dataIndex);
                }}
              >
                Filter
              </Button>
            </Space>
          </div>
        ),
        filterIcon: (filtered) => (
          <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
        ),
        onFilter: (value, record) =>
          record[dataIndex]
            ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
            : "",
        onFilterDropdownVisibleChange: (visible) => {
          if (visible) {
            setTimeout(() => searchInput.select(), 100);
          }
        },
        render: (text) =>
          searchedColumn === dataIndex ? (
            <Highlighter
              highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={text ? text.toString() : ""}
            />
          ) : (
            text
          )
      });
    
      const handleSearch = (
        selectedKeys,
        confirm,
        dataIndex,
        setSearchText,
        setSearchedColumn
      ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
      };
    
      const handleReset = (clearFilters, setSearchText) => {
        clearFilters();
        setSearchText("");
      };

   
    const columns2 = [
        {
            title: 'File Path',
            key: 'file_path',
            dataIndex: 'file_path',
            ...getColumnSearchProps("file_path", refSearchInput, searchText, setSearchText, searchedColumn, setSearchedColumn),
            sorter: (a, b) => a.file_path.localeCompare(b.file_path)
        },
        {
            title: 'Key',
            key: 'key',
            dataIndex: 'key',
            ...getColumnSearchProps("key", refSearchInput, searchText, setSearchText, searchedColumn, setSearchedColumn),
            sorter: (a, b) => a.view_key.localeCompare(b.view_key)
        },
        {
            title: 'Value',
            key: 'value',
            dataIndex: 'value',
            ...getColumnSearchProps("value", refSearchInput, searchText, setSearchText, searchedColumn, setSearchedColumn),
            sorter: (a, b) => a.view_value.localeCompare(b.view_value)
        },
        {
            title: 'Actual Value',
            key: 'actual_value',
            dataIndex: 'actual_value',
            ...getColumnSearchProps("actual_value", refSearchInput, searchText, setSearchText, searchedColumn, setSearchedColumn),
            sorter: (a, b) => a.view_actual_value.localeCompare(b.view_actual_value),
            render: (text, record, index) => {
                return (
                    <img src={`https://cpv-poc.mareana.com/bms_poc_snippets/${text}`} width="50%" height="15%"/>
                )
            }
        },
        {
            title: 'ID',
            key: 'id',
            dataIndex: 'id',
            ...getColumnSearchProps("id", refSearchInput, searchText, setSearchText, searchedColumn, setSearchedColumn),
            sorter: (a, b) => a.view_id.localeCompare(b.view_id)
        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            ...getColumnSearchProps("status", refSearchInput, searchText, setSearchText, searchedColumn, setSearchedColumn),
            sorter: (a, b) => a.view_status.localeCompare(b.view_status)
        },
        {
            title: 'Confidence',
            key: 'confidence',
            dataIndex: 'confidence',
            ...getColumnSearchProps("confidence", refSearchInput, searchText, setSearchText, searchedColumn, setSearchedColumn),
            sorter: (a, b) => a.view_confidence.localeCompare(b.view_confidence)
        },
        {
            title: 'Site',
            key: 'site',
            dataIndex: 'site',
            ...getColumnSearchProps("site", refSearchInput, searchText, setSearchText, searchedColumn, setSearchedColumn),
            sorter: (a, b) => a.view_site.localeCompare(b.view_site)
        },
        {
            title: 'Product',
            key: 'product',
            dataIndex: 'product',
            ...getColumnSearchProps("product", refSearchInput, searchText, setSearchText, searchedColumn, setSearchedColumn),
            sorter: (a, b) => a.view_product.localeCompare(b.view_product),
            render: (text, record, index) => {
                return (
                    <a
                        style={{ color: "#1890ff" }}
                    >
                        {text}
                    </a>
                )
            }
        },
        {
            title: 'Batch',
            key: 'batch',
            dataIndex: 'batch',
            ...getColumnSearchProps("batch", refSearchInput, searchText, setSearchText, searchedColumn, setSearchedColumn),
            sorter: (a, b) => a.view_batch.localeCompare(b.view_batch)
        },
        {
            title: 'Reference Fields',
            key: 'reference_fields',
            dataIndex: 'reference_fields',
            ...getColumnSearchProps("reference_fields", refSearchInput, searchText, setSearchText, searchedColumn, setSearchedColumn),
            sorter: (a, b) => a.view_reference_fields.localeCompare(b.view_reference_fields)
        },

    ]
    const data1 = [
        {
            file_path: 'Batch Record Example 1.pdf',
            key: 'Product ; value',
            value: 'New Product 001',
            actual_value: 'snippet_Batch_Record_Example_1_1004.png',
            id: '21',
            status: 'Unapproved',
            confidence: 'High',
            site: "US01",
            product: 'New Product 001',
            batch: 'B001',
            reference_fields: 'asgdsagdsad.pdf',


        },
        {
            file_path: 'Batch Record Example 1.pdf',
            key: 'Product ; value',
            value: 'New Product 001',
            actual_value: 'snippet_Batch_Record_Example_1_1004.png',
            id: '21',
            status: 'Unapproved',
            confidence: 'High',
            site: "US01",
            product: 'New Product 001',
            batch: 'B001',
            reference_fields: 'asgdsagdsad.pdf',


        },
        {
            file_path: 'Batch Record Example 1.pdf',
            key: 'Product ; value',
            value: 'New Product 001',
            actual_value: 'snippet_Batch_Record_Example_1_1004.png',
            id: '21',
            status: 'Unapproved',
            confidence: 'High',
            site: "US01",
            product: 'New Product 001',
            batch: 'B001',
            reference_fields: 'asgdsagdsad.pdf',


        },
        {
            file_path: 'Batch Record Example 1.pdf',
            key: 'Product ; value',
            value: 'New Product 001',
            actual_value: 'snippet_Batch_Record_Example_1_1004.png',
            id: '21',
            status: 'Unapproved',
            confidence: 'High',
            site: "US01",
            product: 'New Product 001',
            batch: 'B001',
            reference_fields: 'asgdsagdsad.pdf',


        },

    ]
    
    return (
        <div className='custom-wrapper'>
            <div className='sub-header'>
            </div>
            <div className='custom-content-layout'>
                <div>
                    <ScreenHeader
                        bannerbg={{
                            background:
                                "linear-gradient(180deg, rgba(199, 144, 129, 0.15) 0%, rgba(223, 165, 121, 0.56) 100%)",
                        }}
                        title={`Howdy ${localStorage.getItem("username")},`}
                        description="Lets get designing some report templates"
                        source={illustrations}
                        sourceClass="dashboard-image"
                    />
                </div>
                <div className='content_section' >
                    <div style={{ marginTop: 20 }}>
                        <Table
                            columns={columns2}
                            dataSource={templateData}
                            pagination={false}
                            style={{ border: '1px solid #ececec', borderRadius: '2px' }}
                        />
                    </div>
                </div>



            </div>
        </div>
    )
}

export default PbrReviewer