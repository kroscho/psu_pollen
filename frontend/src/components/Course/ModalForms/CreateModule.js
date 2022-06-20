import React, { useContext, useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import { Modal, Button, Form, Input, Upload, Avatar, message, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Context } from '../../..';
import { useFetching } from '../../hooks/useFetching';
import TestingApi from '../../../API/TestingApi';
import Loader from '../../UI/Loader/Loader';
import ErrorMessage from '../../UI/Messages/ErrorMessage';
const { Option } = Select;

const CreateModule = ({isVisible, setIsVisible, onUpdate}) => {
    
    const [url, setUrl] = useState("")
    const [subAreas, setSubAreas] = useState([])
    const [form] = Form.useForm();

    const {userStore} = useContext(Context)

    const [fetchSubjectAreas, isDataLoading, dataError] = useFetching(async () => {
        let response = await TestingApi.getSubjectAreas();
        setSubAreas(response.data)
        //console.log(response.data)
    })

    const [fetchCreateModule, isCreateLoading, createError] = useFetching(async () => {
        const item = {module: userStore.CurModule, courseObj: userStore.CurCourse.courseObj}
        let response = await TestingApi.createModule(item);
        if (response.data === "ok") {
            message.success('Модуль создан успешно');
        }
        let response1 = await TestingApi.getCourseInfo(userStore.CurCourse.courseObj);
        userStore.setCurCourse(response1.data)
        onUpdate()
        //console.log(response.data)
        userStore.setCurModule({})
        setIsVisible(false);
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
        console.log('Received values of form:', values);
        const item = {
            nameModule: values.nameModule,
            subjectArea: values.subjectArea,
            avatar: url,
            practice: [],
            lectures: [],
            tests: [],
        }
        userStore.setCurModule(item)
        fetchCreateModule()
        console.log(item)
    };

    const listAreas = subAreas.map((item) => {
        return (
            <Option key={item.subjectAreaObj} value={item.subjectAreaObj}>{item.subjectArea}</Option>
        )
    }) 

    const View = () => {
        return (
            <>
            <Modal title="Создание модуля" visible={isVisible} onOk={handleOk} onCancel={handleCancel}>
                <Form form={form} name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off">
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
                        Создать
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            </>
        );
    }

    const spinner = isCreateLoading || isDataLoading ? <Loader/> : null;
    const errorMessage = createError ? <ErrorMessage message={createError} /> : null;
    const content = !(isCreateLoading || isDataLoading || dataError || createError) ? <View/> : null;

    return (
        <>
            {spinner}
            {errorMessage}
            {content}
        </>
    )
};

export default CreateModule;