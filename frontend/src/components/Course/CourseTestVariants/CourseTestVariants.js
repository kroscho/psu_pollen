import React, { useContext, useEffect, useState } from "react";
import 'antd/dist/antd.css';
import { Context } from "../../..";
import {Button} from "react-bootstrap"
import history from "../../../services/history";
import { COURSE_TESTS_ROUTE, TESTS_TEST_ATTEMPTS_DETAILS_ROUTE, TESTS_TEST_ATTEMPT_ROUTE, TESTS_TEST_CHECK_WORKS_ROUTE, TESTS_TEST_ROUTE } from "../../../utils/consts";
import { isAdmin } from "../../utils/testing";
import TestEdit from "../ModalForms/CourseTestEdit";
import ErrorMessage from "../../UI/Messages/ErrorMessage";
import Loader from "../../UI/Loader/Loader";
import { useFetching } from "../../hooks/useFetching";
import TestingApi from "../../../API/TestingApi";
import { Divider, Row } from "antd";

const CourseTestVariants = () => {
    const {userStore} = useContext(Context)
    const [attempts, setAttempts] = useState([])
    const curTest = userStore.CurTest;
    const user = userStore.User;

    const [isEsitTestFormVisible, setIsEditTestFormVisible] = useState(false)

    const [fetchAttempts, isAttemptsLoading, attemptsError] = useFetching(async () => {
        let response = await TestingApi.getAttempts(userStore.User.uid, userStore.CurTest.testName)
        setAttempts(response.data)
        userStore.setCurAttempts(response.data)
        console.log(response.data)
    })

    const [fetchTest, isTestLoading, testError] = useFetching(async () => {
        console.log("CurTest: ", userStore.CurTest)
        let response = await TestingApi.getTest(userStore.CurTest.testName)
        userStore.setCurTest(response.data)
        console.log(response.data)
    })

    useEffect(() => {
        fetchAttempts()
        fetchTest()
    }, [])

    const [fetchDelete, isDeleteLoading, deleteError] = useFetching(async () => {
        let response = await TestingApi.deleteTest(userStore.CurTest);
        console.log(response.data)
        let response1 = await TestingApi.getCourseInfo(userStore.CurCourse.courseObj);
        userStore.setCurCourse(response1.data)
        userStore.setCurTest({})
        history.push(COURSE_TESTS_ROUTE);
    })

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
                { !isTestLoading
                    ? <TestEdit isVisible={isEsitTestFormVisible} setIsVisible={setIsEditTestFormVisible}></TestEdit>
                    : null
                }
            </>
        )
    }

    const spinner = isAttemptsLoading || isTestLoading ? <Loader/> : null;
    const errorMessage = attemptsError ? <ErrorMessage message={attemptsError} /> : null;
    const content = !(isAttemptsLoading || attemptsError || isTestLoading || testError) ? <View/> : null;

    return (
        <>
            {spinner}
            {errorMessage}
            {content}
        </>
    )
}

export default CourseTestVariants;