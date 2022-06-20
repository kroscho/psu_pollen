import React, { useContext, useState } from "react";
import 'antd/dist/antd.css';
import { Divider, Row, Col } from "antd";
import { Context } from "../../..";
import { Button} from "react-bootstrap"
import { isAdmin } from "../../utils/testing";
import { FileOutlined } from '@ant-design/icons';
import CourseLectureEditForm from "../ModalForms/CourseLectureEditForm";

const CourseLecture = () => {
    const {userStore} = useContext(Context)
    const curLecture = userStore.CurLecture;
    const user = userStore.User;

    const [isCreateLectureFormVisible, setIsCreateLectureFormVisible] = useState(false)

    let listMaterials = []

    const handleMaterial = (material) => {
        console.log(material)
    }

    const handleCreateLecture = () => {
        setIsCreateLectureFormVisible(true)
    }

    const handleDeleteMaterial = (item) => {
        console.log("delete: ", item)
    }

    if (curLecture.materials) {
        if (curLecture.materials.length === 0) {
            return (
                <div>
                    Материалов нет
                </div>
            )
        } else {
            listMaterials = curLecture.materials.map((material, index) => {
            return (
                <Row key={index}>
                    <Col 
                        xs={16} 
                        style={{cursor: 'pointer', fontWeight: 'bolder', color:'#7193c7', verticalAlign: 'baseline'}} 
                        onClick={() => handleMaterial(material)}
                    >
                        <FileOutlined /> {material.name} {material.uid}
                    </Col>
                    { isAdmin(user)
                        ? <Col xs={8}><Button onClick={() => handleDeleteMaterial(material)} style={{lineHeight: "0.5", marginLeft: "5px"}} variant="outline-danger">Удалить материал</Button></Col>
                        : null
                    }
                </Row>
            )
            })
        }
    }

    if (curLecture.materials) {
        return (
            <>
                <Row>
                    <Col xs={16}>
                        <Divider 
                            style={{color: 'rgb(76 86 96)', fontSize: '24px'}}
                            orientation="left"
                        >
                            {curLecture.title} Материалы:
                            { isAdmin(user)
                                ? <Button 
                                    onClick={() => handleCreateLecture()}
                                    style={{marginLeft: "150px"}} 
                                    variant="outline-success">Изменить название/Добавить новый материал
                                </Button>
                                : null
                            }
                        </Divider>
                    </Col>
                </Row>
                {listMaterials}
                <CourseLectureEditForm isVisible={isCreateLectureFormVisible} setIsVisible={setIsCreateLectureFormVisible}></CourseLectureEditForm>
            </>
        )
    } 
    else {
        return (
            <Divider orientation="center">Выберите курс</Divider>
        )
    }
}

export default CourseLecture;