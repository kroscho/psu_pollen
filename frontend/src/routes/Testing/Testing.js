import React, { useContext, useState } from 'react';
import 'antd/dist/antd.css';
import './index.css';
import { Layout, Menu } from 'antd';
import { Breadcrumb } from 'react-bootstrap'
import { Router, Switch, Route, Link } from "react-router-dom";
import Courses from '../../components/Courses/Courses';
import { UserOutlined } from '@ant-design/icons';
import history from '../../services/history';
import { Context } from '../..';
import { COURSE_INFO_ROUTE, COURSE_LECTIONS_ROUTE, COURSE_LECTURE_ROUTE, COURSE_LITERATURE_ROUTE, COURSE_ONTOLOGY_ROUTE, COURSE_TERMS_ROUTE, COURSE_TESTS_ROUTE, COURSE_TESTS_TEST_EDIT_ROUTE, COURSE_TESTS_TEST_VARIANTS_ROUTE, TESTING_ALL_COURSES_ROUTE, TESTING_COURSES_ROUTE, TESTING_ROUTE, TESTS_TEST_ATTEMPTS_DETAILS_ROUTE, TESTS_TEST_ATTEMPT_ROUTE, TESTS_TEST_CHECK_WORKS_ROUTE } from '../../utils/consts';
import { isMenuCourses } from '../../components/utils/testing';
import CourseInfo from '../../components/Course/CourseInfo/CourseInfo';
import CourseTests from '../../components/Course/CourseTests/CourseTests';
import CourseTest from '../../components/Course/CourseTest/CourseTest';
import CourseTestVariants from '../../components/Course/CourseTestVariants/CourseTestVariants';
import TestEdit from '../../components/Course/ModalForms/CourseTestEdit';
import CoursesAll from '../../components/Courses/CoursesAll';
import CourseLections from '../../components/Course/CourseLections/CourseLections';
import CourseLecture from '../../components/Course/CourseLecture/CourseLecture';
import AttemptsDetails from '../../components/Course/AttemptsDetails/AttemptsDetails';
import CheckWorks from '../../components/Course/CheckWorsk/CheckWorks';
import TermsPage from '../../components/Course/Terms/Terms';
import OntologyPage from '../../components/Course/Ontology/OntologyPage';

const { Header, Content, Sider } = Layout;

const Testing = () => {
    
    const {services, userStore} = useContext(Context)

    const curCourse = userStore.CurCourse;
    const routes = services.Routes[history.location.pathname];

    const menuItems = isMenuCourses() ? services.MenuTesting : services.MenuCourse;
    const menuItemsList = menuItems.map((item) => {
        return (
            <Menu.Item key={item.link} icon={<UserOutlined />}>
                <Link to={item.link}>{item.name}</Link>
            </Menu.Item>
        )
    })

    let listRoutes = []

    if (routes) {
        listRoutes = routes.map((item) => {
            if (item.active) {
                return (
                    <Breadcrumb.Item key={item.path} active>{item.title}</Breadcrumb.Item>
                )
            } else {
                return (
                    <Breadcrumb.Item key={item.path} linkAs={Link} linkProps={{ to: item.path }}>
                        {item.title}
                    </Breadcrumb.Item>
                )
            }
        })
    }

    return (
        <Router history={history}>
            <div className="logo">
                {isMenuCourses()
                    ? ""
                    : userStore.CurCourse.courseName 
                }
            </div>
            <Layout>
                <Sider
                breakpoint="lg"
                collapsedWidth="0"
                onBreakpoint={broken => {
                    console.log(broken);
                }}
                onCollapse={(collapsed, type) => {
                    console.log(collapsed, type);
                }}
                >
                    <Menu 
                        theme="dark" 
                        mode="inline" 
                        defaultSelectedKeys={['/']}
                        selectedKeys={[history.location.pathname]}
                    >
                        {menuItemsList}
                    </Menu>
                </Sider>
                <Layout>
                    <Header className="site-layout-sub-header-background" style={{ padding: 0 }} />
                    <Content style={{ margin: '24px 16px 0' }}>
                        <Breadcrumb>
                            {listRoutes}
                        </Breadcrumb>
                        <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                            <Switch>
                                <Route exact path={COURSE_INFO_ROUTE}>
                                    <CourseInfo/>
                                </Route>
                                <Route exact path={COURSE_TESTS_ROUTE}>
                                    <CourseTests/>
                                </Route>
                                <Route exact path={COURSE_LECTIONS_ROUTE}>
                                    <CourseLections/>
                                </Route>
                                <Route exact path={COURSE_LECTURE_ROUTE}>
                                    <CourseLecture/>
                                </Route>
                                <Route exact path={COURSE_LITERATURE_ROUTE}>
                                    <Courses/>
                                </Route>
                                <Route exact path={TESTING_COURSES_ROUTE}>
                                    <Courses/>
                                </Route>
                                <Route exact path={TESTING_ALL_COURSES_ROUTE}>
                                    <CoursesAll/>
                                </Route>
                                <Route exact path={TESTS_TEST_ATTEMPT_ROUTE}>
                                    <CourseTest/>
                                </Route>
                                <Route exact path={TESTS_TEST_ATTEMPTS_DETAILS_ROUTE}>
                                    <AttemptsDetails/>
                                </Route>
                                <Route exact path={COURSE_TESTS_TEST_EDIT_ROUTE}>
                                    <TestEdit/>
                                </Route>
                                <Route exact path={COURSE_TESTS_TEST_VARIANTS_ROUTE}>
                                    <CourseTestVariants/>
                                </Route>
                                <Route exact path={TESTS_TEST_CHECK_WORKS_ROUTE}>
                                    <CheckWorks/>
                                </Route>
                                <Route exact path={COURSE_TERMS_ROUTE}>
                                    <TermsPage/>
                                </Route>
                                <Route exact path={COURSE_ONTOLOGY_ROUTE}>
                                    <OntologyPage/>
                                </Route>
                                <Route exact path={TESTING_ROUTE}>
                                    <Courses/>
                                </Route>
                            </Switch>
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </Router>
    )
}

export default Testing;