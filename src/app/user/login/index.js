import React from 'react';
import { Form, Input, Button } from 'antd';
import { userLogin } from '../../../api/login';
import Auth from '../../../utils/auth';
import { useDispatch } from 'react-redux';
import {
    showNotification,
    showLoader,
    hideLoader,
} from '../../../duck/actions/commonActions';
import './login.scss';
import { useHistory } from 'react-router-dom';
import Icon from '../../../assets/mareana_logo.png';
import { loginUrl } from '../../../services/loginService';
import { adenabled } from '../../../config/config';

const Login = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const onFinish = async (values) => {
        try {
            dispatch(showLoader());
            const response = await userLogin(values);
            Auth.login({ ...response, username: values.username });
            history.push('/dashboard/view_creation');
            dispatch(hideLoader());
        } catch (err) {
            dispatch(hideLoader());
            dispatch(showNotification('error', err.message));
        }
    };

    const onLogin = async () => {
        if (localStorage.getItem('login_details')) {
            history.push('/dashboard/workspace');
            dispatch(showNotification('success', 'Logged In Success'));
        } else {
            if (localStorage.getItem('test_enabled')) {
                window.open(
                    `${loginUrl}?is_ui=True&base_url=https://bms-cpvdev.mareana.com&redirect_url=https://bms-cpvdev.mareana.com%2F%23%2Fdashboard%2Fredirect`,
                    '_self'
                );
            } else {
                window.open(
                    `${loginUrl}?is_ui=True&base_url=http://localhost&redirect_url=http://localhost%2F%23%2Fdashboard%2Fredirect`,
                    '_self'
                );
            }
        }
    };

    return (
        <div className='page-login bg-img'>
            <div className='page-login-header'>
                <span className='brand-name'>
                    Continuous Process Verification
                </span>
                <a
                    href='https://www.mareana.com'
                    target='_blank'
                    rel='noreferrer'
                >
                    <img src={Icon} alt={'logo'} className='logo' />
                </a>
            </div>

            <div className='main-body '>
                <div className='body'>
                    <div className='card card-white card-changes'>
                        <div className='card-content card-container-change'>
                            <Form
                                // {...layout}
                                name='basic'
                                initialValues={{
                                    remember: true,
                                }}
                                onFinish={adenabled ? onLogin : onFinish}
                            >
                                {!adenabled ? (
                                    <>
                                        <Form.Item
                                            label='Username'
                                            name='username'
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        'Please enter your username!',
                                                },
                                            ]}
                                        >
                                            <Input id='username' />
                                        </Form.Item>

                                        <Form.Item
                                            label='Password'
                                            name='password'
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        'Please enter your password!',
                                                },
                                            ]}
                                        >
                                            <Input.Password id='password' />
                                        </Form.Item>
                                    </>
                                ) : (
                                    <></>
                                )}

                                <Form.Item
                                //  {...tailLayout}
                                >
                                    <Button
                                        type='primary'
                                        htmlType='submit'
                                        id='login-btn'
                                    >
                                        Login
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
