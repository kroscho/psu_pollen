import React, { useContext, useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import { Modal, Button, Form, Input, Space, Select, message } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Context } from '../../..';
import EditTask from '../Task/EditTask';
import TestingApi from '../../../API/TestingApi';
import { useFetching } from '../../hooks/useFetching';
import Loader from '../../UI/Loader/Loader';
import { deepEqual } from '../../utils/testing';
import TextArea from 'antd/lib/input/TextArea';
import { MULTIPLE_TASK_TYPE, TEXT_TASK_TYPE } from '../../../utils/consts';

const { Option } = Select;

const types = [
    { value: '1', label: 'Текстовый ответ' },
    { value: '2', label: 'Единственный ответ' },
    { value: '3', label: 'Множественный выбор' },
    { value: '4', label: 'Логический' },
];

const TestEdit = ({isVisible, setIsVisible}) => {
    const {userStore} = useContext(Context)
    const [curTest, setCurTest] = useState(userStore.CurTest)
    const [valueQuestion, setValueQuestion] = useState("")
    const [answers, setAnswers] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [templates, setTemplates] = useState([])
    const [terms, setTerms] = useState([])
    const [form] = Form.useForm();

    const [fetchTest, isDataLoading, testError] = useFetching(async () => {
        let response = await TestingApi.getTestWithAnswers(curTest.testName);
        setCurTest(response.data)
        //console.log(response.data)
        let response2 = await TestingApi.getTermsBySubjArea(userStore.CurModule.subjectArea);
        setTerms(response2.data)
        //console.log(response2.data)
        let response1 = await TestingApi.getTemplates();
        setTemplates(response1.data)
        //console.log("templates: ", response1.data)
    })

    const [fetchUpdate, isUpdateLoading, updateError] = useFetching(async () => {
        let response = await TestingApi.updateTest(userStore.CurTest);
        //console.log(response.data)
        if (response.data === "ok") {
            message.success('Тест изменен успешно');
        }
    })

    const fetchAnswersAuto = async (template, concepts, fieldKey) => {
        setIsLoading(true)
        const item = {subjectArea: userStore.CurModule.subjectArea, template: template, concepts: concepts}
        let response = await TestingApi.getAnswersAuto(item);
        //console.log(response.data)
        updateFormAnswers(response.data, fieldKey)
        setIsLoading(false)
    }

    useEffect(() => {
        if (isVisible) {
            fetchTest()
        }
    }, [])

    const updateFormAnswers = (data, fieldKey) => {
        //const fieldKey = userStore.СurFieldKey
        //console.log("fieldKey: ", fieldKey)
        let answersCopy = answers.slice()
        answersCopy[fieldKey] = data
        let fields = form.getFieldsValue()
        //console.log(fields)
        if (Object.keys(fields).length !== 0 && answersCopy) {
           // console.log(fields.tasks[fieldKey].type)
            if (fields.tasks[fieldKey].type === TEXT_TASK_TYPE || fields.tasks[fieldKey].type === undefined) {
                fields.tasks[fieldKey].answer = ""
                for (let item of answersCopy[fieldKey]) {
                   // console.log("item: ", item)
                    fields.tasks[fieldKey].answer += item.answer + ", "
                }
                fields.tasks[fieldKey].answer = fields.tasks[fieldKey].answer.substring(0, fields.tasks[fieldKey].answer.length - 2)
                fields.tasks[fieldKey].type = TEXT_TASK_TYPE
                form.setFieldsValue({ 
                    testName: fields.testName,
                    tasks: fields.tasks,
                })
            } else {
                fields.tasks[fieldKey].answers = []
                for (let item of answersCopy[fieldKey]) {
                    //console.log("item: ", item)
                    fields.tasks[fieldKey].answers.push({answer: item.answer, correct: true})
                }
                fields.tasks[fieldKey].type = MULTIPLE_TASK_TYPE
                form.setFieldsValue({ 
                    testName: fields.testName,
                    tasks: fields.tasks,
                })
            }
            //console.log(fields)
            setAnswers(answersCopy)
        }
    }

    const handleCancel = () => {
        form.setFieldsValue({ testName: curTest.testName, tasks: curTest.tasks, answers: curTest.tasks})
        setIsVisible(false);
    };

    const handleGenerateAnswers = (fieldKey) => {
        //console.log("fieldKey: ", fieldKey)
        const fields = form.getFieldsValue()
        const template = fields.tasks[fieldKey].template
        const concepts = fields.tasks[fieldKey].concepts
    
        fetchAnswersAuto(template, concepts, fieldKey)
    }

    const handleChangeTemplate = (option, fieldKey) => {
        //console.log(option, fieldKey)
        let fields = form.getFieldsValue()
        fields.tasks[fieldKey].question = option.label.substr(option.label.indexOf('|') + 2)
        form.setFieldsValue({ 
            testName: fields.testName,
            tasks: fields.tasks,
        })
        //console.log("fields: ", fields)
    }

    const handleChange = (value, fieldKey) => {
       // console.log('selected: ', value, fieldKey);
        let fields = form.getFieldsValue()
        for (let i=0; i<value.length; i++) {
            const questionText = fields.tasks[fieldKey].question
            fields.tasks[fieldKey].question = questionText.replace("...", value[i])
        }
        form.setFieldsValue({ 
            testName: fields.testName,
            tasks: fields.tasks,
        })
        //setSelectedTerms(value)
    };

    const onChangeType = () => {
        const fields = form.getFieldsValue()
        form.setFieldsValue({ fields })
    }

    const listTerms = terms.map((item) => {
        return {value: item.term, label: item.termStr}
    })

    const listTemplates = templates.map((item) => {
        return {value: item.tempObj, label: item.tempName + " | " + item.tempTitle}
    })

    const listConcepts = terms.map((item) => {
        return <Option key={item.term}>{item.termStr}</Option>
    })

    const onFinish = values => {
        const isEqual = deepEqual(values, curTest)
        if (!isEqual) {
            values["prevNameTest"] = curTest.testName;
            userStore.setCurTest(values);
            fetchUpdate()
        }
        //console.log('Received values of form:', values);
    };

    if (isDataLoading || isUpdateLoading) {
        return <Loader/>
    } else {
        return (
            <>
            <Modal 
            title="Редактирование теста" 
            visible={isVisible}
            onCancel={handleCancel}
            footer={[
                <Button key="back" onClick={handleCancel}>
                  Отмена
                </Button>
              ]}
            >
                <Form 
                form={form} 
                name="сontrol-hooks"
                onFinish={onFinish} 
                layout="vertical"
                initialValues={{
                    ["testName"]: curTest.testName,
                    ["tasks"]: curTest.tasks,
                }}
                >
                    <Form.Item name="testName" label="Название теста" style={{alignItems: 'center'}} rules={[{ required: true, message: 'Не заполнено название теста' }]}>
                        <Input />
                    </Form.Item>
                    <Form.List name="tasks">
                        {(fields, { add, remove }) => (
                        <>
                            {fields.map(field => (
                            <Space key={field.key} style={{display: 'flex', justifyContent: 'center'}} align="baseline">
                                { !isLoading
                                    ?   <Form.Item
                                        style={{borderTop: '1px solid'}}
                                        shouldUpdate={(prevValues, curValues) => {
                                            //console.log(prevValues.tasks[field.key]?.question, curValues.tasks[field.key]?.question);
                                            //console.log(prevValues.fields?.tasks[field.key]?.template, curValues.fields?.tasks[field.key]?.template);
                                            return prevValues.fields?.tasks[field.key]?.template !== curValues.fields?.tasks[field.key]?.template;
                                        }}
                                        >
                                        {() => (
                                            <>
                                                <Form.Item
                                                {...field}
                                                label="Тип вопроса"
                                                name={[field.name, 'type']}
                                                rules={[{ required: true, message: 'Missing type' }]}
                                                style={{ margin: '10px auto'}}
                                                >
                                                    <Select options={types} style={{ width: 200 }} onChange={onChangeType} />
                                                </Form.Item>
                                                <Form.Item
                                                label="Выберите шаблон вопроса: "
                                                name={[field.name, 'template']}
                                                rules={[{ required: true, message: 'Missing type' }]}
                                                style={{ margin: '10px auto'}}
                                                >
                                                    <Select
                                                    showSearch
                                                    style={{ width: 300 }}
                                                    placeholder="Искать шаблон"
                                                    optionFilterProp="children"
                                                    filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
                                                    filterSort={(optionA, optionB) =>
                                                        optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                                                    }
                                                    onChange={(input, option) => handleChangeTemplate(option, field.key)}
                                                    options={listTemplates}
                                                    />
                                                </Form.Item>
                                                <Form.Item
                                                name={[field.name, 'concepts']}
                                                rules={[{ required: true, message: 'Missing type' }]}
                                                label="Выберите концепты, для вставки в шаблон"
                                                >
                                                    <Select
                                                    mode="multiple"
                                                    allowClear
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                    placeholder="Please select"
                                                    onChange={(value) => handleChange(value, field.key)}
                                                    >
                                                    {listConcepts}
                                                    </Select>
                                                </Form.Item>
                                                <Form.Item 
                                                name={[field.name, 'question']} 
                                                label="Текст вопроса" 
                                                rules={[{ required: true, message: 'Не заполнен текст вопроса' }]}
                                                >
                                                    <TextArea rows={4} value={valueQuestion} onChange={(e) => setValueQuestion(e.target.value)}></TextArea>
                                                </Form.Item>
                                                <Form.Item
                                                label="Концепт: "
                                                name={[field.name, 'term']}
                                                rules={[{ required: true, message: 'Missing type' }]}
                                                style={{ margin: '10px auto', pointerEvents: true}}
                                                >
                                                    <Select
                                                    showSearch
                                                    style={{
                                                    width: 300,
                                                    }}
                                                    placeholder="Искать концепт"
                                                    optionFilterProp="children"
                                                    filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
                                                    filterSort={(optionA, optionB) =>
                                                        optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                                                    }
                                                    options={listTerms}
                                                    >
                                                    </Select>
                                                </Form.Item>
                                                <Form.Item>
                                                    <Button onClick={() => handleGenerateAnswers(field.key)} type="dashed">Сгенерировать ответы</Button>
                                                </Form.Item>
                                            <EditTask tasks={curTest.tasks} form={form} field={field}></EditTask>
                                            </>
                                        )}
                                        </Form.Item>
                                    : <Loader/>
                                }
                                <MinusCircleOutlined onClick={() => remove(field.name)} />
                            </Space>
                            ))}

                            <Form.Item>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                Добавить задание
                            </Button>
                            </Form.Item>
                        </>
                        )}
                    </Form.List>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                        Сохранить изменения
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            </>
        )
    }
}

export default TestEdit;