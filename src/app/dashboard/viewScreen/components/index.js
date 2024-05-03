/**
 * @author Dinesh
 * @Mareana - CPV Product
 * @version  1
 * @Last Modified - 14 April, 2022
 * @Last Changed By - Dinesh
 */

import React from 'react';
import BreadCrumbWrapper from '../../../../components/BreadCrumbWrapper';
import Landing from '../components/landing/viewCreationLanding';

const ViewPage = () => {
	return (
		<div className='custom-wrapper'>
			<BreadCrumbWrapper />
			<div className='custom-content-layout'>
				<Landing />
			</div>
		</div>
	);
};

export default ViewPage;
