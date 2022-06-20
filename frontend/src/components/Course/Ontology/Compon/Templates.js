import React, { useContext, useEffect, useState } from "react";
import 'antd/dist/antd.css';
import { Button, Form, Input, Select  } from "antd";
import TestingApi from "../../../../API/TestingApi";
import Loader from "../../../UI/Loader/Loader";
import { isAdmin } from "../../../utils/testing";
import { UserOutlined } from '@ant-design/icons';
import ListTerms from "./ListTerms";
import { Context } from "../../../..";
import CreateTemplate from "../../ModalForms/CreateNewTemplate";
import ListTemplates from "./ListTemplates";

const Templates = ({updatePage}) => {
    const {userStore} = useContext(Context)
    const [templates, setTemplates] = useState([])
    const [searchTemplate, setSearchTemplate] = useState("")
    const [isVisibleCreateTemplateForm, setIsVisibleCreateTemplateForm] = useState(false)
    const [update, setOnUpdate] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [filterTemplates, setFilterTemplates] = useState([])
    const curCourse = userStore.CurCourse;
    const user = userStore.User;
    const [form] = Form.useForm();

    const fetchTemplates = async () => {
        setIsLoading(true)
        let response = await TestingApi.getTemplates();
        setTemplates(response.data)
        setFilterTemplates(response.data)
        //console.log(response.data)
        setIsLoading(false)
    }

    useEffect(() => {  
        fetchTemplates()
    }, [update, updatePage])

    const onUpdate = () => {
        setOnUpdate(!update)
    }

    const onFinish = values => {
        console.log('Received values of form:', values);
    };

    const handleAddTemplate = () => {
        setIsVisibleCreateTemplateForm(true)
    }

    const onChangeTemplate = (e) => {
        setSearchTemplate(e.target.value)
        setFilterTemplates(templates.filter(template => (template.tempName + " | " +  template.tempTitle).toLowerCase().indexOf(e.target.value.toLowerCase()) != -1))
    }

    if (isLoading) {
        return <Loader></Loader>
    } else {
        return (
            <Form 
            form={form} 
            name="dynamic_form_nest_item" 
            onFinish={onFinish} 
            autoComplete="off"
            >
                <Form.Item
                label="Шаблоны"
                name="templates"
                style={{ margin: '20px auto'}} 
                >
                    <Input
                        placeholder="Поиск шаблона"
                        prefix={<UserOutlined className="site-form-item-icon" />}
                        value={searchTemplate}
                        style={{ width: '50%'}} 
                        onChange={onChangeTemplate}
                    />
                    <ListTemplates onUpdate={onUpdate} templates={filterTemplates}></ListTemplates>
                    { isAdmin(user)
                        ?   <Button 
                            style={{verticalAlign: "bottom", marginTop: "20px"}} 
                            variant="outline-success"
                            onClick={handleAddTemplate}
                            >
                                Добавить шаблон
                            </Button>
                        :   null
                    }    
                </Form.Item>
                <CreateTemplate isVisible={isVisibleCreateTemplateForm} setIsVisible={setIsVisibleCreateTemplateForm} onUpdate={onUpdate}></CreateTemplate> 
            </Form>
        )
    }
}

export default Templates;