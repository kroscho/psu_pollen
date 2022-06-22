import React, { useState } from "react";
import 'antd/dist/antd.css';
import { Button} from "react-bootstrap"
import { Col, Divider, Form, message, Row, Space } from "antd";
import { FormOutlined } from '@ant-design/icons';
import AttemptTask from "../Task/AttemptTask";
import TestingApi from "../../../API/TestingApi";
import Loader from "../../UI/Loader/Loader";
import TextArea from "antd/lib/input/TextArea";
import { getLocalStorage } from "../../utils/testing";
import { CUR_ATTEMPTS_STORAGE, USER_STORAGE } from "../../../utils/consts";

const AttemptsDetails = ({onUpdate, isCheck}) => {
    const [form] = Form.useForm();
    const [viewDetails, setViewDetails] = useState(false)
    const [curAttempt, setCurAttempt] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const curAttempts = getLocalStorage(CUR_ATTEMPTS_STORAGE)
    const user = getLocalStorage(USER_STORAGE);

    const widthForm = window.innerWidth * 0.35
    let listAttempts = []

    const fetchEditAttempt = async (attempt) => {
        setIsLoading(true)
        try {
            let response = await TestingApi.editAttempt(attempt);
            if (response.data === "ok") {
                message.success('Попытка проверена успешно');
            }
            onUpdate()
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

    const handleAttempt = (attempt) => {
        setCurAttempt(attempt)
        setViewDetails(true)
    }

    const onFinish = values => {
        values.testName = curAttempt.testName
        values["userObj"] = user.userObj
        values["testObj"] = curAttempt.testObj
        values["attemptObj"] = curAttempt.attemptObj
        fetchEditAttempt(values)
        console.log('Received values of form:', values);
    };

    if (curAttempts) {
        listAttempts = curAttempts.map((attempt, ind) => {
            return (
                <div  
                    key={ind} 
                    style={{cursor: 'pointer', verticalAlign: 'baseline', marginTop: '20px'}} 
                    onClick={() => handleAttempt(attempt)}
                > 
                    <FormOutlined/> Попытка {ind+1}
                    { attempt.checked === "True"
                        ? <span> -  Проверено</span> 
                        : <span> -  Не проверено</span>
                    }
                </div>
            )
        })
    }

    const styleResultTest = (percentComplete) => {
        let styleInput = {color: "black", fontSize: '18px'}
        if (percentComplete < 0.3) {
            styleInput.color = "red"
        } else if (percentComplete < 0.61) {
            styleInput.color = "red"
        } else if (percentComplete < 0.81) {
            styleInput.color = "orange"
        } else {
            styleInput.color = "green"
        }
        return styleInput
    }

    if (!viewDetails) {
        return (
            <Row>
                <Col style={{border: '1px solid #cbcccd'}} xs={10}>
                    {listAttempts}                           
                </Col>
            </Row>
        )
    } else {
        return (
            <Form 
            form={form} 
            name="dynamic_form_nest_item"
            style={{border: '1px solid #cbcccd'}}
            onFinish={onFinish} 
            autoComplete="off"
            layout="vertical"
            initialValues={{
                ["testName"]: curAttempt.nameTest,
                ["tasks"]: curAttempt.tasks,
                ["answers"]: curAttempt.tasks,
            }}
            >
                <Form.Item>
                    <Button style={{margin: '10px 0 0 30px'}} onClick={() => setViewDetails(false)}>Вернуться к списку попыток</Button>
                </Form.Item>
                <Form.Item name="testName">
                    <Divider 
                        style={{color: 'rgb(76 86 96)', fontSize: '22px'}}
                        orientation="center"
                    >
                        {curAttempt.testName}
                    </Divider>
                    <Divider 
                        style={styleResultTest(curAttempt.percentComplete)}
                        orientation="left"
                    >
                        Результат теста: {curAttempt.percentComplete * 100}%
                    </Divider>
                </Form.Item>
                <Form.List name="tasks">
                    {(fields) => (
                    <>
                        {fields.map((field, index) => (
                        <Space key={field.key} style={{display: 'flex', justifyContent: 'center'}}>
                            <Form.Item
                            style={{borderTop: '2px solid', paddingTop: "10px"}}
                            shouldUpdate={(prevValues, curValues) =>
                                prevValues.nameTest !== curValues.nameTest || prevValues.type !== curValues.type
                            }
                            >
                            {() => (
                                <>
                                    <Form.Item 
                                    name={[field.name, 'question']} 
                                    label={`Вопрос ${index + 1}`}
                                    style={{fontWeight: 'bolder'}}
                                    >
                                        <TextArea rows={3} style={{border: '2px solid #000000', minWidth: widthForm + 'px'}}></TextArea>
                                    </Form.Item>
                                    <AttemptTask isCheck={isCheck} tasks={curAttempt.tasks} form={form} widthForm={widthForm} field={field}></AttemptTask>
                                </>
                            )}
                            </Form.Item>
                        </Space>
                        ))}
                    </>
                    )}
                </Form.List>
                { isCheck
                    ?   <Form.Item>
                            <Button style={{margin: '0 0 10px 30px'}} type="primary" htmltype="submit">
                                Завершить проверку
                            </Button>
                        </Form.Item> 
                    :   null
                }
            </Form>
        )
    }
}

export default AttemptsDetails;