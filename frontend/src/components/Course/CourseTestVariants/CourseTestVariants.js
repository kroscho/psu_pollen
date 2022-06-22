import React, { useEffect, useState } from "react";
import 'antd/dist/antd.css';
import {Button} from "react-bootstrap"
import history from "../../../services/history";
import { COURSE_TESTS_ROUTE, CUR_ATTEMPTS_STORAGE, CUR_COURSE_STORAGE, CUR_TEST_STORAGE, TESTS_TEST_ATTEMPTS_DETAILS_ROUTE, TESTS_TEST_ATTEMPT_ROUTE, TESTS_TEST_CHECK_WORKS_ROUTE, TESTS_TEST_ROUTE, USER_STORAGE } from "../../../utils/consts";
import { getLocalStorage, isAdmin, setLocalStorage } from "../../utils/testing";
import TestEdit from "../ModalForms/CourseTestEdit";
import Loader from "../../UI/Loader/Loader";
import TestingApi from "../../../API/TestingApi";
import { Divider, message, Row } from "antd";

const CourseTestVariants = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [attempts, setAttempts] = useState([])
    
    const curTest = getLocalStorage(CUR_TEST_STORAGE)
    const curCourse = getLocalStorage(CUR_COURSE_STORAGE)
    const user = getLocalStorage(USER_STORAGE)

    const [isEsitTestFormVisible, setIsEditTestFormVisible] = useState(false)

    const fetchAttempts = async () => {
        setIsLoading(true)
        try {
            let response = await TestingApi.getAttempts(user.uid, curTest.testName)
            setAttempts(response.data)
            setLocalStorage(CUR_ATTEMPTS_STORAGE, response.data)
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

    const fetchTest = async () => {
        setIsLoading(true)
        try {
            let response = await TestingApi.getTest(curTest.testName)
            setLocalStorage(CUR_TEST_STORAGE, response.data)
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
        fetchAttempts()
        fetchTest()
    }, [])

    const fetchDelete = async () => {
        setIsLoading(true)
        try {
            let response = await TestingApi.deleteTest(curTest);
            let response1 = await TestingApi.getCourseInfo(curCourse.courseObj);
            setLocalStorage(CUR_COURSE_STORAGE, response1.data)
            setLocalStorage(CUR_TEST_STORAGE, {})
            if (response.data === "ok") {
                message.success("Тест успешно удален")
            }
            history.push(COURSE_TESTS_ROUTE);
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

    const handleStartTest = () => {
        history.push(TESTS_TEST_ATTEMPT_ROUTE);
    }

    const handleViewDetails = () => {
        history.push(TESTS_TEST_ATTEMPTS_DETAILS_ROUTE);
    }

    const handleCheckWorksStudents = () => {
        history.push(TESTS_TEST_CHECK_WORKS_ROUTE);
    }

    const onEditTest = () => {
        setIsEditTestFormVisible(true)
    }

    const onDeleteTest = () => {
        fetchDelete()
    }

    const View = () => {
        return (
            <>
                <Divider orientation="left">{curTest.testName}</Divider>
                <Row>
                    { isAdmin(user)
                        ?<Button 
                            style={{lineHeight: "0.8", margin: "30px 30px"}} 
                            variant="outline-success"
                            onClick={handleCheckWorksStudents}
                        >
                            Проверить работы студентов
                        </Button>
                        : null
                    }
                </Row>
                <Row>
                    <Button 
                        style={{lineHeight: "0.8", margin: "30px 30px"}} 
                        variant="outline-success"
                        onClick={handleStartTest}
                    >
                        Начать попытку
                    </Button>
                </Row>
                <Row style={{lineHeight: "0.8", margin: "0 30px 30px 30px"}} >
                    Совершено попыток: {attempts.length}
                    { attempts.length != 0
                        ? <Button 
                            style={{lineHeight: "0.8", margin: "0px 30px"}} 
                            variant="outline-success"
                            onClick={handleViewDetails}
                        >
                            Посмотреть подробно
                        </Button>
                        : null
                    }
                </Row>
                <Row>
                    { isAdmin(user)
                        ? <Button onClick={onEditTest} style={{lineHeight: "0.8", marginLeft: "30px"}} variant="outline-secondary">Редактировать тест</Button>
                        : null
                    }
                    { isAdmin(user)
                        ? <Button onClick={onDeleteTest} style={{lineHeight: "0.8", marginLeft: "15px"}} variant="outline-danger">Удалить тест</Button>
                        : null
                    }
                </Row>
                { !isLoading
                    ? <TestEdit isVisible={isEsitTestFormVisible} setIsVisible={setIsEditTestFormVisible}></TestEdit>
                    : null
                }
            </>
        )
    }

    const spinner = isLoading ? <Loader/> : null;
    //const errorMessage = attemptsError ? <ErrorMessage message={attemptsError} /> : null;
    const content = !(isLoading) ? <View/> : null;

    return (
        <>
            {spinner}
            {content}
        </>
    )
}

export default CourseTestVariants;