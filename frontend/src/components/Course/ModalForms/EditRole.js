import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import { Modal, Button, Form, Input, message, Select } from 'antd';
import TestingApi from '../../../API/TestingApi';

const { Option } = Select;

const RoleEdit = ({onUpdateUsers, user, isVisible, setIsVisible}) => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false)

    const fetchEditRole = async (userr) => {
        setIsLoading(true)
        try {
            let response = await TestingApi.editRole(userr);
            if (response.data === "ok") {
                message.success('Роль пользователя изменена успешно');
                onUpdateUsers()
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

    useEffect(() => {
        form.setFieldsValue({
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            email: user.email,
        })
    })

    const handleOk = () => {
        setIsVisible(false);
    };

    const handleCancel = () => {
        setIsVisible(false);
    };

    const onFinish = values => {
        values["uid"] = user.uid
        values["userObj"] = user.userObj
        console.log('Received values of form:', values);
        fetchEditRole(values)
    };

    const onRoleChange = (value) => {
        console.log(value)
    }

    return (
        <>
        <Modal title="Редактирование роли" visible={isVisible} onOk={handleOk} onCancel={handleCancel}>
            <Form 
                form={form} 
                name="dynamic_form_nest_item" 
                onFinish={onFinish} 
                autoComplete="off"
            >
                <Form.Item name="firstName" label="Имя">
                    <Input disabled/>
                </Form.Item>
                <Form.Item name="lastName" label="Фамилия">
                    <Input disabled/>
                </Form.Item>
                <Form.Item
                    name="role"
                    label="Роль"
                    rules={[{required: true}]}
                    >
                    <Select
                        placeholder="Select a option and change input text above"
                        onChange={onRoleChange}
                        allowClear
                    >
                        <Option value="student">student</Option>
                        <Option value="admin">admin</Option>
                    </Select>
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

export default RoleEdit;