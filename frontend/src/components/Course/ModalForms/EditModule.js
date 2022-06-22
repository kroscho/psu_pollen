import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import { Modal, Button, Form, Input, message, Select } from 'antd';
import { deepEqual, getLocalStorage, setLocalStorage } from '../../utils/testing';
import { useFetching } from '../../hooks/useFetching';
import TestingApi from '../../../API/TestingApi';
import Loader from '../../UI/Loader/Loader';
import { CUR_COURSE_STORAGE, CUR_MODULE_STORAGE } from '../../../utils/consts';
const { Option } = Select;

const ModuleEdit = ({isVisible, setIsVisible, onUpdate}) => {
    const [isLoading, setIsLoading] = useState(false)
    const [subAreas, setSubAreas] = useState([])
    
    const [form] = Form.useForm();

    const curCourse = getLocalStorage(CUR_COURSE_STORAGE)
    const curModule = getLocalStorage(CUR_MODULE_STORAGE)

    const [fetchSubjectAreas, isDataLoading, dataError] = useFetching(async () => {
        let response = await TestingApi.getSubjectAreas();
        setSubAreas(response.data)
    })

    const fetchEditModule = async (module) => {
        setIsLoading(true)
        try {
            let response = await TestingApi.editModule(module);
            if (response.data === "ok") {
                message.success('Модуль изменен успешно');
                let response1 = await TestingApi.getCourseInfo(curCourse.courseObj);
                setLocalStorage(CUR_COURSE_STORAGE, response1.data)
                setIsVisible(false)
                onUpdate()
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
        console.log('Received values of form:', values);
        const isEqual = deepEqual(values, curModule)
        if (!isEqual) {
            fetchEditModule(values)
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

    const spinner = isLoading || isDataLoading ? <Loader/> : null;
   // const errorMessage = editError ? <ErrorMessage message={editError} /> : null;
    const content = !(isLoading || isDataLoading || dataError) ? <View/> : null;

    return (
        <>
            {spinner}
            {content}
        </>
    )
};

export default ModuleEdit;