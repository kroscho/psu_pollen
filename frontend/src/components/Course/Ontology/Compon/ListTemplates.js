import React, { useState } from "react";
import "antd/dist/antd.css";
import { Avatar, Button, Divider, List, message } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import { getLocalStorage, isAdmin } from "../../../utils/testing";
import Loader from "../../../UI/Loader/Loader";
import TestingApi from "../../../../API/TestingApi";
import { USER_STORAGE } from "../../../../utils/consts";

const ListTemplates = ({templates, onUpdate}) => {
    const [isLoading, setIsLoading] = useState(false)
    
    const user = getLocalStorage(USER_STORAGE);

    const fetchDeleteTemplate = async (tempObj) => {
        setIsLoading(true)
        try {
            const item = {tempObj: tempObj}
            let response = await TestingApi.DeleteTemplate(item);
            if (response.data === "ok") {
                message.success('Шаблон удален успешно');
            }
            setIsLoading(false)
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

    const handleDeleteTemplate = (template) => {
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