import React, { useContext, useState } from 'react';
import 'antd/dist/antd.css';
import { Modal, Button, Form, Input, Space, message } from 'antd';
import { Context } from '../../..';
import { deepEqual } from '../../utils/testing';
import { useFetching } from '../../hooks/useFetching';
import TestingApi from '../../../API/TestingApi';
import Loader from '../../UI/Loader/Loader';
import ErrorMessage from '../../UI/Messages/ErrorMessage';

const ProfileEdit = ({isVisible, setIsVisible}) => {
    const {userStore} = useContext(Context)
    const user = userStore.User;

    const [fetchEditProfile, isEditLoading, editError] = useFetching(async () => {
        let response = await TestingApi.editProfile(userStore.User);
        if (response.data === "ok") {
            message.success('Профиль изменен успешно');
            setIsVisible(false)
        } else {
            userStore.setUser(user);
        }
        //console.log(response.data)
    })

    const handleOk = () => {
        setIsVisible(false);
    };

    const handleCancel = () => {
        setIsVisible(false);
    };

    const [form] = Form.useForm();

    const onFinish = values => {
        values["uid"] = user.uid
        //console.log('Received values of form:', values);
        const isEqual = deepEqual(values, user)
        if (!isEqual) {
            userStore.setUser(values);
            fetchEditProfile()
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
};

export default ProfileEdit;