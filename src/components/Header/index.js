import React from 'react';

import { Button, Input, Layout } from 'antd';
import { useDispatch } from 'react-redux';
import { LogoutOutlined } from '@ant-design/icons';
import cpvLogo from '../../assets/cpv-logo.png';
import hamburgerIcon from '../../assets/icons/hamburger.svg';
import mareanaLogo from '../../assets/mareana_logo.png';
import { toggleMenu } from '../../duck/actions/commonActions';
import './style.scss';
import Auth from '../../utils/auth';
import { useHistory } from 'react-router-dom';
import { adenabled } from '../../config/config';
import { logoutUrl } from '../../services/loginService';

const { Header } = Layout;
const { Search } = Input;
const HeaderBar = () => {
	const dispatch = useDispatch();
	const history = useHistory();

	const toggleCollapsed = () => {
		dispatch(toggleMenu());
	};

	const Logout = () => {
		// LOGOUT API NOT WORKING
		// const jwt = localStorage.getItem('user_token');
		// await userLogout(jwt);
		Auth.logout(() => {
			history.push('/');
		});
	};
	const adLogout = () => {
		//  window.open(`${logoutUrl}`,'_self')
		window.open(
			`${logoutUrl}?redirect_url=https://bms-cpvdev.mareana.com/%2F%23%2Fuser%2Flogin`,

			'_self'
		);
		localStorage.clear();
	};

	return (
		<Header id='header'>
			<div id='hamburger' className='inline'>
				<div className='header-logo'>
					<img src={mareanaLogo} height='40' alt='menu' />
					<span></span>
					<img src={cpvLogo} alt='cpv' />
				</div>
			</div>
			<div
				className='logout-btn'
				onClick={() => (adenabled ? adLogout() : Logout())}>
				<LogoutOutlined />
			</div>
		</Header>
	);
};

export default HeaderBar;
