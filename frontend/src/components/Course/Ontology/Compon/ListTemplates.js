import React, { useContext, useState } from "react";
import "antd/dist/antd.css";
import { Avatar, Button, Divider, List, message, Skeleton } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import { isAdmin } from "../../../utils/testing";
import { Context } from "../../../..";
import Loader from "../../../UI/Loader/Loader";
import TestingApi from "../../../../API/TestingApi";

const ListTemplates = ({templates, onUpdate}) => {
    const {userStore} = useContext(Context)
    const [isEditRoleFormVisible, setIsEditRoleFormVisible] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [userEdit, setUserEdit] = useState({})
    const user = userStore.User;
    //console.log("templates: ", templates)

    const fetchDeleteTemplate = async (tempObj) => {
        setIsLoading(true)
        const item = {tempObj: tempObj}
        let response = await TestingApi.DeleteTemplate(item);
        if (response.data === "ok") {
            message.success('Шаблон удален успешно');
        }
        setIsLoading(false)
        onUpdate()
    }

    const handleDeleteTemplate = (template) => {
        //console.log(template)
        fetchDeleteTemplate(template.tempObj)
    }

    if (isLoading) {
        return <Loader/>
    } else {
        return (
            <div
            id="scrollableDiv"
            style={{
                height: 300,
                width: '50%',
                overflow: "auto",
                padding: "0 16px",
                border: "1px solid rgba(140, 140, 140, 0.35)"
            }}
            >
            <InfiniteScroll
                dataLength={templates.length}
                hasMore={templates.length < 50}
                endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                scrollableTarget="scrollableDiv"
            >
                <List
                dataSource={templates}
                renderItem={(item) => (
                    <List.Item key={item.tempObj}>
                    <List.Item.Meta
                        title={item.tempName}
                        description={item.tempTitle}
                    />
                    { isAdmin(user)
                        ? <Button onClick={() => handleDeleteTemplate(item)} style={{marginLeft: "5px"}} variant="outline-success">Удалить шаблон</Button>
                        : null
                    }
                    </List.Item>
                )}
                />
            </InfiniteScroll>
            </div>
        );
    }
};

export default ListTemplates;