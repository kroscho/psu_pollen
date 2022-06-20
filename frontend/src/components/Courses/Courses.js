import React, { useContext, useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import { ListGroup, Row, Col, Button } from 'react-bootstrap';
import { Context } from '../../index';
import { Divider, Avatar } from "antd";
import history from "../../services/history";
import { isAdmin } from '../utils/testing';
import CreateCourse from '../Course/ModalForms/CreateCourse';
import { COURSE_INFO_ROUTE, TESTING_ALL_COURSES_ROUTE } from '../../utils/consts';
import TestingApi from '../../API/TestingApi';
import { useFetching } from '../hooks/useFetching';
import Loader from '../UI/Loader/Loader';
import ErrorMessage from '../UI/Messages/ErrorMessage';

const Courses = (props) => {
    const [isCreateCourseFormVisible, setIsCreateCourseFormVisible] = useState(false)
    const {userStore} = useContext(Context)

    const [fetchCourses, isDataLoading, dataError] = useFetching(async () => {
        let response = await TestingApi.getUserCourses(userStore.User.uid);
        userStore.setMyCourses(response.data)
        console.log(response.data)
    })

    useEffect(() => {
        fetchCourses()
    }, [])
    
    const data = userStore.MyCourses
    const user = userStore.User;

    const handleCourse = (item) => {
        userStore.setCurCourse(item);
        history.push(COURSE_INFO_ROUTE);
    }

    const handleAddCourse = () => {
        history.push(TESTING_ALL_COURSES_ROUTE);
    }

    const handleCreateCourse = () => {
        setIsCreateCourseFormVisible(true)
    }

    if (history.action === "POP") {
        console.log("POPOPO")
    }

    let listItems = []

    if (data) {
        listItems = data.map((item, index) => {
            return (
                <ListGroup.Item 
                    className="d-flex justify-content-between align-items-start"
                    style={{cursor: 'pointer'}}
                    onClick={() => handleCourse(item)}
                    key={index}
                >
                    <Avatar src="https://joeschmoe.io/api/v1/random" style={{marginRight: "20px"}}/>
                    <div className="ms-2 me-auto">
                        <div className="fw-bold">{item.courseName}</div>
                        {item.courseDescription}
                    </div>                    
                </ListGroup.Item>
            )
        })
    }

    const View = () => {
        return (
            <>
                <Row>
                    <Col xs={7}>
                        <Divider orientation="left">Мои курсы:</Divider>
                    </Col>
                    <Col>
                        <Button onClick={handleAddCourse} variant="outline-success">Добавить</Button>{' '}
                    </Col>
                    { isAdmin(user)
                        ? <Col><Button onClick={handleCreateCourse} style={{marginLeft: "5px"}} variant="outline-success">Создать курс</Button></Col>
                        : null
                    }
                </Row>
                <CreateCourse isVisible={isCreateCourseFormVisible} setIsVisible={setIsCreateCourseFormVisible}></CreateCourse>
                <ListGroup variant="flush">
                    {listItems}
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

export default Courses;