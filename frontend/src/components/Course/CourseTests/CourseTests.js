import React, { useContext, useEffect, useState } from "react";
import 'antd/dist/antd.css';
import { Divider, message } from "antd";
import { Context } from "../../..";
import {Row, Col, ListGroup, Button} from "react-bootstrap"
import history from "../../../services/history";
import { COURSE_TESTS_TEST_VARIANTS_ROUTE } from "../../../utils/consts";
import { isAdmin } from "../../utils/testing";
import { FormOutlined } from '@ant-design/icons';
import CreateTestForm from "../ModalForms/CreateTestModule";
import CreateModule from "../ModalForms/CreateModule";
import TestingApi from "../../../API/TestingApi";
import { useFetching } from "../../hooks/useFetching";
import Loader from "../../UI/Loader/Loader";
import ErrorMessage from "../../UI/Messages/ErrorMessage";
import ModuleEdit from "../ModalForms/EditModule";

const CourseTests = () => {
    const {userStore} = useContext(Context)
    const [curCourse, setCurCourse] = useState(userStore.CurCourse);
    const [update, setUpdate] = useState(false);
    const user = userStore.User;

    const [isCreateTestFormVisible, setIsCreateTestFormVisible] = useState(false)
    const [isCreateModuleFormVisible, setIsCreateModuleFormVisible] = useState(false)
    const [isEditModuleFormVisible, setIsEditModuleFormVisible] = useState(false)

    let listTests = []
    let listModules = []

    const [fetchDeleteModule, isdeleteLoading, deleteError] = useFetching(async () => {
        const item = {moduleObj: userStore.CurModule.moduleObj, courseObj: userStore.CurCourse.courseObj}
        let response = await TestingApi.deleteModule(item);
        if (response.data === "ok") {
            message.success('Модуль удален успешно');
        }
        let response1 = await TestingApi.getCourseInfo(userStore.CurCourse.courseObj);
        userStore.setCurCourse(response1.data)
        onUpdate()
        //console.log(response.data)
    })

    const onUpdate = () => {
        setCurCourse(userStore.CurCourse)
    }

    useEffect(() => {
        //console.log("update")
        onUpdate()
    }, [curCourse])

    const handleTest = (module, test) => {
        userStore.setCurModule(module);
        userStore.setCurTest(test);
        history.push(COURSE_TESTS_TEST_VARIANTS_ROUTE);
    }

    const handleCreateTest = (module) => {
        userStore.setCurModule(module);
        setIsCreateTestFormVisible(true)
    }

    const handleCreateModule = () => {
        setIsCreateModuleFormVisible(true)
    }

    const handleDeleteModule = (module) => {
        userStore.setCurModule(module);
        fetchDeleteModule()
    }

    const handleEditModule = (module) => {
        userStore.setCurModule(module);
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
                    <CreateTestForm isVisible={isCreateTestFormVisible} setIsVisible={setIsCreateTestFormVisible} module={item} onUpdate={onUpdate}></CreateTestForm>                
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

    const spinner = isdeleteLoading ? <Loader/> : null;
    const errorMessage = deleteError ? <ErrorMessage message={deleteError} /> : null;
    const content = !(isdeleteLoading || deleteError) ? <View/> : null;

    return (
        <>
            {spinner}
            {errorMessage}
            {content}
        </>
    )
}

export default CourseTests;