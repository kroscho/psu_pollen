import React, { useContext, useEffect, useState } from "react";
import 'antd/dist/antd.css';
import { Context } from "../../..";
import { Button} from "react-bootstrap"
import { Col, Divider, Form, Input, message, Row, Space } from "antd";
import { FormOutlined } from '@ant-design/icons';
import AttemptTask from "../Task/AttemptTask";
import { useFetching } from "../../hooks/useFetching";
import TestingApi from "../../../API/TestingApi";
import ErrorMessage from "../../UI/Messages/ErrorMessage";
import Loader from "../../UI/Loader/Loader";
import TextArea from "antd/lib/input/TextArea";

const AttemptsDetails = ({onUpdate, isCheck}) => {
    const {userStore} = useContext(Context)
    const curTest = userStore.CurTest;
    const [viewDetails, setViewDetails] = useState(false)
    const [curAttempt, setCurAttempt] = useState({})
    const curAttempts = userStore.CurAttempts;

    const widthForm = window.innerWidth * 0.45
    //console.log(window.innerWidth, widthForm)
    const [form] = Form.useForm();
    let listAttempts = []

    const [fetchEditAttempt, isEditLoading, editError] = useFetching(async () => {
        let response = await TestingApi.editAttempt(userStore.CurEditAttempt);
        if (response.data === "ok") {
            message.success('Попытка проверена успешно');
        }
        onUpdate()
        //console.log(response.data)
    })

    const handleAttempt = (attempt) => {
        setCurAttempt(attempt)
        setViewDetails(true)
    }

    const onFinish = values => {
        values.testName = curAttempt.testName
        values["userObj"] = userStore.User.userObj
        values["testObj"] = curAttempt.testObj
        values["attemptObj"] = curAttempt.attemptObj
        userStore.setCurEditAttempt(values)
        fetchEditAttempt()
        //console.log('Received values of form:', values);
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

    const View = () => {
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

    const spinner = isEditLoading ? <Loader/> : null;
    const errorMessage = editError ? <ErrorMessage message={editError} /> : null;
    const content = !(isEditLoading || editError) ? <View/> : null;

    return (
        <>
            {spinner}
            {errorMessage}
            {content}
        </>
    )
}

export default AttemptsDetails;