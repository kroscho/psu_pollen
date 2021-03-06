import React, { useEffect, useState } from "react";
import 'antd/dist/antd.css';
import { Button, Form, Input, message, Select  } from "antd";
import TestingApi from "../../../../API/TestingApi";
import Loader from "../../../UI/Loader/Loader";
import CreateSubjectArea from "../../ModalForms/CreateNewSubjectArea";
import { getLocalStorage, isAdmin } from "../../../utils/testing";
import { UserOutlined } from '@ant-design/icons';
import CreateTerm from "../../ModalForms/CreateNewTerm";
import ListTerms from "./ListTerms";
import { CUR_COURSE_STORAGE, USER_STORAGE } from "../../../../utils/consts";

const Concepts = ({updatePage}) => {
    const [form] = Form.useForm();
    const [subAreas, setSubAreas] = useState([])
    const [curSubjectArea, setCursubjectArea] = useState("")
    const [curTerms, setCurTerms] = useState([])
    const [isVisibleCreateSubjectAreaForm, setIsVisibleCreateSubjectAreaForm] = useState(false)
    const [isVisibleCreateTermForm, setIsVisibleCreateTermForm] = useState(false)
    const [update, setOnUpdate] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterTerms, setFilterTerms] = useState([])
    
    const user = getLocalStorage(USER_STORAGE);

    const fetchSubjectAreas = async () => {
        setIsLoading(true)
        try {
            const subjArea = curSubjectArea
            let response1 = await TestingApi.getSubjectAreas();
            setSubAreas(response1.data)
            onChangeSubjArea(subjArea, response1.data)
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
                label="???????????????????? ??????????????"
                style={{ margin: '10px auto'}}
                >
                    <Select
                    showSearch
                    style={{width: 200,}}
                    placeholder="???????????? ???????????????????? ??????????????"
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
                                ???????????????? ???????????????????? ??????????????
                            </Button>
                        :   null
                    }
                </Form.Item>
                { curSubjectArea !== ""
                    ? <Form.Item
                        label="????????????????"
                        name="terms"
                        style={{ margin: '20px auto'}} 
                       >
                            <Input
                                placeholder="?????????????? ???????????????? ????????????????"
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
                                        ???????????????? ??????????????
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