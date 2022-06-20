import React from 'react';
import 'antd/dist/antd.css';
import { Form, Input, Button, Space, Switch } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const EditTask = ({field, form}) => {
  
    if (form.getFieldsValue().tasks) {
        let questionType = ""
        if (form.getFieldsValue().tasks[field.key] && form.getFieldsValue().tasks[field.key].type) {
            questionType = form.getFieldsValue().tasks[field.key].type
        } else {
            questionType = "1"
        }
        console.log("questionType: ", questionType)
        if (questionType == "2" || questionType == "3") {
            return (
                <Form.List name={[field.name, 'answers']}>
                    {(fields, { add, remove }) => (
                    <>
                        {fields.map((field, index) => (
                        <Space key={field.key} style={{display: 'flex', justifyContent: 'center'}} align="baseline">
                            <Form.Item
                            {...field.restField}
                            name={[field.name, 'answer']}
                            label={"Ответ " + index + ":"} 
                            rules={[{ required: true, message: 'Не заполнен ответ' }]}
                            >
                            <Input style={{borderRadius: '10px'}} />
                            </Form.Item>
                            <Form.Item name={[field.name, 'correct']} label="Верный" valuePropName="checked">
                                <Switch />
                            </Form.Item>
                            <MinusCircleOutlined onClick={() => remove(field.name)} />
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
            );
        } else {
            return null
        }
    } else {
        console.log("kroscho")
        return null
    }
};


export default EditTask;
