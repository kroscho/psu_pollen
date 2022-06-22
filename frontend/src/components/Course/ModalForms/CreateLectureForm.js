import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import { Modal, Button, Form, Select, message } from 'antd';
import axios from "axios";
import TestingApi from '../../../API/TestingApi';
import { getLocalStorage } from '../../utils/testing';
import { CUR_MODULE_STORAGE } from '../../../utils/consts';

const { Option } = Select;

const CreateLectureForm = ({isVisible, setIsVisible, onUpdate}) => {
    const [isLoading, setIsLoading] = useState(false)
    const [terms, setTerms] = useState([])
    const [selectedTerms, setSelectedTerms] = useState([])
    const [files, setFiles] = useState(null)
    const [form] = Form.useForm();

    const curModule = getLocalStorage(CUR_MODULE_STORAGE)

    const fetchTerms = async () => {
        setIsLoading(true)
        try {
            let response = await TestingApi.getTermsBySubjArea(curModule.subjectArea);
            setTerms(response.data)
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

    const fetchCreateLecture = async () => {
        setIsLoading(true)
        let err1 = false
        if (files) {
            for (const [key, element] of Object.entries(files)) {
                let formData = new FormData();
                formData.append("file", element);
                formData.append("name", "Name");
                const url ="http://localhost:5000/api/upload_files/" + curModule.moduleObj + "/" + selectedTerms
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

    const onFinish = values => {
        console.log('Received values of form:', values);
    };

    const handleFile = (e) => {
        let files = e.target.files;
        setFiles(files)
    }

    const handleChange = (value) => {
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

export default CreateLectureForm;