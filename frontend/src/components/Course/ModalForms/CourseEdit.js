import React, { useState } from 'react';
import 'antd/dist/antd.css';
import { Modal, Button, Form, Input, message } from 'antd';
import TestingApi from '../../../API/TestingApi';
import Loader from '../../UI/Loader/Loader';
import { getLocalStorage } from '../../utils/testing';
import { CUR_COURSE_STORAGE } from '../../../utils/consts';

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

const EditCourse = ({isVisible, setIsVisible, onUpdate}) => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false)
    
    const curCourse = getLocalStorage(CUR_COURSE_STORAGE);

    const fetchEditCourse = async (course) => {
        setIsLoading(true)
        try {
            let response = await TestingApi.editCourse(course);
            if (response.data === "ok") {
                message.success('Курс отредактирован успешно');
            }
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

    const handleCancel = () => {
        setIsVisible(false);
    };

    const onReset = () => {
        form.resetFields();
    };

    const onFinish = values => {
        console.log('Received values of form:', values);
        const item = {
            courseObj: curCourse.courseObj,
            title: values.name,
            description: values.description,
            info: values.info,
        }
        fetchEditCourse(item)
    };

    if (isLoading) {
        return <Loader/>
    } else {
        return (
            <Modal 
            title="Создание курса" 
            visible={isVisible} 
            onCancel={handleCancel}
            footer={[
                <Button key="back" onClick={handleCancel}>
                    Отмена
                </Button>
            ]} 
            >
                <Form {...layout} 
                form={form} 
                name="control-hooks" 
                onFinish={onFinish}
                initialValues={{
                    ["name"]: curCourse.courseName,
                    ["description"]: curCourse.courseDescription,
                    ["info"]: curCourse.courseInfo,
                }}
                >
                    <Form.Item
                        name="name"
                        label="Название курса"
                        rules={[{ required: true, message: 'Заполните поле',},]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Описание курса"
                        rules={[{ required: true, message: 'Заполните поле',},]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="info"
                        label="Информация о курсе"
                        rules={[{ required: true, message: 'Заполните поле',},]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit">
                            Сохранить изменения
                        </Button>
                        <Button htmlType="button" onClick={onReset}>
                            Очистить
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
};

export default EditCourse;