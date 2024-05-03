import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Table } from 'antd';
import { getDeviationData } from '../../../../../services/workSpaceServices';
import BatchIcon from '../../../../../assets/images/batch-icon.png';
import {
    hideLoader,
    showLoader,
    showNotification,
} from '../../../../../duck/actions/commonActions';
import './styles.scss';

const DeviationTable = () => {
    const [dataSource, setDataSource] = useState([]);
    const dispatch = useDispatch();
    const columns = [
        {
            title: 'Event ID',
            key: 'event_id',
            dataIndex: 'event_id',
            sorter:(a, b)=>a.event_id.localeCompare(b.event_id),
        },
        {
            title: 'Product',
            key: 'product_num',
            dataIndex: 'product_num',
            sorter:(a, b)=>a.product_num.localeCompare(b.product_num),
        },
        {
            title: 'Batch',
            key: 'batch_num',
            dataIndex: 'batch_num',
            sorter:(a, b)=>a.batch_num.localeCompare(b.batch_num),
            render: (text, row, index) => {
                return (
                    <div>
                        <img src={BatchIcon} />
                        <span style={{ marginLeft: '5px' }}>{text}</span>
                    </div>
                )
            }
        }
    ]

    useEffect(() => {
        deviationTableData();
    }, [])

    const deviationTableData = async () => {
        let req = { limit: 5 }
        try {
            dispatch(showLoader());
            const tableResponse = await getDeviationData(req);
            if (tableResponse['status-code'] === 200) {
                setDataSource(tableResponse.Data);
                dispatch(hideLoader());
            }
            else if (tableResponse['status-code'] === 404) {
                setDataSource(tableResponse.Data);
                dispatch(hideLoader());
                dispatch(showNotification('error', tableResponse.Message));
            }

        } catch (error) {
            dispatch(hideLoader());
            dispatch(showNotification('error', error.Message));
        }
    }
    return (
        <div className='deviation-main'>
            <Table
                className='deviation-table'
                columns={columns}
                dataSource={dataSource}
                pagination={false}
                style={{ border: '1px solid #ececec', borderRadius: '2px' }}
            />
        </div>
    )
}

export default DeviationTable;