import React, { useContext, useState } from "react";
import "antd/dist/antd.css";
import { Avatar, Button, Divider, List, Skeleton } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import RoleEdit from "../ModalForms/EditRole";
import { isAdmin } from "../../utils/testing";
import { Context } from "../../..";

const UsersList = ({onUpdateUsers, isEdit, isCheck, handleCheckAttempts, users}) => {
    const {userStore} = useContext(Context)
    const [isEditRoleFormVisible, setIsEditRoleFormVisible] = useState(false)
    const [userEdit, setUserEdit] = useState({})
    const user = userStore.User;

    const handleEditRole = (userItem) => {
       // console.log(userItem)
        setUserEdit(userItem)
        setIsEditRoleFormVisible(true)
    }

    return (
        <div
            id="scrollableDiv"
            style={{
                height: 400,
                overflow: "auto",
                padding: "0 16px",
                border: "1px solid rgba(140, 140, 140, 0.35)"
            }}
        >
        <InfiniteScroll
            dataLength={users.length}
            hasMore={users.length < 50}
            endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
            scrollableTarget="scrollableDiv"
        >
            <List
            dataSource={users}
            renderItem={(item) => (
                <List.Item key={item.uid}>
                <List.Item.Meta
                    avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                    title={item.fullName}
                    description={item.role}
                />
                { isAdmin(user) && isEdit
                    ? <Button onClick={() => handleEditRole(item)} style={{marginLeft: "5px"}} variant="outline-success">Изменить роль</Button>
                    : null
                }
                { isAdmin(user) && isCheck
                    ? <Button onClick={() => handleCheckAttempts(item)} style={{marginLeft: "5px"}} variant="outline-success">Проверить попытки</Button>
                    : null
                }
                </List.Item>
            )}
            />
        </InfiniteScroll>
        <RoleEdit onUpdateUsers={onUpdateUsers} user={userEdit} isVisible={isEditRoleFormVisible} setIsVisible={setIsEditRoleFormVisible}></RoleEdit>
        </div>
    );
};

export default UsersList;