import './block.scss';

import React from 'react';

const statusColor = status => {
	if (status == 'APRD' || status == 'approved') {
		return 'aprd';
	}
	if (status == 'DRFT') {
		return 'drft';
	}
	if (status == 'AWAP' || status == 'unapproved') {
		return 'awap';
	}
};

const StatusBlock = props => {
	return (
		<div className='chart-tiles' onClick={props.handleClickTiles}>
			<div className={`tile-status ${statusColor(props.status)}`}>
				{props.status}
			</div>
			{props.id}<br/>
			{props.name}
		</div>
	);
};

export default StatusBlock;
