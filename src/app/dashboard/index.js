import './dashboard.scss';
import React, { lazy, useEffect } from 'react';
import {
	Route,
	Switch,
	useHistory,
	useRouteMatch,
	useLocation,
} from 'react-router-dom';
import Auth from '../../utils/auth';
import BreadCrumbWrapper from '../../components/BreadCrumbWrapper';
import HeaderBar from '../../components/Header';
import Help from '../../components/Help';
import { Layout } from 'antd';
import Sidebar from '../../components/Sidebar';
import SuspenseWrapper from '../../components/SuspenseWrapper';
import Uploader from './dataLoad/index';
import LoginRedirect from '../user/login/redirect';
import RedirectSign from '../user/login/redirectSign';
import ViewPage from './chartPersonal/components/viewPage/ViewPage';
import UserRolesAndAccess from '../../pages/UserRolesAndAccess/UserRolesAndAccess';
import UserConfiguration from '../../pages/UserRolesAndAccess/UserConfiguration/UserConfiguration';
import RolesAndAccess from '../../pages/UserRolesAndAccess/RolesAndAccess/RolesAndAccess';
import ScreenControls from '../../pages/UserRolesAndAccess/ScreenControls/ScreenControls';
import PaperBatchRecords from './paperBatchRecords';
import PaperBatchRecordsTemplate from './paperBatchRecordsTemplate';
import PbrReviewer from './pbrReviewer';

// DASHBOARD ROUTE COMPONENTS
const Home = lazy(() => import('./home'));
const ManualDataUpload = lazy(() => import('./manualDataUpload'));
const ChartPersonal = lazy(() => import('./chartPersonal'));
const SystemErrorReport = lazy(() => import('./systemErrorReport'));
const View = lazy(() => import('./viewScreen/components/View'));
const DataLoad = lazy(() => import('./dataLoad'));
const ReportDesigner = lazy(() => import('./reportDesigner'));
const AuditTrial = lazy(() => import('./auditTrial'));
const ReportGenerator = lazy(() => import('./reportGenerator'));
const Workflow = lazy(() => import('./wokflow'));
const Workspace = lazy(() => import('./workspace'));
const Genealogy = lazy(() => import('./genealogy'));
const DashboardScreen = lazy(() => import('./dashboardScreen'));
const ViewLanding = lazy(() => import('./viewScreen'));
const ViewChart = lazy(() =>
	import('./dashboardScreen/components/viewChart/viewChart')
);
const Hierarchy = lazy(() => import('./hierarchyConfig'));
const HierarchyMain = lazy(() =>
	import('./hierarchyConfig/components/hierarchy/hierarchy')
);
const Faq = lazy(() => import('./faq'));
const { Content } = Layout;


const Dashboard = () => {
	const match = useRouteMatch();
	const history = useHistory();
	const location = useLocation();
	const screen = location.pathname.split('/');

	useEffect(() => {
		// if (!Auth.isAuthenticated()) {
		//   history.push('/user/login');
		// }
	}, [history]);
	return (
		<>
			<Layout style={{ minHeight: '100vh' }}>
				<HeaderBar />
				<Layout>
					<Sidebar />
					{screen[2] !== 'faq' && <Help />}
					<Content>
						{/* <BreadCrumbWrapper /> */}
						<SuspenseWrapper>
							<Switch>
								<Route key='home' path={`${match.url}/home`}>
									<Home />
								</Route>
								<Route
									key='manual_data_upload'
									path={`${match.url}/manual_data_upload`}>
									<ManualDataUpload />
								</Route>
								{/* <Route
									key='view_creation'
									path={`${match.url}/view_creation_view`}>
									<View />
								</Route>
								<Route
									key='view_creation_landing'
									path={`${match.url}/view_creation_landing`}>
									<ViewLanding />
								</Route> */}
								<Route
									path={`${match.url}/view_creation`}
									render={({ match: { url } }) => (
										<>
											<Route path={`${url}/`} component={ViewLanding} exact />
											<Route path={`${url}/:id`} component={View} />
										</>
									)}
								/>

								<Route
									path={`${match.url}/chart_personalization`}
									render={({ match: { url } }) => (
										<>
											<Route path={`${url}/`} component={ChartPersonal} exact />
											<Route path={`${url}/:id`} component={ViewPage} />
										</>
									)}
								/>
								<Route
									key='system_error_report'
									path={`${match.url}/system_error_report`}>
									<SystemErrorReport />
								</Route>
								<Route key='data_load' path={`${match.url}/data_load`}>
									<DataLoad />
								</Route>
								<Route
									key='report_designer'
									path={`${match.url}/report_designer`}>
									<ReportDesigner />
								</Route>
								<Route
									key='audit_trail_report'
									path={`${match.url}/audit_trail_report`}>
									<AuditTrial />
								</Route>
								<Route
									key='report_generator'
									path={`${match.url}/report_generator`}>
									<ReportGenerator />
								</Route>
								<Route key='genealogy' path={`${match.url}/genealogy`}>
									<Genealogy />
								</Route>
								<Route key='workflow' path={`${match.url}/workflow`}>
									<Workflow />
								</Route>
								<Route key='workspace' path={`${match.url}/workspace`}>
									<Workspace />
								</Route>
								<Route key='dashboard' path={`${match.url}/dashboard`}>
									<DashboardScreen />
								</Route>
								<Route
									key='paper_batch_records'
									path={`${match.url}/paper_batch_records`}>
									<PaperBatchRecords />
								</Route>
								<Route
									key='pbr_reviewer'
									path={`${match.url}/pbr_reviewer`}>
									<PbrReviewer />
								</Route>
								<Route
									key='paper_batch_records_template'
									path={`${match.url}/pbr_template`}>
									<PaperBatchRecordsTemplate />
								</Route>
								<Route key='redirect' path={`${match.url}/redirect`}>
									<LoginRedirect />
								</Route>
								<Route key='redirect_sign' path={`${match.url}/redirect_sign`}>
									<RedirectSign />
								</Route>
								<Route key='faq' path={`${match.url}/faq`}>
									<Faq />
								</Route>
								<Route
									key='hierarchy'
									path={`${match.url}/molecule_hierarchy_configuration`}>
									<Hierarchy />
								</Route>
								<Route key='userRolesAndAccess' path={`${match.url}/user-roles-and-access`} exact component={UserRolesAndAccess} />
								<Route key='user-configuration' path={`${match.url}/user-roles-and-access/user-configuration`} component={UserConfiguration} />
								<Route key='roles-and-access' path={`${match.url}/user-roles-and-access/roles-and-access`} component={RolesAndAccess} />
								<Route key='screen-controls' path={`${match.url}/user-roles-and-access/screen-controls`} component={ScreenControls} />
								<Route
									key='hierarchy_main'
									path={`${match.url}/molecule_hierarchy_configurations/untilted_view`}>
									<HierarchyMain />
								</Route>
							</Switch>
						</SuspenseWrapper>
					</Content>
				</Layout>
			</Layout>
		</>
	);
};

export default Dashboard;
