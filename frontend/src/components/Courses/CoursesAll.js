import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import { ListGroup, Row, Col, Button } from 'react-bootstrap';
import { Divider, Avatar, message } from "antd";
import history from "../../services/history";
import { getLocalStorage, isAdmin, setLocalStorage } from '../utils/testing';
import CreateCourse from '../Course/ModalForms/CreateCourse';
import { COURSE_INFO_ROUTE, CUR_COURSE_STORAGE, MY_COURSES_STORAGE, USER_STORAGE } from '../../utils/consts';
import TestingApi from '../../API/TestingApi';
import { useFetching } from '../hooks/useFetching';
import Loader from '../UI/Loader/Loader';
import ErrorMessage from '../UI/Messages/ErrorMessage';

const CoursesAll = () => {
    const [isCreateCourseFormVisible, setIsCreateCourseFormVisible] = useState(false)
    const [allCourses, setAllCourses] = useState([])
    const [update, setUpdate] = useState(true)
    const [isLoading, setIsLoading] = useState(false)

    const user = getLocalStorage(USER_STORAGE)
    const myCourses = getLocalStorage(MY_COURSES_STORAGE)

    const [fetchCourses, isDataLoading, dataError] = useFetching(async () => {
        let response = await TestingApi.getAllCourses();
        setAllCourses(response.data)
    })

    const fetchSubscribeCourse = async (curCourse) => {
        setIsLoading(true)
        try {
            const item = {uid: user.uid, courseObj: curCourse.courseObj}
            let response = await TestingApi.subscribeCourse(item);
            if (response.data === "ok") {
                message.success('Вы подписались на курс успешно');
            }
            let response2 = await TestingApi.getUserCourses(user.uid);
            setLocalStorage(MY_COURSES_STORAGE, response2.data)
            setUpdate(!update)
        } catch (err) {
            let errMessage = "";
            if (err instanceof Error) {
                errMessage = err.message;
            }
            console.log(errMessage);
            message.error(errMessage)
        }
        setIsLoading(false)
    }

    const fetchUnsubscribeCourse = async (curCourse) => {
        setIsLoading(true)
        try {
            const item = {uid: user.uid, courseObj: curCourse.courseObj}
            let response = await TestingApi.unsubscribeCourse(item);
            if (response.data === "ok") {
                message.success('Вы отписались от курса успешно');
            }
            let response2 = await TestingApi.getUserCourses(user.uid);
            setLocalStorage(MY_COURSES_STORAGE, response2.data)
            setUpdate(!update)
        } catch (err) {
            let errMessage = "";
            if (err instanceof Error) {
                errMessage = err.message;
            }
            console.log(errMessage);
            message.error(errMessage)
        }
        setIsLoading(false)
    }

    useEffect(() => {
        fetchCourses()
    }, [update])

    const handleCourse = (item) => {
        setLocalStorage(CUR_COURSE_STORAGE, item)
        history.push(COURSE_INFO_ROUTE);
    }

    const handleCreateCourse = () => {
        setIsCreateCourseFormVisible(true)
    }

    const handleSubscribeCourse = (course) => {
        fetchSubscribeCourse(course)
    }

    const handleUnsubscribeCourse = (course) => {
        fetchUnsubscribeCourse(course)
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

    const spinner = (isDataLoading || isLoading) ? <Loader/> : null;
    const errorMessage = dataError ? <ErrorMessage message={dataError} /> : null;
    const content = !(isDataLoading || isLoading) ? <View/> : null;

    return (
        <>
            {spinner}
            {errorMessage}
            {content}
        </>
    )
}

export default CoursesAll;