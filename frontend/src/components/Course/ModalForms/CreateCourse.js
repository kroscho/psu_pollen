import React, { useContext, useState } from 'react';
import 'antd/dist/antd.css';
import { Modal, Button, Form, Input, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import TestingApi from '../../../API/TestingApi';
import { Context } from '../../..';

const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};
const tailLayout = {
    wrapperCol: {
        offset: 8,
        span: 16,
    },
};

const CreateCourse = ({isVisible, setIsVisible, update, setUpdate}) => {
    
    const [url, setUrl] = useState("")
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false)
    const {userStore} = useContext(Context)

    const fetchCreateCourse = async (course) => {
        setIsLoading(true)
        try {
            let response = await TestingApi.createCourse(course);
            if (response.data === "ok") {
                message.success('Курс создан успешно');
            }
            userStore.setCurTest({})
            if (update) {
                setUpdate(!update)
            }
            setIsVisible(false)
        } catch (err) {
            let errMessage = "";
            if (err instanceof Error) {
                errMessage = err.message;
            }
            console.log(errMessage);
            message.error("Курс с таким названием существует")
        }
        setIsLoading(false)
    }

    const handleOk = () => {
        setIsVisible(false);
    };

    const handleCancel = () => {
        setIsVisible(false);
    };

    const onReset = () => {
        form.resetFields();
    };

    const onFill = () => {
        form.setFieldsValue({
          name: 'Курс1',
          description: 'Описание Курса1',
          info: 'Информация о Курсе1',
        });
    };

    const onFinish = values => {
        console.log('Received values of form:', values);
        const item = {
            title: values.name,
            description: values.description,
            avatar: url,
            info: values.info,
            students: [],
            modules: [],
        }
        fetchCreateCourse(item)
    };

    return (
        <>
        <Modal title="Создание курса" visible={isVisible} onOk={handleOk} onCancel={handleCancel}>
            <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
                <Form.Item
                    name="name"
                    label="Название курса"
                    rules={[{required: true, message: 'Заполните поле'}]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="description"
                    label="Описание курса"
                    rules={[{required: true, message: 'Заполните поле'}]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="info"
                    label="Информация о курсе"
                    rules={[{required: true, message: 'Заполните поле'}]}
                >
                    <Input />
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        Создать
                    </Button>
                    <Button htmlType="button" onClick={onReset}>
                        Очистить
                    </Button>
                    <Button type="link" htmlType="button" onClick={onFill}>
                        Заполнить автоматически
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
        </>
    );
};

export default CreateCourse;