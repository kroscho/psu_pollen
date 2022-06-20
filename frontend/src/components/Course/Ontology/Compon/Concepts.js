import React, { useContext, useEffect, useState } from "react";
import 'antd/dist/antd.css';
import { Button, Form, Input, Select  } from "antd";
import TestingApi from "../../../../API/TestingApi";
import Loader from "../../../UI/Loader/Loader";
import CreateSubjectArea from "../../ModalForms/CreateNewSubjectArea";
import { isAdmin } from "../../../utils/testing";
import { UserOutlined } from '@ant-design/icons';
import CreateTerm from "../../ModalForms/CreateNewTerm";
import ListTerms from "./ListTerms";
import { Context } from "../../../..";
import EditTerm from "../../ModalForms/EditTerm";

const Concepts = ({updatePage}) => {
    const {userStore} = useContext(Context)
    const [subAreas, setSubAreas] = useState([])
    const [curSubjectArea, setCursubjectArea] = useState("")
    const [curTerms, setCurTerms] = useState([])
    const [isVisibleCreateSubjectAreaForm, setIsVisibleCreateSubjectAreaForm] = useState(false)
    const [isVisibleCreateTermForm, setIsVisibleCreateTermForm] = useState(false)
    const [update, setOnUpdate] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterTerms, setFilterTerms] = useState([])
    const curCourse = userStore.CurCourse;
    const user = userStore.User;
    const [form] = Form.useForm();

    const fetchSubjectAreas = async () => {
        setIsLoading(true)
        const subjArea = curSubjectArea
        let response1 = await TestingApi.getSubjectAreas();
        setSubAreas(response1.data)
        onChangeSubjArea(subjArea, response1.data)
        setIsLoading(false)
    }

    useEffect(() => {  
        console.log("EFFECT CONCEPTS")
        fetchSubjectAreas()
    }, [update, updatePage])

    const onUpdate = () => {
        setOnUpdate(!update)
    }

    const onFinish = values => {
        console.log('Received values of form:', values);
    };

    const handleAddSubjectArea = () => {
        setIsVisibleCreateSubjectAreaForm(true)
    }

    const handleAddTerm = () => {
        setIsVisibleCreateTermForm(true)
    }

    const onChangeSubjArea = (subjArea, areas) => {
        if (subjArea !== "") {
            setCursubjectArea(subjArea)
            const terms = areas.filter((item) => item.subjectAreaObj === subjArea)
            setCurTerms(terms[0].terms)
            setFilterTerms(terms[0].terms)
        }
    }

    const listSubjectAreas = subAreas.map((item) => {
        return {value: item.subjectAreaObj, label: item.subjectArea}
    })

    const onChangeTerm = (e) => {
        setSearchTerm(e.target.value)
        setFilterTerms(curTerms.filter(term => term.termStr.toLowerCase().indexOf(e.target.value.toLowerCase()) != -1))
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
                label="Предметная область"
                style={{ margin: '10px auto'}}
                >
                    <Select
                    showSearch
                    style={{width: 200,}}
                    placeholder="Искать предметную область"
                    optionFilterProp="children"
                    filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
                    filterSort={(optionA, optionB) =>
                        optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                    }
                    options={listSubjectAreas}
                    defaultValue={curSubjectArea}
                    onChange={(e) => onChangeSubjArea(e, subAreas)}
                    >
                    </Select>
                    { isAdmin(user)
                        ?   <Button 
                            style={{verticalAlign: "bottom", marginLeft: "20px"}} 
                            variant="outline-success"
                            onClick={handleAddSubjectArea}
                            >
                                Добавить предметную область
                            </Button>
                        :   null
                    }
                </Form.Item>
                { curSubjectArea !== ""
                    ? <Form.Item
                        label="Концепты"
                        name="terms"
                        style={{ margin: '20px auto'}} 
                       >
                            <Input
                                placeholder="Введите название концепта"
                                prefix={<UserOutlined className="site-form-item-icon" />}
                                value={searchTerm}
                                style={{ width: '50%'}} 
                                onChange={onChangeTerm}
                            />
                            <ListTerms onUpdate={onUpdate} subjectArea={curSubjectArea} terms={filterTerms}></ListTerms>
                            { isAdmin(user)
                                ?   <Button 
                                    style={{verticalAlign: "bottom", marginTop: "20px"}} 
                                    variant="outline-success"
                                    onClick={handleAddTerm}
                                    >
                                        Добавить концепт
                                    </Button>
                                :   null
                            }    
                     </Form.Item>
                    : null
                }
                <CreateTerm isVisible={isVisibleCreateTermForm} setIsVisible={setIsVisibleCreateTermForm} subjectArea={curSubjectArea} onUpdate={onUpdate}></CreateTerm>  
                <CreateSubjectArea isVisible={isVisibleCreateSubjectAreaForm} setIsVisible={setIsVisibleCreateSubjectAreaForm} onUpdate={onUpdate}></CreateSubjectArea>
            </Form>
        )
    }
}

export default Concepts;