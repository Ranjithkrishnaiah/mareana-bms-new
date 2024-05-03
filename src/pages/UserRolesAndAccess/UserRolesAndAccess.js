/**
 * @author Bhanu Thareja <bhanu.thareja@mareana.com>
 * @Mareana - Release 3.5
 * @version  1
 * @Last Modified - 04 May, 2022
 * @Last Changed By - Bhanu Thareja
 */

import { useHistory, useRouteMatch } from 'react-router-dom'
import { Row, Col } from 'antd'

import BreadCrumbWrapper from '../../components/BreadCrumbWrapper'
import ScreenHeader from '../../components/ScreenHeader/screenHeader';
import headerImage from '../../assets/images/ChartBanner.svg';
import ScreenAccessImage from '../../assets/images/Screen_Controls.svg'
import RolesAndAccessImage from '../../assets/images/Roles_And_Access.svg'
import UserConfigurationImage from '../../assets/images/User_Configuration.svg'
import './UserRolesAndAccess.scss';

const UserRolesAndAccess = () => {
    const history = useHistory()
    const match = useRouteMatch()

    const redirectTo = pathname => history.push(`${match.url}/${pathname}`)

    return (
        <>
            <BreadCrumbWrapper />
            <div className="custom-user-roles-wrapper">

                <ScreenHeader
                    bannerbg={{ background: 'linear-gradient(180deg, #F5EBEB 100%, #FBC2BD 4%)' }}
                    title={`Howdy, ${'<<User Name>>'}`}
                    description="Let's personalize some charts today!"
                    source={headerImage}
                    sourceClass='dashboard-image'
                />

                <Row className='create-new-row'>
                    <Col span={4} onClick={() => redirectTo('user-configuration')}>
                        <div className='create-new'>
                            <img src={UserConfigurationImage} alt="UserConfiguration" width="98%" />
                        </div>
                        <p>User Configuration</p>
                    </Col>
                    <Col span={4} onClick={() => redirectTo('roles-and-access')}>
                        <div className='create-new'>
                            <img src={RolesAndAccessImage} alt="RolesAndAccess" width="98%" />
                        </div>
                        <p>Roles And Access</p>
                    </Col>
                    <Col span={4} onClick={() => redirectTo('screen-controls')}>
                        <div className='create-new'>
                            <img src={ScreenAccessImage} alt="ScreenAccessControls" width="98%" />
                        </div>
                        <p>Screen Controls</p>
                    </Col>
                </Row>

            </div>
        </>
    )
}

export default UserRolesAndAccess