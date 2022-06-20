import React, { useContext, useState } from 'react';
import 'antd/dist/antd.css';
import { Modal, Button, Form, Input, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import TestingApi from '../../../API/TestingApi';
import { useFetching } from '../../hooks/useFetching';
import { Context } from '../../..';
import Loader from '../../UI/Loader/Loader';

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
    
    const [url, setUrl] = useState("")
    const [form] = Form.useForm();
    const {userStore} = useContext(Context)
    const curCourse = userStore.CurCourse;
    console.log(curCourse)

    const [fetchEditCourse, isCreateLoading, createError] = useFetching(async () => {
        let response = await TestingApi.editCourse(userStore.CurNewCourse);
        console.log(response.data)
        if (response.data === "ok") {
            message.success('Курс отредактирован успешно');
        }
        userStore.setCurTest({})
        onUpdate()
        setIsVisible(false)
    })

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
        userStore.setCurNewCourse(item)
        fetchEditCourse()
        console.log(item)
    };

    const normFile = (e) => {
        if (e.fileList && e.fileList[0] && e.fileList[0].thumbUrl) {
            //console.log('Upload event:', e.fileList[0].thumbUrl);
            setUrl(e.fileList[0].thumbUrl)
        } else {
            setUrl("")
        }
      
        if (Array.isArray(e)) {
          return e;
        }
      
        return e && e.fileList;
      };

    if (isCreateLoading) {
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
                    <Form.Item
                        name="upload"
                        label="Upload"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                    >
                        <Upload name="logo" listType="picture">
                            <Button icon={<UploadOutlined />}>Click to upload</Button>
                        </Upload>
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