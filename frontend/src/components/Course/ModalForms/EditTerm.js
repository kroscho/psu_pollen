import React, { useContext, useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Modal, Button, Form, Input, message, Select, Checkbox, Space } from 'antd';
import { Context } from '../../..';
import TestingApi from '../../../API/TestingApi';
import Loader from '../../UI/Loader/Loader';
import TextArea from 'antd/lib/input/TextArea';
import { deepEqual } from '../../utils/testing';

const EditTerm = ({isVisible, setIsVisible, term, subjectArea, onUpdate}) => {
    
    const [url, setUrl] = useState("")
    const [subAreas, setSubAreas] = useState([])
    const [templates, setTemplates] = useState([])
    const [isLoading, setIsLoading] = useState(false)
   // const [isMultipleAnswer, setIsMultipleAnswer] = useState(false)
    const [curTerm, setCurTerm] = useState({})
    const [form] = Form.useForm();
    const {userStore} = useContext(Context)

    const fetchTemplates = async () => {
        setIsLoading(true)
        let response = await TestingApi.getTemplates();
        setTemplates(response.data)
        //console.log(response.data)
        let response1 = await TestingApi.getInfoByTerm(term);
        //console.log(response1.data)
        setCurTerm(response1.data)
        updateForm(response1.data)
        setIsLoading(false)
    }

    useEffect(() => { 
        if (isVisible) {
            fetchTemplates()
        } 
    }, [isVisible])

    const updateForm = (fields) => {
        form.setFieldsValue({
            nameTerm: fields.nameTerm,
            list: fields.list,
        })
    }

    const fetchEditTerm = async (fields) => {
        setIsLoading(true)
        fields["subjectArea"] = subjectArea
        //console.log("item: ", fields)
        let response = await TestingApi.updateTerm(fields);
        if (response.data === "ok") {
            message.success('Концепт обновлен успешно');
        }
        setIsVisible(false);
        setIsLoading(false)
        onUpdate()
    }

    const handleCancel = () => {
        setIsVisible(false);
    };

    const handleChangeCheckBox = () => {
        const fields = form.getFieldsValue();
        //console.log(fields)
        setCurTerm(fields)
        form.setFieldsValue({
            nameTerm: fields.nameTerm,
            list: fields.list,
        })
    }

    const onFinish = values => {
        //console.log('Received values of form:', values);
        fetchEditTerm(values)
    };

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
                <Form 
                form={form} 
                name="dynamic_form_nest_item" 
                onFinish={onFinish} 
                autoComplete="off" 
                layout='vertical'
                
                >
                    <Form.Item name='nameTerm' label="Название концепта">
                        <Input disabled={true}/>
                    </Form.Item>
                    <Form.List name="list">
                        {(fields, { add, remove }) => (
                        <>
                            {fields.map((field) => (
                            <Space
                                key={field.key}
                                style={{ display: 'flex', marginBottom: 8, justifyContent: 'center' }}
                                align="baseline"
                            >
                                <Form.Item
                                style={{borderTop: '3px solid', width: "100%"}}
                                shouldUpdate={(prevValues, curValues) => {
                                    //console.log("EQUAL: ", deepEqual(prevValues.list, curValues.list));
                                    return !deepEqual(prevValues.list, curValues.list);
                                }}
                                >
                                {() => (
                                    <>
                                        <Form.Item
                                        label="Выберите шаблон, к которому этот концепт мог бы относиться: "
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
                                            options={listTemplates}
                                            />
                                        </Form.Item>
                                        <Form.Item name={[field.name, 'isMultipleAnswer']} valuePropName="checked" noStyle>
                                            <Checkbox onChange={handleChangeCheckBox} style={{margin: '0 0 20px 20px'}}>Несколько ответов</Checkbox>
                                        </Form.Item>
                                        { curTerm.list[field.key] && curTerm.list[field.key].isMultipleAnswer
                                            ?   <Form.List name={[field.name, 'answers']}>
                                                    {(fields = curTerm.list[field.key].answers, { add, remove }) => (
                                                    <>
                                                        {fields.map((fld) => (
                                                        <Space
                                                            key={fld.key}
                                                            style={{ display: 'flex', marginBottom: 8, justifyContent: 'center' }}
                                                            align="baseline"
                                                        >
                                                            <Form.Item
                                                            {...fld.restField}
                                                            name={[fld.name, 'answer']}
                                                            rules={[{required: true, message: 'Не заполнено поле'}]}
                                                            >
                                                            <TextArea rows={2}></TextArea>
                                                            </Form.Item>
                                                            <MinusCircleOutlined onClick={() => remove(fld.name)} />
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
                                                name={[field.name, 'answer']}
                                                rules={[{required: true, message: 'Не заполнено поле'}]}
                                                >
                                                    <TextArea rows={3}></TextArea>
                                                </Form.Item>
                                        }
                                    </>
                                )}
                                </Form.Item>
                                <MinusCircleOutlined onClick={() => remove(field.name)} />
                            </Space>
                            ))}
                            <Form.Item>
                            <Button type="primary" onClick={() => add()} block icon={<PlusOutlined />}>
                                Добавить шаблон
                            </Button>
                            </Form.Item>
                        </>
                        )}
                    </Form.List>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                        Внести изменения
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

export default EditTerm;