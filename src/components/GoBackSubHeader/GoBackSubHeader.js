import { useHistory, useLocation } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';

const GoBackSubHeader = props => {
    const history = useHistory()
    const location = useLocation()

    const goBackOnePage = e => {
        e.stopPropagation()
        const { pathname } = location
        const path = pathname.substring(0, pathname.lastIndexOf('/'))
        history.push(path)
    }

    return (
        <div className='custom-user-roles-sub-header'>
            <div className='sub-header-title' onClick={goBackOnePage}>
                <ArrowLeftOutlined className='header-icon' /> &nbsp;
                <span className='header-title' style={{ textTransform: 'none' }}>{props.currentPage}</span>
            </div>
        </div>
    )
}

export default GoBackSubHeader