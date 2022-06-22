import React, { useContext, useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import { ListGroup, Row, Col, Button } from 'react-bootstrap';
import { Context } from '../../index';
import { Divider, Avatar, message } from "antd";
import history from "../../services/history";
import { getLocalStorage, isAdmin, setLocalStorage } from '../utils/testing';
import CreateCourse from '../Course/ModalForms/CreateCourse';
import { COURSE_INFO_ROUTE, CUR_COURSE_STORAGE, MY_COURSES_STORAGE, TESTING_ALL_COURSES_ROUTE, USER_STORAGE } from '../../utils/consts';
import TestingApi from '../../API/TestingApi';
import Loader from '../UI/Loader/Loader';

const Courses = () => {
    const [isCreateCourseFormVisible, setIsCreateCourseFormVisible] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [myCourses, setMyCourses] = useState([])
    const user = getLocalStorage(USER_STORAGE)

    const fetchCourses = async () => {
        setIsLoading(true)
        try {
            let response = await TestingApi.getUserCourses(user.uid);
            setMyCourses(response.data)
            setLocalStorage(MY_COURSES_STORAGE, response.data)
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
    }, [])

    const handleCourse = (item) => {
        setLocalStorage(CUR_COURSE_STORAGE, item)
        history.push(COURSE_INFO_ROUTE);
    }

    const handleAddCourse = () => {
        history.push(TESTING_ALL_COURSES_ROUTE);
    }

    const handleCreateCourse = () => {
        setIsCreateCourseFormVisible(true)
    }

   // if (history.action === "POP") {
   //     console.log("POPOPO")
   // }

    let listItems = []

    if (myCourses) {
        listItems = myCourses.map((item, index) => {
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

    const spinner = isLoading ? <Loader/> : null;
    //const errorMessage = dataError ? <ErrorMessage message={dataError} /> : null;
    const content = !(isLoading) ? <View/> : null;

    return (
        <>
            {spinner}
            {content}
        </>
    )
}

export default Courses;