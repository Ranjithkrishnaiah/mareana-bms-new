import React from 'react';
import { Tabs, Table } from 'antd';
import Chart from './chartComponent/chartComponent';
import './styles.scss';

const { TabPane } = Tabs;

function ChartTable(props) {
	return (
		<div className='chartTable'>
			{/* <div >
              <Chart />
            </div> */}
			<div>
				<Tabs>
					<TabPane tab='Exclusion' key='Exclusion'>
						<Table columns={props.columns1} dataSource={props.data1} />
					</TabPane>
					<TabPane tab='Violation' key='Violation'>
						<Table columns={props.columns2} dataSource={props.data2} />
					</TabPane>
					<TabPane tab='Data Table' key='Data Table'>
						<Table columns={props.columns3} dataSource={props.data3} />
					</TabPane>
				</Tabs>
			</div>
		</div>
	);
}

export default ChartTable;
