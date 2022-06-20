import React, { useContext, useEffect, useState } from "react";
import 'antd/dist/antd.css';
import { Divider, Avatar, message } from "antd";
import { Context } from "../../..";
import {Row, Col, ListGroup, Button, Badge} from "react-bootstrap"
import { BookOutlined } from '@ant-design/icons';
import TestingApi from "../../../API/TestingApi";
import { useFetching } from "../../hooks/useFetching";
import Loader from "../../UI/Loader/Loader";
import ErrorMessage from "../../UI/Messages/ErrorMessage";
import { isAdmin } from "../../utils/testing";
import { TESTING_ALL_COURSES_ROUTE } from "../../../utils/consts";
import history from "../../../services/history";
import UsersList from "../Users/UsersList";
import EditCourse from "../ModalForms/CourseEdit";

const CourseInfo = () => {
    const {userStore} = useContext(Context)
    const curCourse = userStore.CurCourse;
    const [students, setStudents] = useState([])
    const [modules, setModules] = useState([])
    const [update, setUpdate] = useState(true)
    const [isVisibleCourseEditForm, setIsVisibleCourseEditForm] = useState(false)
    const user = userStore.User;

    let listStudents = []
    let listModules = []

    const [fetchCourseInfo, isDataLoading, dataError] = useFetching(async () => {
        let response = await TestingApi.getCourseInfo(userStore.CurCourse.courseObj);
        userStore.setCurCourse(response.data)
        setStudents(response.data.students)
        setModules(response.data.modules)
        console.log(response.data)
    })

    const [fetchSubscribeCourse, isSubscribeLoading, subscribeError] = useFetching(async () => {
        const item = {uid: userStore.User.uid, courseObj: userStore.CurCourse.courseObj}
        let response = await TestingApi.subscribeCourse(item);
        if (response.data === "ok") {
            message.success('Вы подписались на курс успешно');
        }
        let response2 = await TestingApi.getUserCourses(userStore.User.uid);
        userStore.setMyCourses(response2.data)
        onUpdate()
    })

    const [fetchUnsubscribeCourse, isUnsubscribeLoading, unsubscribeError] = useFetching(async () => {
        const item = {uid: userStore.User.uid, courseObj: userStore.CurCourse.courseObj}
        let response = await TestingApi.unsubscribeCourse(item);
        if (response.data === "ok") {
            message.success('Вы отписались от курса успешно');
        }
        let response2 = await TestingApi.getUserCourses(userStore.User.uid);
        userStore.setMyCourses(response2.data)
        onUpdate()
    })

    const [fetchDeleteCourse, isDeleteLoading, deleteError] = useFetching(async () => {
        let response = await TestingApi.deleteCourse(userStore.CurCourse);
        if (response.data === "ok") {
            message.success('Курс удалён успешно');
        }
        history.push(TESTING_ALL_COURSES_ROUTE);
    })

    const onUpdate = () => {
        setUpdate(!update)
    }

    useEffect(() => {
        fetchCourseInfo()
    }, [update])

    const handleEditCourse = () => {
        setIsVisibleCourseEditForm(true)
    }

    const handleSubscribeCourse = () => {
        fetchSubscribeCourse()
    }

    const handleUnsubscribeCourse = () => {
        fetchUnsubscribeCourse()
    }

    const handleDeleteCourse = () => {
        fetchDeleteCourse()
    }

    const isSubscribe = () => {
        const courses = userStore.MyCourses.filter(elem => elem.courseName === userStore.CurCourse.courseName)
        return courses.length > 0 ? true : false
    }

    if (students) {
        listStudents = students.map((item) => {
            return (
                <ListGroup.Item 
                    as="li"
                    className="d-flex justify-content-between align-items-start"
                    key={item.uid}
                >
                    <Avatar src="https://joeschmoe.io/api/v1/random" style={{marginRight: "20px"}}/>
                    <div className="ms-2 me-auto">
                        {item.firstName} {item.lastName}
                    </div>                    
                </ListGroup.Item>
            )
        })
    }

    if (modules) {
        listModules = modules.map((item, index) => {
            //const countPractice = item.practice.length
            const countLectures = item.lectures.length
            return (
                <ListGroup.Item 
                    as="li"
                    className="d-flex justify-content-between align-items-start"
                    key={index}
                >
                    <>
                        <div style={{fontSize: '14px'}} className="ms-2 me-auto">
                            <div className="fw-bold">{index+1}. {item.nameModule}</div>
                        </div> 
                        <Badge style={{color: 'black'}} bg="primary" pill>
                           <BookOutlined/> Материалов: {countLectures}
                        </Badge>        
                    </>            
                </ListGroup.Item>
            )
        })
    }

    const View = () => {
        return (
            <>
                <Row>
                    <Col>
                        <Divider style={{color: 'rgb(24 144 255)', fontSize: '20px'}} orientation="left">Информация о курсе:</Divider>
                        {curCourse.courseInfo}
                    </Col>
                </Row>
                <Row>
                    <Col>
                        { isAdmin(user)
                            ? <Button onClick={handleDeleteCourse} style={{lineHeight: "0.8", margin: "20px 0 0 20px"}} variant="outline-danger">Удалить курс</Button>
                            : null
                        }
                        { isAdmin(user)
                            ? <Button onClick={handleEditCourse} style={{lineHeight: "0.8", margin: "20px 0 0 20px"}} variant="outline-secondary">Редактировать курс</Button>
                            : null
                        }
                    </Col>
                    <EditCourse isVisible={isVisibleCourseEditForm} setIsVisible={setIsVisibleCourseEditForm} onUpdate={onUpdate}></EditCourse>
                </Row>
                <Row>
                    <Col xs={7}>
                        <Divider style={{color: 'rgb(24 144 255)', fontSize: '20px'}} orientation="left">Модули курса:</Divider>
                        <ListGroup as="ol">
                        {listModules}
                        </ListGroup>
                        {isSubscribe()
                            ? <Button style={{marginTop: "20px"}} onClick={() => handleUnsubscribeCourse(userStore.CurCourse)} variant="outline-danger">Покинуть курс</Button>
                            : <Button style={{marginTop: "20px"}} onClick={() => handleSubscribeCourse(userStore.CurCourse)} variant="outline-success">Подписаться на курс</Button>
                        }
                    </Col>
                    <Col>
                        <Divider style={{color: 'rgb(24 144 255)', fontSize: '20px'}} orientation="left">Студенты:</Divider>
                        <UsersList isEdit={false} users={students}/>
                    </Col>
                </Row>
            </>
        )
    }

    const spinner = isDataLoading || isSubscribeLoading || isUnsubscribeLoading ? <Loader/> : null;
    const errorMessage = dataError || subscribeError || unsubscribeError ? <ErrorMessage message={dataError} /> : null;
    const content = !(isDataLoading || isSubscribeLoading || isUnsubscribeLoading || dataError || subscribeError || unsubscribeError) ? <View/> : null;

    return (
        <>
            {spinner}
            {errorMessage}
            {content}
        </>
    )
}

export default CourseInfo;