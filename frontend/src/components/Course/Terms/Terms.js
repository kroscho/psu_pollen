import React, { useEffect, useState } from "react";
import 'antd/dist/antd.css';
import { Collapse, Divider, List, message  } from "antd";
import {Row, Col, Button } from "react-bootstrap"
import { FormOutlined } from '@ant-design/icons';
import TestingApi from "../../../API/TestingApi";
import Loader from "../../UI/Loader/Loader";
import ErrorMessage from "../../UI/Messages/ErrorMessage";
import { getLocalStorage } from "../../utils/testing";
import { USER_STORAGE } from "../../../utils/consts";
const { Panel } = Collapse;

const TermsPage = () => {
    const [subAreas, setSubAreas] = useState([])
    const [terms, setTerms] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    
    const user = getLocalStorage(USER_STORAGE);

    const fetchTermsByUser = async () => {
        setIsLoading(true)
        try {
            let response = await TestingApi.getTermsByUser(user.userObj, user.uid);
            setTerms(response.data)
            let response1 = await TestingApi.getSubjectAreas();
            setSubAreas(response1.data)
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
        fetchTermsByUser()
    }, [])

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

    const listLectures = (term, index) => {
        return (
            <Collapse accordion style={{width: '50%', marginLeft: '30px'}}>
                <Panel header="Рекомендации к прочтению:" key={index}>
                <List
                    size="small"
                    bordered
                    itemLayout="horizontal"
                    dataSource={terms.lectures[term.termObj]}
                    renderItem={(lecture, index) => {
                        return (
                            <List.Item 
                            className="d-flex justify-content-between align-items-start"
                            style={{color: '#6287ab'}}
                            key={index}
                            >
                                <div 
                                className="ms-2 me-auto" 
                                key={lecture.lectureObj} 
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
                            </List.Item>
                        )
                    }}
                />
                </Panel>
            </Collapse>
        )
    }

    const listKnownTerms = (knownTerms) => {
        return (
            <List
            size="small"
            bordered
            style={{borderColor: 'green'}}
            dataSource={knownTerms}
            renderItem={(term, index) => {
                return (
                    <List.Item 
                    style={{color: 'rgba(0, 0, 0, 0.65)', display: 'flex', justifyContent: 'between', alignItems: 'center'}}
                    key={index}
                    >
                        <div 
                        style={{fontWeight: '700', marginLeft: '2', marginRight: 'auto'}}
                        key={term.termObj} 
                        > 
                            {term.term}
                        </div>
                        <div
                        style={{fontWeight: '700', color: 'green'}}
                        >
                            {term.sumCorrect} / {term.sumCount}
                        </div>
                    </List.Item>
                )                    
            }}
            />
        )
    }

    const listUnknownTerms = (unknownTerms) => {
        return (
            <List
            size="small"
            bordered
            itemLayout="horizontal"
            style={{borderColor: 'red'}}
            dataSource={unknownTerms}
            renderItem={(term, index) => {
                return (
                    <>
                        <List.Item 
                        style={{color: 'rgba(0, 0, 0, 0.65)', display: 'flex', justifyContent: 'between', alignItems: 'center'}}
                        key={index}
                        >
                            <div 
                            style={{fontWeight: '700', marginLeft: '2', marginRight: 'auto'}}
                            key={term.termObj} 
                            > 
                                {term.term}
                            </div>
                            <div
                            style={{fontWeight: '700', color: 'red'}}
                            >
                                {term.sumCorrect} / {term.sumCount}
                            </div>
                            { terms.lectures[term.termObj].length != 0
                                ?   listLectures(term, index)
                                :   null
                            }
                        </List.Item>
                    </>
                )                    
            }}
        />
        )
    }

    const listSubjAreas = subAreas.map((subjArea, ind) => {
        const knownTerms = terms.knownTerms.filter(item => item.subjectArea === subjArea.subjectAreaObj)
        const unknownTerms = terms.unknownTerms.filter(item => item.subjectArea === subjArea.subjectAreaObj)

        let header = subjArea.subjectArea
        if (terms.sumScoresLite[subjArea.subjectAreaObj]) {
            header = subjArea.subjectArea + " " + terms.sumScoresLite[subjArea.subjectAreaObj].sumCorrect + "/" + terms.sumScoresLite[subjArea.subjectAreaObj].sumCount
        }

        return (
            <Panel header={header} key={ind}>
                <Divider orientation="left">Плохо изучены:</Divider>
                {listUnknownTerms(unknownTerms)}
                <Divider orientation="left">Хорошо изучены:</Divider>
                {listKnownTerms(knownTerms)}
            </Panel>
        )
    })

    const View = () => {
        return (
            <>
                <Row>
                    <Col>
                        <Divider style={{color: 'rgb(24 144 255)', fontSize: '20px'}} orientation="left">Концепты:</Divider>
                        <Collapse accordion>
                            {listSubjAreas}
                        </Collapse>
                    </Col>
                </Row>
            </>
        )
    }

    const spinner = isLoading ? <Loader/> : null;
    //const errorMessage = dataError ? <ErrorMessage message={dataError} /> : null;
    const content = !(isLoading) ? <View/> : null;

    return (
        <>
            {spinner}
            {content}
        </>
    )
}

export default TermsPage;