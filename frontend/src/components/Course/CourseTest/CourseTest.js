import React, { useContext, useEffect, useState } from "react";
import 'antd/dist/antd.css';
import { Context } from "../../..";
import { Button} from "react-bootstrap"
import { Col, Divider, Form, Row, Space } from "antd";
import SingleTask from "../../Tasks/Single/SingleTask";
import MultipleTask from "../../Tasks/Multiple/MultipleTask";
import TextTask from "../../Tasks/Text/TextTask";
import { LOGICAL_TASK_TYPE, MULTIPLE_TASK_TYPE, SINGLE_TASK_TYPE } from "../../../utils/consts";
import Task from "../../Tasks/Task/Task";
import { useFetching } from "../../hooks/useFetching";
import TestingApi from "../../../API/TestingApi";
import Loader from "../../UI/Loader/Loader";
import AttemptsDetails from "../AttemptsDetails/AttemptsDetails";

const CourseTest = () => {
    const {userStore} = useContext(Context)
    const [answers, setAnswers] = useState({})
    const curTest = userStore.CurTest;
    const [form] = Form.useForm();
    const [result, setResult] = useState({})
    const [attempts, setAttempts] = useState([])
    const [isAttemptCompleted, setIsAttemptCompleted] = useState(false)
    let listTasks = []
    //console.log(curTest)

    const [fetchAttempt, isAttemptLoading, attemptError] = useFetching(async () => {
        let response = await TestingApi.getResultAttempt(userStore.CurAttempt, userStore.User);
        setResult(response.data)
        fetchAttempts()
        setIsAttemptCompleted(true)
        //console.log(response.data)
    })

    const [fetchAttempts, isAttemptsLoading, attemptsError] = useFetching(async () => {
        let response = await TestingApi.getAttempts(userStore.User.uid, userStore.CurTest.testName)
        setAttempts(response.data)
        userStore.setCurAttempts(response.data)
        //console.log(response.data)
    })

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
        userStore.setCurAttempt(values)
        fetchAttempt()
        //console.log('Received values of form:', values);
    };

    const View = () => {
        if (!isAttemptCompleted) {
            return (
                <Form
                    style={{margin: "0 20%"}}
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

    const spinner = isAttemptLoading ? <Loader/> : null;
    const content = !(isAttemptLoading || attemptError) ? <View/> : null;

    return (
        <>
            {spinner}
            {content}
        </>
    )
}

export default CourseTest;