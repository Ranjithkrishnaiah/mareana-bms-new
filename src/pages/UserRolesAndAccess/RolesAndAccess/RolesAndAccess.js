/**
 * @author Bhanu Thareja <bhanu.thareja@mareana.com>
 * @Mareana - Release 3.5
 * @version  1
 * @Last Modified - 04 May, 2022
 * @Last Changed By - Bhanu Thareja
 */

import { Component } from 'react'

import BreadCrumbWrapper from '../../../components/BreadCrumbWrapper/index'
import GoBackSubHeader from '../../../components/GoBackSubHeader/GoBackSubHeader'
import EditableTable from '../../../components/EditableTable/EditableTable'
import tableData from './RolesAndAccess.json'

class RolesAndAccess extends Component {

    onSaveRolesAndAccess = data => {
        console.log(data)
    }

    render() {
        return (
            <>
                <BreadCrumbWrapper />
                <div className='custom-user-roles-wrapper'>
                    <GoBackSubHeader currentPage="Roles" />
                    <EditableTable tableData={tableData} onSaveTable={this.onSaveRolesAndAccess} />
                </div>
            </>
        )
    }
}

export default RolesAndAccess