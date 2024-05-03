import React, { useEffect, useState } from 'react'
import { Result, Button } from 'antd';
import { getSession } from '../../../services/loginService';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
    showNotification,
    showLoader,
    hideLoader
} from '../../../duck/actions/commonActions';
import { sendLoginDetails } from '../../../duck/actions/loginAction';


export default function RedirectSign(props) {

    const dispatch = useDispatch();
    const history = useHistory();

    const [isPublish, setIsPublish] = useState(false);
    const [publishResponse, setPublishResponse] = useState({});

    const GetSession = async () => 
    {
        dispatch(showLoader())
        let res = await getSession()
        let data = res['Data']
        if (data) {
            dispatch(sendLoginDetails(data))
            localStorage.setItem('login_details', JSON.stringify(data))
            dispatch(showNotification('success', `Logined As ${data.email_id}`))
            dispatch(hideLoader())
            setIsPublish(true)
            let url = localStorage.getItem('redirectUrl')
            // http://localhost/#/dashboard/view_creation?id=V84&version=1&
            window.open(url+'&publish=True','_self')
        }
        else {
            dispatch(showNotification('error', 'Error in Login'))
            dispatch(hideLoader())
            history.push('/user/workflow')
        }
    }

    const handleClose = () => {
        setIsPublish(false)
    };

    useEffect(() => {
        GetSession()
    })
    return (
        <div>
            <Result
                title="Electonic Signature"
                // extra={
                //     <Button type="primary" key="console">
                        
                //     </Button>
                // }
            />
            {/* <Signature isPublish={isPublish} handleClose={handleClose} screenName="Report Designer" PublishResponse={publishResponse} appType="REPORT" dispId={reportId} version={0} status={approveReject} /> */}


        </div>
    )
}