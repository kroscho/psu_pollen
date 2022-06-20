import React, {useContext, useEffect, useState} from "react";
import { Context } from "../../index"
import { Button, Table } from "react-bootstrap";
import { Col, Divider, Input, Row } from "antd";
import ProfileEdit from "../../components/Course/ModalForms/ProfileEdit";
import TestingApi from "../../API/TestingApi";
import Loader from "../../components/UI/Loader/Loader";
import { useFetching } from "../../components/hooks/useFetching";
import UsersList from "../../components/Course/Users/UsersList";
import { UserOutlined } from '@ant-design/icons';

const Profile = () => {
    
    const {userStore} = useContext(Context);
    const [isProfileEditFormVisible, setIsProfileEditFormVisible] = useState(false)
    const [users, setUsers] = useState([])
    const [filterUsers, setFilterUsers] = useState([])
    const user = userStore.User;
    const [searchUser, setSearchUser] = useState("")
    const [update, setUpdate] = useState(false)

    const [fetchUsers, isDataLoading, dataError] = useFetching(async () => {
        let response = await TestingApi.getUsers();
        setUsers(response.data)
        setFilterUsers(response.data)
        console.log(response.data)
    })

    const handleEditProfile = () => {
        setIsProfileEditFormVisible(true)
    }

    const onUpdate = () => {
        setUpdate(!update)
    }

    useEffect(() => {
        fetchUsers()
    }, [update])
        
    const onChange = (e) => {
        setSearchUser(e.target.value)
        setFilterUsers(users.filter(user => user.fullName.toLowerCase().indexOf(e.target.value.toLowerCase()) != -1))
    }
    
    if (isDataLoading) {
        return (
            <Loader/>
        )
    } else {
        return (
            <div className="contain">
                <Row>
                    <Col style={{marginLeft: '20px'}} xs={9}>
                        <Divider style={{color: 'rgb(24 144 255)', fontSize: '20px'}} orientation="left">Мои данные</Divider>
                        <Table striped bordered>
                            <tbody>
                                <tr>
                                    <th>Имя</th>
                                    <td>{user.firstName}</td>
                                </tr>
                                <tr>
                                    <th>Фамилия</th>
                                    <td>{user.lastName}</td>
                                </tr>
                                <tr>
                                    <th>Роль</th>
                                    <td>{user.role}</td>
                                </tr>
                                <tr>
                                    <th>Email</th>
                                    <td>{user.email}</td>
                                </tr>
                            </tbody>
                        </Table>
                        <Button onClick={handleEditProfile} style={{marginLeft: "5px"}} variant="outline-secondary">Редактировать профиль</Button>
                    </Col>
                    <Col style={{margin: '0 0 30px 50px'}} xs={9}>
                        <Divider style={{color: 'rgb(24 144 255)', fontSize: '20px'}} orientation="left">Все пользователи</Divider>
                        <Input
                            placeholder="Введите имя пользователя"
                            prefix={<UserOutlined className="site-form-item-icon" />}
                            value={searchUser}
                            onChange={onChange}
                        />
                        <UsersList onUpdateUsers={onUpdate} isEdit={true} users={filterUsers}></UsersList>
                    </Col>
                </Row>
                <ProfileEdit isVisible={isProfileEditFormVisible} setIsVisible={setIsProfileEditFormVisible}></ProfileEdit>
            </div>
        );
    }
}

export default Profile;