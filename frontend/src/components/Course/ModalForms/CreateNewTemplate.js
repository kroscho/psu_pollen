import React, { useContext, useState } from 'react';
import 'antd/dist/antd.css';
import { Modal, Button, Form, Input, message } from 'antd';
import { Context } from '../../..';
import TestingApi from '../../../API/TestingApi';
import Loader from '../../UI/Loader/Loader';

const CreateTemplate = ({isVisible, setIsVisible, onUpdate}) => {
    
    const [isLoading, setIsLoading] = useState(false)
    const [form] = Form.useForm();

    const {userStore} = useContext(Context)

    const fetchCreateTemplate = async (item) => {
        setIsLoading(true)
        let response = await TestingApi.CreateTemplate(item);
        if (response.data === "ok") {
            message.success('Шаблон добавлен успешно');
        }
        setIsVisible(false);
        setIsLoading(false)
        onUpdate()
    }

    const handleCancel = () => {
        setIsVisible(false);
    };

    const onFinish = values => {
        //console.log('Received values of form:', values);
        fetchCreateTemplate(values)
    };

    const View = () => {
        return (
            <>
            <Modal 
                title="Добавить шаблон вопроса" 
                visible={isVisible} 
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                      Отмена
                    </Button>
                  ]}    
            >
                <Form form={form} name="dynamic_form_nest_item" onFinish={onFinish} layout="vertical" autoComplete="off">
                    <Form.Item name="nameTemplate" label="Название шаблона" rules={[{ required: true, message: 'Не заполнено поле' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="titleTemplate" label="Текст шаблона (пример: Что такое ...?) " rules={[{ required: true, message: 'Не заполнено поле' }]}>
                        <Input />
                    </Form.Item>
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

    const spinner = isLoading ? <Loader/> : null;
    const content = !(isLoading) ? <View/> : null;

    return (
        <>
            {spinner}
            {content}
        </>
    )
};

export default CreateTemplate;