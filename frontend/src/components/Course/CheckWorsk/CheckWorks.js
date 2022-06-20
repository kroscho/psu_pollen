import React, { useContext, useEffect, useState } from "react";
import 'antd/dist/antd.css';
import { Context } from "../../..";
import { Col, Divider, Form, Input, Row } from "antd";
import { useFetching } from "../../hooks/useFetching";
import TestingApi from "../../../API/TestingApi";
import UsersList from "../Users/UsersList";
import Loader from "../../UI/Loader/Loader";
import { UserOutlined } from '@ant-design/icons';
import AttemptsDetails from "../AttemptsDetails/AttemptsDetails";

const CheckWorks = () => {
    const {userStore} = useContext(Context)
    const [usersAttempts, setUsersAttempts] = useState([])
    const [curAttempts, setCurAttempts] = useState([])
    const [filterUsers, setFilterUsers] = useState([])
    const [searchUser, setSearchUser] = useState("")
    const [update, setUpdate] = useState(false)

    const [fetchUsersWhoPassedTheTest, isDataLoading, dataError] = useFetching(async () => {
        let response = await TestingApi.getUsersWhoPassedTheTest(userStore.CurTest);
        console.log(response.data)
        setUsersAttempts(response.data)
        setFilterUsers(response.data)
    })

    useEffect(() => {
        userStore.setCurAttempts([])
        fetchUsersWhoPassedTheTest()
    }, [update])

    const onUpdate = () => {
        setUpdate(!update)
    }

    const handleCheckAttempts = (user) => {
        console.log("checkUser: ", user)
        userStore.setCurAttempts(user.attempts)
        setCurAttempts(user.attempts)
    }

    const onChange = (e) => {
        setSearchUser(e.target.value)
        setFilterUsers(usersAttempts.filter(user => user.fullName.toLowerCase().indexOf(e.target.value.toLowerCase()) != -1))
    }

    if (isDataLoading) {
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