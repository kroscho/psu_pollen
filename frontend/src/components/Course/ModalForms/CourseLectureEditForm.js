import React, { useContext, useState } from 'react';
import 'antd/dist/antd.css';
import { Modal, Button, Form, Input, Upload } from 'antd';
import Icon, { UploadOutlined } from '@ant-design/icons';
import { Context } from '../../..';

const CourseLectureEditForm = ({isVisible, setIsVisible}) => {
    const {userStore} = useContext(Context)
    const curLecture = userStore.CurLecture;
    const [url, setUrl] = useState("")

    const handleOk = () => {
        setIsVisible(false);
    };

    const handleCancel = () => {
        setIsVisible(false);
    };

    const [form] = Form.useForm();

    const onFinish = values => {
        console.log('Received values of form:', values);
        const item = {
            id: curLecture.id,
            title: values.nameLecture,
            materials : curLecture.materials.concat(values.upload),
        }
        userStore.setCurLecture(item)
        userStore.setLectures(item)
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

    return (
        <>
        <Modal title="Создание лекции" visible={isVisible} onOk={handleOk} onCancel={handleCancel}>
            <Form 
                form={form} 
                name="dynamic_form_nest_item" 
                onFinish={onFinish} 
                autoComplete="off"
                initialValues={{
                    ["nameLecture"]: curLecture.title,
                }}
            >
                <Form.Item name="nameLecture" label="Название лекции" rules={[{ required: true, message: 'Не заполнено название лекции' }]}>
                    <Input />
                </Form.Item>
                <Form.Item
                    name="upload"
                    label="Upload"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                >
                    <Upload
                        accept=".txt, .csv, .docx"
                        showUploadList={false}
                        beforeUpload={(file, fileList) => {
                            // Access file content here and do something with it
                            console.log(file);

                            // Prevent upload
                            return false;
                        }}
                    >
                        <Button>
                            <Icon type="upload" /> Загрузить файл
                        </Button>
                    </Upload>
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
};

export default CourseLectureEditForm;