import React, { useState } from 'react';
import 'antd/dist/antd.css';
import { Modal, Button, Form, Input, message } from 'antd';
import { deepEqual, getLocalStorage } from '../../utils/testing';
import TestingApi from '../../../API/TestingApi';
import Loader from '../../UI/Loader/Loader';
import { USER_STORAGE } from '../../../utils/consts';

const ProfileEdit = ({isVisible, setIsVisible}) => {
    const [isLoading, setIsLoading] = useState(false)

    const user = getLocalStorage(USER_STORAGE);

    const fetchEditProfile = async (newUser) => {
        setIsLoading(true)
        try {
            let response = await TestingApi.editProfile(newUser);
            if (response.data === "ok") {
                message.success('Профиль изменен успешно');
                setIsVisible(false)
            }
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

    const handleOk = () => {
        setIsVisible(false);
    };

    const handleCancel = () => {
        setIsVisible(false);
    };

    const [form] = Form.useForm();

    const onFinish = values => {
        values["uid"] = user.uid
        console.log('Received values of form:', values);
        const isEqual = deepEqual(values, user)
        if (!isEqual) {
            fetchEditProfile(values)
        }
    };

    const View = () => {
        return (
            <>
            <Modal title="Редактирование профиля" visible={isVisible} onOk={handleOk} onCancel={handleCancel}>
                <Form 
                    form={form} 
                    name="dynamic_form_nest_item" 
                    onFinish={onFinish} 
                    autoComplete="off"
                    initialValues={{
                        ["firstName"]: user.firstName,
                        ["lastName"]: user.lastName,
                        ["role"]: user.role,
                        ["email"]: user.email,
                    }}
                >
                    <Form.Item name="firstName" label="Имя" rules={[{ required: true, message: 'Не заполнено поле' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="lastName" label="Фамилия" rules={[{ required: true, message: 'Не заполнено поле' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="role" label="Роль">
                        <Input disabled/>
                    </Form.Item>
                    <Form.Item name="email" label="Email">
                        <Input disabled/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Подтвердить изменения
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            </>
        );
    }

    const spinner = isLoading ? <Loader/> : null;
    //const errorMessage = editError ? <ErrorMessage message={editError} /> : null;
    const content = !(isLoading) ? <View/> : null;

    return (
        <>
            {spinner}
            {content}
        </>
    )
};

export default ProfileEdit;