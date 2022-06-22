import React, { useEffect, useState } from "react";
import 'antd/dist/antd.css';
import { Col, Divider, Form, Input, message, Row } from "antd";
import TestingApi from "../../../API/TestingApi";
import UsersList from "../Users/UsersList";
import Loader from "../../UI/Loader/Loader";
import { UserOutlined } from '@ant-design/icons';
import AttemptsDetails from "../AttemptsDetails/AttemptsDetails";
import { getLocalStorage, setLocalStorage } from "../../utils/testing";
import { CUR_ATTEMPTS_STORAGE, CUR_TEST_STORAGE } from "../../../utils/consts";

const CheckWorks = () => {
    const [usersAttempts, setUsersAttempts] = useState([])
    const [filterUsers, setFilterUsers] = useState([])
    const [searchUser, setSearchUser] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [update, setUpdate] = useState(false)

    const curTest = getLocalStorage(CUR_TEST_STORAGE)

    const fetchUsersWhoPassedTheTest = async () => {
        setIsLoading(true)
        try {
            let response = await TestingApi.getUsersWhoPassedTheTest(curTest);
            setUsersAttempts(response.data)
            setFilterUsers(response.data)
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
        //setLocalStorage(CUR_ATTEMPTS_STORAGE, [])
        fetchUsersWhoPassedTheTest()
    }, [update])

    const onUpdate = () => {
        setUpdate(!update)
    }

    const handleCheckAttempts = (user) => {
        setLocalStorage(CUR_ATTEMPTS_STORAGE, user.attempts)
    }

    const onChange = (e) => {
        setSearchUser(e.target.value)
        setFilterUsers(usersAttempts.filter(user => user.fullName.toLowerCase().indexOf(e.target.value.toLowerCase()) != -1))
    }

    if (isLoading) {
        return (
            <Loader></Loader>
        )
    } else {
        return (
            <Row>
                <Col style={{margin: '0 30px 30px 50px'}} xs={9}>
                    <Divider style={{color: 'rgb(24 144 255)', fontSize: '20px'}} orientation="left">Студенты, проходившие тест</Divider>
                    <Input
                        placeholder="Введите имя пользователя"
                        prefix={<UserOutlined className="site-form-item-icon" />}
                        value={searchUser}
                        onChange={onChange}
                    />
                    <UsersList isCheck={true} handleCheckAttempts={handleCheckAttempts} users={filterUsers}></UsersList>
                </Col>
                <Col xs={13}>
                    <AttemptsDetails onUpdate={onUpdate} isCheck={true}></AttemptsDetails>
                </Col>
            </Row>
        )
    }
}

export default CheckWorks;