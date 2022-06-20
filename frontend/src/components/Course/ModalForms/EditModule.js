import React, { useContext, useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import { Modal, Button, Form, Input, Upload, Avatar, message, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Context } from '../../..';
import { deepEqual } from '../../utils/testing';
import { useFetching } from '../../hooks/useFetching';
import TestingApi from '../../../API/TestingApi';
import Loader from '../../UI/Loader/Loader';
import ErrorMessage from '../../UI/Messages/ErrorMessage';
const { Option } = Select;

const ModuleEdit = ({isVisible, setIsVisible, onUpdate}) => {
    const {userStore} = useContext(Context)
    const [url, setUrl] = useState("")
    const [subAreas, setSubAreas] = useState([])
    const user = userStore.User;
    const curModule = userStore.CurModule;
    const [form] = Form.useForm();

    const [fetchSubjectAreas, isDataLoading, dataError] = useFetching(async () => {
        let response = await TestingApi.getSubjectAreas();
        setSubAreas(response.data)
        //console.log(response.data)
    })

    const [fetchEditModule, isEditLoading, editError] = useFetching(async () => {
        let response = await TestingApi.editModule(userStore.CurModule);
        if (response.data === "ok") {
            message.success('Модуль изменен успешно');
            let response1 = await TestingApi.getCourseInfo(userStore.CurCourse.courseObj);
            userStore.setCurCourse(response1.data)
            onUpdate()
            setIsVisible(false)
        } else {
            userStore.setCurModule(curModule);
        }
        //console.log(response.data)
    })

    useEffect(() => {
        if (isVisible) {
            fetchSubjectAreas()
        }
    }, [])

    const handleOk = () => {
        setIsVisible(false);
    };

    const handleCancel = () => {
        setIsVisible(false);
    };

    const onFinish = values => {
        values["moduleObj"] = curModule.moduleObj
        //console.log('Received values of form:', values);
        const isEqual = deepEqual(values, curModule)
        if (!isEqual) {
            userStore.setCurModule(values);
            fetchEditModule()
        }
    };

    const listAreas = subAreas.map((item) => {
        return (
            <Option key={item.subjectAreaObj} value="item">{item}</Option>
        )
    })

    const View = () => {
        return (
            <>
            <Modal title="Редактирование модуля" visible={isVisible} onOk={handleOk} onCancel={handleCancel}>
                <Form 
                    form={form} 
                    name="dynamic_form_nest_item" 
                    onFinish={onFinish} 
                    autoComplete="off"
                    initialValues={{
                        ["nameModule"]: curModule.nameModule,
                        ["subjectArea"]: curModule.subjectArea,
                    }}
                >
                    <Form.Item name="nameModule" label="Название модуля" rules={[{ required: true, message: 'Не заполнено название модуля' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="subjectArea" label="Предметная область" rules={[{ required: true, message: 'Не заполнено название модуля' }]}>
                        <Select placeholder="Select subject area">
                            {listAreas}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                        Сохранить изменения
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            </>
        );
    }

    const spinner = isEditLoading || isDataLoading ? <Loader/> : null;
    const errorMessage = editError ? <ErrorMessage message={editError} /> : null;
    const content = !(isEditLoading || isDataLoading || dataError || editError) ? <View/> : null;

    return (
        <>
            {spinner}
            {errorMessage}
            {content}
        </>
    )
};

export default ModuleEdit;