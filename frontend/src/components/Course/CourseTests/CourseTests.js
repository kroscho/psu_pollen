import React, { useEffect, useState } from "react";
import 'antd/dist/antd.css';
import { Divider, message } from "antd";
import {Row, Col, ListGroup, Button} from "react-bootstrap"
import history from "../../../services/history";
import { COURSE_TESTS_TEST_VARIANTS_ROUTE, CUR_COURSE_STORAGE, CUR_MODULE_STORAGE, CUR_TEST_STORAGE, USER_STORAGE } from "../../../utils/consts";
import { getLocalStorage, isAdmin, setLocalStorage } from "../../utils/testing";
import { FormOutlined } from '@ant-design/icons';
import CreateTestForm from "../ModalForms/CreateTestModule";
import CreateModule from "../ModalForms/CreateModule";
import TestingApi from "../../../API/TestingApi";
import Loader from "../../UI/Loader/Loader";
import ModuleEdit from "../ModalForms/EditModule";

const CourseTests = () => {
    const [curCourse, setCurCourse] = useState(getLocalStorage(CUR_COURSE_STORAGE));
    const [isLoading, setIsLoading] = useState(false)
    
    const user = getLocalStorage(USER_STORAGE)

    const [isCreateTestFormVisible, setIsCreateTestFormVisible] = useState(false)
    const [isCreateModuleFormVisible, setIsCreateModuleFormVisible] = useState(false)
    const [isEditModuleFormVisible, setIsEditModuleFormVisible] = useState(false)

    let listTests = []
    let listModules = []

    const fetchDeleteModule = async (module) => {
        setIsLoading(true)
        try {
            const item = {moduleObj: module.moduleObj, courseObj: curCourse.courseObj}
            let response = await TestingApi.deleteModule(item);
            if (response.data === "ok") {
                message.success('Модуль удален успешно');
            }
            let response1 = await TestingApi.getCourseInfo(curCourse.courseObj);
            setLocalStorage(CUR_COURSE_STORAGE, response1.data)
            setCurCourse(response1.data)
            onUpdate()
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

    const onUpdate = () => {
        setCurCourse(getLocalStorage(CUR_COURSE_STORAGE))
    }

    useEffect(() => {
        console.log("update")
        //onUpdate()
    }, [curCourse])

    const handleTest = (module, test) => {
        setLocalStorage(CUR_MODULE_STORAGE, module)
        setLocalStorage(CUR_TEST_STORAGE, test)
        history.push(COURSE_TESTS_TEST_VARIANTS_ROUTE);
    }

    const handleCreateTest = (module) => {
        setLocalStorage(CUR_MODULE_STORAGE, module)
        setIsCreateTestFormVisible(true)
    }

    const handleCreateModule = () => {
        setIsCreateModuleFormVisible(true)
    }

    const handleDeleteModule = (module) => {
        fetchDeleteModule(module)
    }

    const handleEditModule = (module) => {
        setLocalStorage(CUR_MODULE_STORAGE, module)
        setIsEditModuleFormVisible(true)
    }

    if (curCourse.modules) {
        listTests = (module) => {
            return module.tests.map((test, index) => {
                return (
                    <div  
                        key={index} 
                        style={{cursor: 'pointer', verticalAlign: 'baseline', marginTop: '15px'}} 
                        onClick={() => handleTest(module, test)}
                    > 
                        <FormOutlined/> {test.testName}
                    </div>
                )
            })
        }

        listModules = curCourse.modules.map((item, index) => {
            return (
                <ListGroup.Item 
                    as="li"
                    className="d-flex justify-content-between align-items-start"
                    style={{color: '#6287ab'}}
                    key={index}
                >
                    <div className="ms-2 me-auto">
                        <Divider style={{color: 'rgb(24 144 255)', fontSize: '20px'}} orientation="left">{item.nameModule}</Divider>
                        {listTests(item)}
                    </div>
                    { isAdmin(user)
                        ?   <Button 
                            style={{verticalAlign: "bottom"}} 
                            variant="outline-success"
                            onClick={() => handleCreateTest(item)}
                            >
                                Создать тест
                            </Button>
                        : null
                    }
                    { isAdmin(user)
                        ?   <Button 
                            style={{verticalAlign: "bottom", marginLeft: '10px'}} 
                            variant="outline-secondary"
                            onClick={() => handleEditModule(item)}
                            >
                                Редактировать модуль
                            </Button>
                        : null
                    }
                    { isAdmin(user)
                        ?   <Button 
                            style={{verticalAlign: "bottom", marginLeft: '10px'}} 
                            variant="outline-danger"
                            onClick={() => handleDeleteModule(item)}
                            >
                                Удалить модуль
                            </Button>
                        : null
                    }
                    <CreateTestForm isVisible={isCreateTestFormVisible} setIsVisible={setIsCreateTestFormVisible} onUpdate={onUpdate}></CreateTestForm>                
                </ListGroup.Item>
            )
        })
    }

    const View = () => {
        if (curCourse.modules) {
            return (
                <Row>
                    <Col xs={10}>
                        <Divider 
                            style={{color: 'rgb(76 86 96)', fontSize: '24px'}}
                            orientation="left"
                        >
                            { (curCourse.modules[0] && curCourse.modules[0].tests && curCourse.modules[0].tests.length !== 0)
                                ? "Тесты:"
                                : "Тестов нет"
                            }
                        </Divider>
                        {listModules}
                        { isAdmin(user)
                            ?   <Button 
                                style={{verticalAlign: "bottom", marginTop: "20px"}} 
                                variant="outline-success"
                                onClick={handleCreateModule}
                                >
                                    Добавить модуль
                                </Button>
                            : null
                        }   
                    </Col>
                    <CreateModule isVisible={isCreateModuleFormVisible} setIsVisible={setIsCreateModuleFormVisible} onUpdate={onUpdate}></CreateModule>
                    <ModuleEdit isVisible={isEditModuleFormVisible} setIsVisible={setIsEditModuleFormVisible} onUpdate={onUpdate}></ModuleEdit>
                </Row>
            )
        } 
        else {
            return (
                <Divider orientation="center">Выберите курс</Divider>
            )
        }
    }

    const spinner = isLoading ? <Loader/> : null;
    //const errorMessage = deleteError ? <ErrorMessage message={deleteError} /> : null;
    const content = !(isLoading) ? <View/> : null;

    return (
        <>
            {spinner}
            {content}
        </>
    )
}

export default CourseTests;