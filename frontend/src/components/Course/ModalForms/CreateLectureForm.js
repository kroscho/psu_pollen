import React, { useContext, useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import { Modal, Button, Form, Select, message } from 'antd';
import axios from "axios";
import { Context } from '../../..';
import Loader from '../../UI/Loader/Loader';
import { useFetching } from '../../hooks/useFetching';
import TestingApi from '../../../API/TestingApi';

const { Option } = Select;

const CreateLectureForm = ({isVisible, setIsVisible, onUpdate}) => {
    const {userStore} = useContext(Context)
    const [isLoading, setIsLoading] = useState(false)
    const [terms, setTerms] = useState([])
    const [selectedTerms, setSelectedTerms] = useState([])
    const [files, setFiles] = useState(null)

    const [fetchTerms, isTermsLoading, termsError] = useFetching(async () => {
        setIsLoading(true)
        console.log(userStore.CurModule)
        let response = await TestingApi.getTermsBySubjArea(userStore.CurModule.subjectArea);
        setTerms(response.data)
        console.log(response.data)
        setIsLoading(false)
    })

    const fetchCreateLecture = async () => {
        setIsLoading(true)
        let err1 = false
        if (files) {
            for (const [key, element] of Object.entries(files)) {
                let formData = new FormData();
                formData.append("file", element);
                formData.append("name", "Name");
                const url ="http://localhost:5000/api/upload_files/" + userStore.CurModule.moduleObj + "/" + selectedTerms
                axios({
                    url: url,
                    method: "POST",
                    headers: {},
                    data: formData,
                })
                .then((res) => console.log(res))
                .catch((err) => err1 = true);
            };
            if (err1) message.warning("ошибка")
            else message.success("успешно")
        } else {
            message.warning('Выберите файл');
        }
        setIsVisible(false);
        setIsLoading(false);
        onUpdate()
    }

    useEffect(() => {
        if (isVisible) {
            fetchTerms()
        }
    }, [isVisible])

    const handleCancel = () => {
        setIsVisible(false);
    };

    const [form] = Form.useForm();

    const onFinish = values => {
        console.log('Received values of form:', values);
    };

    const handleFile = (e) => {
        let files = e.target.files;
        setFiles(files)
    }

    const handleChange = (value) => {
        console.log(`selected ${value}`);
        setSelectedTerms(value)
    };

    const listTerms = terms.map((item) => {
        return <Option key={item.term}>{item.termStr}</Option>
    })

    if (isLoading) {
        return null
    } else {
        return (
            <>
            <Modal 
            title="Создание лекции" 
            visible={isVisible}  
            onCancel={handleCancel}
            footer={[
                <Button key="back" onClick={handleCancel}>
                  Отмена
                </Button>
              ]}    
            >
                <Form form={form} name="dynamic_form_nest_item" onFinish={onFinish} layout='vertical' autoComplete="off">
                    <Form.Item
                        name="upload"
                        label="Загрузить файл/файлы"
                    >
                        <div>
                            <input
                            type="file"
                            multiple="multiple"
                            onChange={(e) => handleFile(e)}
                            />
                        </div>
                    </Form.Item>
                    <Form.Item
                        name="terms"
                        label="Выберите концепты, связанные с лекцией"
                    >
                        <Select
                        mode="multiple"
                        allowClear
                        style={{
                            width: '100%',
                        }}
                        placeholder="Please select"
                        onChange={handleChange}
                        >
                        {listTerms}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button onClick={fetchCreateLecture}>
                        Добавить
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            </>
        );
    };
    }

    /*
    return (
            <Modal 
            title="Создание лекции" 
            visible={isVisible}  
            onCancel={handleCancel}
            footer={[
                <Button key="back" onClick={handleCancel}>
                    Отмена
                </Button>
                ]}    
            >
                <Form form={form} name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off">
                    <Form.Item name="nameLecture" label="Название лекции" rules={[{ required: true, message: 'Не заполнено название лекции' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                        Добавить
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        );
};*/

export default CreateLectureForm;