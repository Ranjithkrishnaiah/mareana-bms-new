import React, { useState } from 'react'
import { Table } from 'antd'
import './tableStyle.scss'
import { ArrowRightOutlined } from '@ant-design/icons'



function HierarchyTable()
{
    const [hierarchyName , setHierarchyName] = useState('Untilted')
    return(
        <div>
         <Table className="hierarchy-table"/>
        </div>
    )
}


export default HierarchyTable