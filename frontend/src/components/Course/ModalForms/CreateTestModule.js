import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import { Modal, Button, Form, Input, Space, Select, message } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import EditTask from '../Task/EditTask';
import TestingApi from '../../../API/TestingApi';
import { CUR_COURSE_STORAGE, CUR_MODULE_STORAGE, MULTIPLE_TASK_TYPE, TEXT_TASK_TYPE } from '../../../utils/consts';
import TextArea from 'antd/lib/input/TextArea';
import Loader from '../../UI/Loader/Loader';
import { getLocalStorage, setLocalStorage } from '../../utils/testing';

const { Option } = Select;

const types = [
    { value: '1', label: 'Текстовый ответ' },
    { value: '2', label: 'Единственный ответ' },
    { value: '3', label: 'Множественный выбор' },
    { value: '4', label: 'Истина/ложь' },
];

const CreateTestForm = ({isVisible, setIsVisible, onUpdate}) => {
    const [answers, setAnswers] = useState([])
    const [terms, setTerms] = useState([])
    const [filterTerms, setFilterTerms] = useState([])
    const [templates, setTemplates] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [answersByTemplates, setAnswersByTemplates] = useState([])
    const [valueQuestion, setValueQuestion] = useState("")

    const [form] = Form.useForm();

    const curModule = getLocalStorage(CUR_MODULE_STORAGE);
    const curCourse = getLocalStorage(CUR_COURSE_STORAGE)

    const handleOk = () => {
        setIsVisible(false);
    };

    const handleCancel = () => {
        setIsVisible(false);
    };

    const fetchTermsAndTemplates = async () => {
        setIsLoading(true)
        try {
            let response = await TestingApi.getTermsBySubjArea(curModule.subjectArea);
            setTerms(response.data)
            setFilterTerms(response.data)
            let response1 = await TestingApi.getTemplates();
            setTemplates(response1.data)
            let response2 = await TestingApi.getAnswersByTemplates();
            setAnswersByTemplates(response2.data)
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

    const fetchCreate = async (test) => {
        setIsLoading(true)
        try {
            const item = {test: test, module: curModule}
            let response = await TestingApi.createTest(item);
            if (response.data === "ok") {
                message.success('Тест создан успешно');
            }
            let response1 = await TestingApi.getCourseInfo(curCourse.courseObj);
            setLocalStorage(CUR_COURSE_STORAGE, response1.data)
            setIsVisible(false)
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

    const fetchAnswersAuto = async (template, concepts, fieldKey) => {
        setIsLoading(true)
        try {
            const item = {subjectArea: curModule.subjectArea, template: template, concepts: concepts}
            let response = await TestingApi.getAnswersAuto(item);
            updateFormAnswers(response.data, fieldKey)
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
        if (isVisible) {
            fetchTermsAndTemplates()
        }
    }, [])

    const onFinish = values => {
        fetchCreate(values)
        console.log('Received values of form:', values);
    };

    const handleChangeType = () => {
        const fields = form.getFieldsValue()
        form.setFieldsValue({ 
            testName: fields.testName,
            tasks: fields.tasks,
        })
    };

    const updateFormAnswers = (data, fieldKey) => {
        let answersCopy = answers.slice()
        answersCopy[fieldKey] = data
        let fields = form.getFieldsValue()
        if (answersCopy) {
            if (fields.tasks[fieldKey].type === TEXT_TASK_TYPE || fields.tasks[fieldKey].type === undefined) {
                fields.tasks[fieldKey].answer = ""
                for (let item of answersCopy[fieldKey]) {
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
                    fields.tasks[fieldKey].answers.push({answer: item.answer, correct: true})
                }
                fields.tasks[fieldKey].type = MULTIPLE_TASK_TYPE
                form.setFieldsValue({ 
                    testName: fields.testName,
                    tasks: fields.tasks,
                })
            }
            setAnswers(answersCopy)
        }
    }

    const listTerms = terms.map((item) => {
        return {value: item.term, label: item.termStr}
    })

    const listTemplates = templates.map((item) => {
        return {value: item.tempObj, label: item.tempName + " | " + item.tempTitle}
    })

    const handleGenerateAnswers = (fieldKey) => {
        const fields = form.getFieldsValue()
        const template = fields.tasks[fieldKey].template
        const concepts = fields.tasks[fieldKey].concepts
    
        fetchAnswersAuto(template, concepts, fieldKey)
    }

    const handleChangeTemplate = (option, fieldKey) => {
        let fields = form.getFieldsValue()
        if (option.value !== "#") {
            fields.tasks[fieldKey].question = option.label.substr(option.label.indexOf('|') + 2)
            const templ = fields.tasks[fieldKey].template
            let filterTerms = []
            for (let item of answersByTemplates) {
                if (item.templateObj === templ) {
                    filterTerms.push(item.termObj)
                }
            }
            const filter = terms.filter((item) => filterTerms.includes(item.term))
            setFilterTerms(filter)
        } else {
            fields.tasks[fieldKey].question = ""
            setFilterTerms(terms)
        }
        form.setFieldsValue({ 
            testName: fields.testName,
            tasks: fields.tasks,
        })
    }

    const handleChange = (value, fieldKey) => {
        let fields = form.getFieldsValue()
        for (let i=0; i<value.length; i++) {
            const questionText = fields.tasks[fieldKey].question
            if (questionText !== "" && questionText !== undefined) {
                fields.tasks[fieldKey].question = questionText.replace("...", value[i])
            } 
        }
        form.setFieldsValue({ 
            testName: fields.testName,
            tasks: fields.tasks,
        })
        //setSelectedTerms(value)
    };

    const listConcepts = filterTerms.map((item) => {
        return <Option key={item.term}>{item.termStr}</Option>
    })
    
    if (isLoading) {
        return <Loader/>;
    } else {
        return (
            <>
            <Modal title="Создание теста" visible={isVisible} onOk={handleOk} onCancel={handleCancel} width={500}>
                <Form form={form} name="сontrol-hooks" onFinish={onFinish} layout="vertical" >
                    <Form.Item name="testName" label="Название теста"  style={{alignItems: 'center'}} rules={[{ required: true, message: 'Не заполнено название теста' }]}>
                        <Input style={{width: "100%"}}/>
                    </Form.Item>
                    <Form.List name="tasks" style={{width: "700px"}}>
                        {(fields, { add, remove }) => (
                        <>
                            {fields.map(field => (
                            <Space key={field.key} style={{display: 'flex', justifyContent: 'center'}}>
                                { !(isLoading) 
                                    ?   <Form.Item
                                            style={{borderTop: '1px solid', width: "100%"}}
                                            shouldUpdate={(prevValues, curValues) => {
                                                //console.log(prevValues.tasks[field.key]?.question, curValues.tasks[field.key]?.question);
                                                //console.log(prevValues.fields?.tasks[field.key]?.template, curValues.fields?.tasks[field.key]?.template);
                                                return prevValues.fields?.tasks[field.key]?.template !== curValues.fields?.tasks[field.key]?.template;
                                            }}
                                            >
                                            {() => (
                                                <>
                                                    <Form.Item
                                                    label="Тип вопроса"
                                                    name={[field.name, 'type']}
                                                    rules={[{ required: true, message: 'Missing type' }]}
                                                    style={{ margin: '10px auto'}}
                                                    >
                                                        <Select options={types} style={{ width: 300 }} onChange={handleChangeType} />
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
                                                    label="Текст вопроса (необязательно, чтоб он соответствовал сгенерированному)" 
                                                    rules={[{ required: true, message: 'Не заполнен текст вопроса' }]}
                                                    >
                                                        <TextArea rows={4} onChange={(e) => setValueQuestion(e.target.value)}></TextArea>
                                                    </Form.Item>
                                                    <Form.Item
                                                    label="Концепт: "
                                                    name={[field.name, 'term']}
                                                    rules={[{ required: true, message: 'Missing type' }]}
                                                    style={{ margin: '10px auto'}}
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
                                                        />
                                                    </Form.Item>
                                                    <Form.Item>
                                                        <Button onClick={() => handleGenerateAnswers(field.key)} type="dashed">Сгенерировать ответы</Button>
                                                    </Form.Item>
                                                <EditTask form={form} field={field}></EditTask>
                                                </>
                                            )}
                                        </Form.Item>
                                    : null
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
                        Добавить
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            </>
        );
    }
};

export default CreateTestForm;