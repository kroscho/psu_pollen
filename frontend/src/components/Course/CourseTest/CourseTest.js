import React, { useState } from "react";
import 'antd/dist/antd.css';
import { Button} from "react-bootstrap"
import { Col, Divider, Form, message, Row } from "antd";
import SingleTask from "../../Tasks/Single/SingleTask";
import MultipleTask from "../../Tasks/Multiple/MultipleTask";
import TextTask from "../../Tasks/Text/TextTask";
import { CUR_ATTEMPTS_STORAGE, CUR_TEST_STORAGE, LOGICAL_TASK_TYPE, MULTIPLE_TASK_TYPE, SINGLE_TASK_TYPE, USER_STORAGE } from "../../../utils/consts";
import Task from "../../Tasks/Task/Task";
import TestingApi from "../../../API/TestingApi";
import Loader from "../../UI/Loader/Loader";
import AttemptsDetails from "../AttemptsDetails/AttemptsDetails";
import { getLocalStorage, setLocalStorage } from "../../utils/testing";

const CourseTest = () => {
    const [form] = Form.useForm();
    const [result, setResult] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const [isAttemptCompleted, setIsAttemptCompleted] = useState(false)
    let listTasks = []
    
    const user = getLocalStorage(USER_STORAGE);
    const curTest = getLocalStorage(CUR_TEST_STORAGE)

    const fetchAttempt = async (attempt) => {
        setIsLoading(true)
        try {
            let response = await TestingApi.getResultAttempt(attempt, user);
            setResult(response.data)
            fetchAttempts()
            setIsAttemptCompleted(true)
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

    const fetchAttempts = async () => {
        setIsLoading(true)
        try {
            let response = await TestingApi.getAttempts(user.uid, curTest.testName)
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

    if (curTest.tasks) {
        listTasks = curTest.tasks.map((item, ind) => {
            if (item.type === SINGLE_TASK_TYPE || item.type === LOGICAL_TASK_TYPE) {
                return <SingleTask key={ind} task={item}></SingleTask>
            }
            else if (item.type === MULTIPLE_TASK_TYPE) {
                return <MultipleTask key={ind} task={item}></MultipleTask>
            }
            else {
                return <TextTask key={ind} task={item}></TextTask>
            }
        })
    }

    const onFinish = values => {
        fetchAttempt(values)
        console.log('Received values of form:', values);
    };

    const View = () => {
        if (!isAttemptCompleted) {
            return (
                <Form
                    style={{margin: "0 20%"}}
                    name="dynamic_form_nest_item"
                    form={form}
                    layout="vertical"
                    onFinish={onFinish} 
                    autoComplete="off"
                    initialValues={{
                        ["testName"]: curTest.testName,
                        ["answers"]: curTest.tasks,
                    }}
                >
                    <Form.Item name="testName">
                        <Divider orientation="center">{curTest.testName}</Divider>
                    </Form.Item>                
                    <Form.List name="answers">
                        {(fields) => (
                        <>
                            {fields.map(field => (
                                <Form.Item
                                    key={field.key}
                                    style={{borderTop: '1px solid'}}
                                    shouldUpdate={(prevValues, curValues) =>
                                        prevValues.testName !== curValues.testName || prevValues.type !== curValues.type
                                    }
                                >
                                {() => (
                                    <>
                                        <Task tasks={curTest.tasks} form={form} field={field}></Task>
                                    </>
                                )}
                                </Form.Item>
                            ))}
                        </>
                        )}
                    </Form.List>
                    <Form.Item>
                        <Button type="primary">Завершить тест</Button>
                    </Form.Item>
                </Form>
            )
        } else {
            return (
                <>
                    <Row>
                        <Col xs={10}>
                            <Divider 
                                style={{color: 'rgb(76 86 96)', fontSize: '24px'}}
                                orientation="left"
                            >
                                Ваш результат: {result.trueCount} / {result.countTasks}
                            </Divider>
                        </Col>
                    </Row>
                    <AttemptsDetails></AttemptsDetails>
                </>
            )
        }
    }

    const spinner = isLoading ? <Loader/> : null;
    const content = !(isLoading) ? <View/> : null;

    return (
        <>
            {spinner}
            {content}
        </>
    )
}

export default CourseTest;