import React, { useContext, useEffect, useState } from "react";
import 'antd/dist/antd.css';
import { Divider, message } from "antd";
import { Context } from "../../..";
import {Row, Col, ListGroup, Button} from "react-bootstrap"
import { isAdmin } from "../../utils/testing";
import { FormOutlined } from '@ant-design/icons';
import CreateModule from "../ModalForms/CreateModule";
import CreateLectureForm from "../ModalForms/CreateLectureForm";
import TestingApi from "../../../API/TestingApi";
import { useFetching } from "../../hooks/useFetching";
import Loader from "../../UI/Loader/Loader";

const CourseLections = () => {
    const {userStore} = useContext(Context)
    const curCourse = userStore.CurCourse;
    const [dataFile, setDataFile] = useState("")
    const [curModule, setCurModule] = useState(userStore.CurModule)
    const [isLoading, setIsLoading] = useState(false)
    const [update, setUpdate] = useState(true)
    const user = userStore.User;

    const [isCreateLectureFormVisible, setIsCreateLectureFormVisible] = useState(false)
    const [isCreateModuleFormVisible, setIsCreateModuleFormVisible] = useState(false)

    let listLectures = []
    let listModules = []

    const [fetchCourseInfo, isDataLoading, dataError] = useFetching(async () => {
        setIsLoading(true)
        let response = await TestingApi.getCourseInfo(userStore.CurCourse.courseObj);
        userStore.setCurCourse(response.data)
        //console.log(response.data)
        setIsLoading(false)
    })

    const fetchDeleteLecture = async (lecture, module) => {
        setIsLoading(true)
        const item = {lectureObj: lecture.lectureObj, moduleObj: module.moduleObj}
        let response = await TestingApi.DeleteLecture(item);
        if (response.data === "ok") {
            message.success('Материал удален успешно');
        }
        onUpdate()
        setIsLoading(false)
    }

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

    useEffect(() => {
        fetchCourseInfo()
    }, [update])

    const onUpdate = () => {
        setUpdate(!update)
    }

    const downloadEmployeeData = (lecture) => {
        //console.log(lecture)
        const url = 'https://psu-pollen.herokuapp.com/api/dowload_file/' + lecture.lectureName 
        fetch(url)
            .then(response => {
                //console.log(response)
                response.blob().then(blob => {
                    let url = window.URL.createObjectURL(blob);
                    let a = document.createElement('a');
                    a.href = url;
                    a.download = lecture.lectureName;
                    a.click();
                });
                //window.location.href = response.url;
        });
    }

    const handleDeleteModule = (module) => {
        userStore.setCurModule(module);
        fetchDeleteModule()
    }

    const handleCreateLecture = (module) => {
        //console.log(module)
        setCurModule(module)
        userStore.setCurModule(module);
        setIsCreateLectureFormVisible(true)
    }

    const handleCreateModule = () => {
        setIsCreateModuleFormVisible(true)
    }

    if (curCourse.modules) {
        listLectures = (module) => {
            return module.lectures.map((lecture, index) => {
                return (
                    <ListGroup.Item 
                    className="d-flex justify-content-between align-items-start"
                    style={{color: '#6287ab'}}
                    key={lecture.lectureObj}
                    >
                        <div 
                        className="ms-2 me-auto" 
                        > 
                            <FormOutlined/> {lecture.lectureName}
                        </div>
                        <Button 
                        style={{verticalAlign: "bottom", lineHeight: "0.7", marginLeft: '30px'}} 
                        variant="outline-success"
                        onClick={() => downloadEmployeeData(lecture)}
                        >
                            Скачать файл
                        </Button>
                        { isAdmin(user)
                        ?   <Button 
                            style={{verticalAlign: "bottom", lineHeight: "0.7", marginLeft: '15px'}} 
                            variant="outline-danger"
                            onClick={() => fetchDeleteLecture(lecture, module)}
                            >
                                Удалить материал
                            </Button>
                        : null
                    }
                    </ListGroup.Item>
                )
            })
        }

        listModules = curCourse.modules.map((item, index) => {
            return (
                <ListGroup.Item 
                    as="li"
                    className="d-flex justify-content-between align-items-start"
                    style={{color: '#6287ab'}}
                    key={item.moduleObj}
                >
                    <div className="ms-2 me-auto">
                        <Divider style={{color: 'rgb(24 144 255)', fontSize: '20px'}} orientation="left">{item.nameModule}</Divider>
                        <ListGroup>
                            {listLectures(item)}
                        </ListGroup>
                    </div>
                    { isAdmin(user)
                        ?   <Button 
                            style={{verticalAlign: "bottom"}} 
                            variant="outline-success"
                            onClick={() => handleCreateLecture(item)}
                            >
                                Добавить материал
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
                    <CreateLectureForm isVisible={isCreateLectureFormVisible} setIsVisible={setIsCreateLectureFormVisible} module={curModule} onUpdate={onUpdate}></CreateLectureForm>                
                </ListGroup.Item>
            )
        })
    }

    if (isLoading) {
        return <Loader/>
    } else {
        return (
            <>
                <Row>
                    <Col xs={10}>
                        <Divider 
                            style={{color: 'rgb(76 86 96)', fontSize: '24px'}}
                            orientation="left"
                        >
                            Материалы
                        </Divider>
                        <ListGroup>
                            {listModules}
                        </ListGroup>
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
                </Row>
                <Row>
                    <Col xs={9}>
                        {dataFile}
                    </Col>
                </Row>
            </>
        )
    } 
}

export default CourseLections;