import React, { useContext, useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import { ListGroup, Row, Col, Button } from 'react-bootstrap';
import { Context } from '../../index';
import { Divider, Avatar, message } from "antd";
import history from "../../services/history";
import { isAdmin } from '../utils/testing';
import CreateCourse from '../Course/ModalForms/CreateCourse';
import { COURSE_INFO_ROUTE } from '../../utils/consts';
import TestingApi from '../../API/TestingApi';
import { useFetching } from '../hooks/useFetching';
import Loader from '../UI/Loader/Loader';
import ErrorMessage from '../UI/Messages/ErrorMessage';

const CoursesAll = (props) => {
    const [isCreateCourseFormVisible, setIsCreateCourseFormVisible] = useState(false)
    const {userStore} = useContext(Context)
    const myCourses = userStore.MyCourses
    const [allCourses, setAllCourses] = useState([])
    const [update, setUpdate] = useState(true)
    const user = userStore.User;

    const [fetchCourses, isDataLoading, dataError] = useFetching(async () => {
        let response = await TestingApi.getAllCourses();
        userStore.setAllCourses(response.data)
        setAllCourses(response.data)
    })

    const [fetchSubscribeCourse, isSubscribeLoading, subscribeError] = useFetching(async () => {
        const item = {uid: userStore.User.uid, courseObj: userStore.CurCourse.courseObj}
        let response = await TestingApi.subscribeCourse(item);
        if (response.data === "ok") {
            message.success('Вы подписались на курс успешно');
        }
        userStore.setCurCourse({})
        let response2 = await TestingApi.getUserCourses(userStore.User.uid);
        userStore.setMyCourses(response2.data)
        setUpdate(!update)
    })

    const [fetchUnsubscribeCourse, isUnsubscribeLoading, UnsubscribeError] = useFetching(async () => {
        const item = {uid: userStore.User.uid, courseObj: userStore.CurCourse.courseObj}
        let response = await TestingApi.unsubscribeCourse(item);
        if (response.data === "ok") {
            message.success('Вы отписались от курса успешно');
        }
        userStore.setCurCourse({})
        let response2 = await TestingApi.getUserCourses(userStore.User.uid);
        userStore.setMyCourses(response2.data)
        setUpdate(!update)
    })

    useEffect(() => {
        fetchCourses()
    }, [update])

    const handleCourse = (item) => {
        userStore.setCurCourse(item);
        history.push(COURSE_INFO_ROUTE);
    }

    const handleCreateCourse = () => {
        setIsCreateCourseFormVisible(true)
    }

    const handleSubscribeCourse = (course) => {
        userStore.setCurCourse(course)
        fetchSubscribeCourse()
    }

    const handleUnsubscribeCourse = (course) => {
        userStore.setCurCourse(course)
        fetchUnsubscribeCourse()
    }

    const isSubscribe = (item) => {
        const courses = myCourses.filter(elem => elem.courseName === item.courseName)
        return courses.length > 0 ? true : false
    }

    const View = () => {
        const listCourses = allCourses.map((item) => {
            const isSubscr = isSubscribe(item)
            return (
                <ListGroup.Item 
                    as="li"
                    className="d-flex justify-content-between align-items-start"
                    key={item.courseName}
                >
                    <Col xs={1}>
                        <Avatar src="https://joeschmoe.io/api/v1/random" style={{marginRight: "15px"}}/>                 
                    </Col>
                    <Col style={{cursor: 'pointer'}} onClick={() => handleCourse(item)} xs={9}>
                        <div className="ms-2 me-auto">
                            <div className="fw-bold">{item.courseName}</div>
                            {item.courseDescription}
                        </div>
                    </Col>
                    <Col>
                        { isSubscr
                            ? <Button onClick={() => handleUnsubscribeCourse(item)} variant="outline-danger">Покинуть курс</Button>
                            : <Button onClick={() => handleSubscribeCourse(item)} variant="outline-secondary">Подписаться</Button>
                        }
                    </Col>                 
                </ListGroup.Item>
            )
        })

        return (
            <>
                <Row>
                    <Col xs={7}>
                        <Divider orientation="left">Мои курсы:</Divider>
                    </Col>
                    { isAdmin(user)
                        ? <Col><Button onClick={handleCreateCourse} style={{marginLeft: "5px"}} variant="outline-success">Создать курс</Button></Col>
                        : null
                    }
                </Row>
                <CreateCourse isVisible={isCreateCourseFormVisible} setIsVisible={setIsCreateCourseFormVisible} update={update} setUpdate={setUpdate}></CreateCourse>
                <ListGroup variant="flush">
                    {listCourses}
                </ListGroup>    
            </>
        )
    }

    const spinner = isDataLoading ? <Loader/> : null;
    const errorMessage = dataError ? <ErrorMessage message={dataError} /> : null;
    const content = !(isDataLoading || dataError) ? <View/> : null;

    return (
        <>
            {spinner}
            {errorMessage}
            {content}
        </>
    )
}

export default CoursesAll;