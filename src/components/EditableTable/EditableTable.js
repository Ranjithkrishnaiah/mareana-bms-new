import { Component } from 'react'
import { v1 as uuid } from 'uuid'
import { Table, Button, Popconfirm, Select, Switch } from 'antd'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { 
    EditableRow, 
    EditableCell, 
    adjustColumnWidths,
    deleteRow, 
    addRow, 
    changeInput, 
    changeSelectInput, 
    changeToggleInput
} from '../../utils/editableTableHelper'


const { Option } = Select

class EditableTable extends Component {
    state = {}

    static getDerivedStateFromProps(props, state) {
        if (!state.dataSource) {
            const { rowInitialData, dataSource, deleteActionColumn } = props.tableData
            return { rowInitialData, dataSource, count: dataSource.length, deleteActionColumn }
        }
        return null
    }

    componentDidMount() {
        this.initializeTableRender()
    }

    initializeTableRender() {
        this.state.dataSource.map(data => data.key = uuid())
        const columnsCopy = [...this.props.tableData.columns]
        const columns = this.state.deleteActionColumn ? this.addDeleteActionColumn(columnsCopy) : columnsCopy
        adjustColumnWidths(columns)
        this.renderTable(columns)
        this.setState({ columns })
    }

    renderTable = (columns) => {
        columns.forEach(column => {
            switch (column.type) {
                case 'select':
                    return column.render = (_, record) => {
                        return <Select 
                                    value={record[column.name]} 
                                    mode={column.mode}
                                    style={{ width: '100%' }} 
                                    onChange={selectedValue => this.onChangeSelect(selectedValue, record, column)}>
                            {column.options.map(option => <Option key={uuid()} value={option.value}>{option.label}</Option>)}
                        </Select>
                    }
                case 'toggle':
                    return column.render = (_, record) => {
                        return <Switch
                            checked={record[column.name]}
                            checkedChildren={column.toggleTextTrue}
                            unCheckedChildren={column.toggleTextFalse}
                            onChange={selectedValue => this.onChangeToggle(selectedValue, record, column)} />
                    }
                case 'parent':
                    this.renderTable(column.children)
            }
        })
    }

    addDeleteActionColumn = columns => {
        const actionColumn = {
            title: 'Action',
            dataIndex: 'action',
            align: 'center',
            type: 'action_delete',
            render: (_, record) =>
                this.state.dataSource.length >= 1 ? (
                    <Popconfirm title="Sure to delete?" onConfirm={() => this.onDeleteRow(record.key)}>
                        <DeleteOutlined style={{ color: 'red' }} />
                    </Popconfirm>

                ) : null,
        }
        columns.unshift(actionColumn)
        adjustColumnWidths(columns)
        return columns
    }

    onDeleteRow = (key) => {
        const { dataSource, count } = deleteRow(key, this.state)
        this.setState({ dataSource, count })
    }

    onAddRow = () => {
        const { dataSource, count } = addRow(this.state)
        this.setState({ dataSource, count }, () => {
            this.initializeTableRender()
        })
    }

    onChangeInput = row => {
        const dataSource = changeInput(row, this.state)
        this.setState({ dataSource })
    }

    onChangeSelect = (selectedValue, record, column) => {
        const dataSource = changeSelectInput(selectedValue, record, column, this.state)
        this.setState({ dataSource })
    }

    onChangeToggle = (selectedValue, record, column) => {
        const dataSource = changeToggleInput(selectedValue, record, column, this.state)
        this.setState({ dataSource })
    }

    render() {
        if (!this.state.dataSource || !this.state.columns) {
            return null
        }
        const { dataSource } = this.state
        const components = {
            body: {
                row: EditableRow,
                cell: EditableCell,
            },
        }
        const columns = this.state.columns.map((column) => {
            if (!column.editable) {
                return column
            }

            return {
                ...column,
                onCell: (record) => ({
                    record,
                    editable: column.editable,
                    dataIndex: column.dataIndex,
                    title: column.title,
                    onChangeInput: this.onChangeInput
                }),
            }
        })

        return (
            <div className="custom-table-wrapper">
                <Button
                    type="dashed"
                    onClick={this.onAddRow}
                    icon={<PlusOutlined />}
                    style={{ marginBottom: 16 }}
                >
                    Add new user
                </Button>
                <Button
                    type="primary"
                    onClick={() => this.props.onSaveTable(this.state.dataSource)}
                    style={{ float: 'right' }}
                >
                    Save
                </Button>
                <Table
                    components={components}
                    rowClassName={() => 'editable-row'}
                    bordered
                    dataSource={dataSource}
                    columns={columns}
                    scroll={{ y: 300 }}
                />
            </div>
        )
    }
}

export default EditableTable