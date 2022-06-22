import React, { useEffect, useState } from "react";
import 'antd/dist/antd.css';
import { Divider, message } from "antd";
import {Row, Col, ListGroup, Button} from "react-bootstrap"
import { getLocalStorage, isAdmin, setLocalStorage } from "../../utils/testing";
import { FormOutlined } from '@ant-design/icons';
import CreateModule from "../ModalForms/CreateModule";
import CreateLectureForm from "../ModalForms/CreateLectureForm";
import TestingApi from "../../../API/TestingApi";
import Loader from "../../UI/Loader/Loader";
import { CUR_COURSE_STORAGE, CUR_MODULE_STORAGE, USER_STORAGE } from "../../../utils/consts";

const CourseLections = () => {
    const [dataFile, setDataFile] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [update, setUpdate] = useState(true)
    
    const user = getLocalStorage(USER_STORAGE);
    const curCourse = getLocalStorage(CUR_COURSE_STORAGE)

    const [isCreateLectureFormVisible, setIsCreateLectureFormVisible] = useState(false)
    const [isCreateModuleFormVisible, setIsCreateModuleFormVisible] = useState(false)

    let listLectures = []
    let listModules = []

    const fetchCourseInfo = async () => {
        setIsLoading(true)
        try {
            let response = await TestingApi.getCourseInfo(curCourse.courseObj);
            setLocalStorage(CUR_COURSE_STORAGE, response.data)
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

    const fetchDeleteLecture = async (lecture, module) => {
        setIsLoading(true)
        try {
            const item = {lectureObj: lecture.lectureObj, moduleObj: module.moduleObj}
            let response = await TestingApi.DeleteLecture(item);
            if (response.data === "ok") {
                message.success('Материал удален успешно');
            }
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

    useEffect(() => {
        fetchCourseInfo()
    }, [update])

    const onUpdate = () => {
        setUpdate(!update)
    }

    const downloadEmployeeData = (lecture) => {
        const url = 'https://psu-pollen.herokuapp.com/api/dowload_file/' + lecture.lectureName 
        fetch(url)
            .then(response => {
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
        fetchDeleteModule(module)
    }

    const handleCreateLecture = (module) => {
        setLocalStorage(CUR_MODULE_STORAGE, module)
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

        listModules = curCourse.modules.map((item) => {
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
                    <CreateLectureForm isVisible={isCreateLectureFormVisible} setIsVisible={setIsCreateLectureFormVisible} onUpdate={onUpdate}></CreateLectureForm>                
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