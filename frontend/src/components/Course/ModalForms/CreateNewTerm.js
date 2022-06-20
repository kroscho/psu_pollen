import React, { useContext, useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Modal, Button, Form, Input, message, Select, Checkbox, Space } from 'antd';
import { Context } from '../../..';
import TestingApi from '../../../API/TestingApi';
import Loader from '../../UI/Loader/Loader';

const CreateTerm = ({isVisible, setIsVisible, subjectArea, onUpdate}) => {
    
    const [url, setUrl] = useState("")
    const [subAreas, setSubAreas] = useState([])
    const [templates, setTemplates] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isMultipleAnswer, setIsMultipleAnswer] = useState(false)
    const [form] = Form.useForm();

    const {userStore} = useContext(Context)

    const fetchTemplates = async () => {
        setIsLoading(true)
        let response = await TestingApi.getTemplates();
        setTemplates(response.data)
        console.log(response.data)
        setIsLoading(false)
    }

    useEffect(() => {  
        fetchTemplates()
    }, [])

    const fetchCreateTerm = async (item) => {
        setIsLoading(true)
        if (item.isMultipleAnswer === undefined) {
            item.isMultipleAnswer = false
        }
        item["subjectArea"] = subjectArea
        console.log("item: ", item)
        let response = await TestingApi.CreateTerm(item);
        if (response.data === "ok") {
            message.success('Концепт добавлен успешно');
        }
        setIsVisible(false);
        setIsLoading(false)
        onUpdate()
    }

    const handleCancel = () => {
        setIsVisible(false);
    };

    const onFinish = values => {
        console.log('Received values of form:', values);
        fetchCreateTerm(values)
    };

    const handleChangeCheckbox = () => {
        console.log(isMultipleAnswer)
        setIsMultipleAnswer(!isMultipleAnswer)
    }

    const listTemplates = templates.map((item) => {
        return {value: item.tempObj, label: item.tempName + " | " + item.tempTitle}
    })

    if (isLoading) {
        return <Loader/>
    } else {
        return (
            <>
            <Modal 
                title="Добавить концепт" 
                visible={isVisible} 
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                      Отмена
                    </Button>
                  ]}    
            >
                <Form form={form} name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off" layout='vertical'>
                    <Form.Item name="nameTerm" label="Название концепта" rules={[{ required: true, message: 'Не заполнено название концепта' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                    label="Выберите шаблон, к которому этот концепт мог бы относиться: "
                    name='template'
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
                        options={listTemplates}
                        />
                    </Form.Item>
                    <Form.Item name="isMultipleAnswer" value={isMultipleAnswer} valuePropName="checked" noStyle>
                        <Checkbox style={{margin: '0 0 20px 20px'}} onChange={handleChangeCheckbox}>Несколько ответов</Checkbox>
                    </Form.Item>
                    { isMultipleAnswer
                        ?   <Form.List name="answers">
                                {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }) => (
                                    <Space
                                        key={key}
                                        style={{ display: 'flex', marginBottom: 8 }}
                                        align="baseline"
                                    >
                                        <Form.Item
                                        {...restField}
                                        name={[name, 'answer']}
                                        rules={[{required: true, message: 'Не заполнено поле'}]}
                                        >
                                        <Input placeholder="Ответ" />
                                        </Form.Item>
                                        <MinusCircleOutlined onClick={() => remove(name)} />
                                    </Space>
                                    ))}
                                    <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                        Добавить ответ
                                    </Button>
                                    </Form.Item>
                                </>
                                )}
                            </Form.List>
                        :   <Form.Item
                            name='answer'
                            rules={[{required: true, message: 'Не заполнено поле'}]}
                            >
                                <Input placeholder="Ответ" />
                            </Form.Item>
                    }
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

    /*const spinner = isLoading ? <Loader/> : null;
    const content = !(isLoading) ? <View/> : null;

    return (
        <>
            {spinner}
            {content}
        </>
    )*/
};

export default CreateTerm;