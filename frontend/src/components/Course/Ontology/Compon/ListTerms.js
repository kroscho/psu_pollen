import React, { useContext, useState } from "react";
import "antd/dist/antd.css";
import { Avatar, Button, Divider, List, message, Skeleton } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import { isAdmin } from "../../../utils/testing";
import { Context } from "../../../..";
import Loader from "../../../UI/Loader/Loader";
import TestingApi from "../../../../API/TestingApi";
import EditTerm from "../../ModalForms/EditTerm";

const ListTerms = ({terms, onUpdate, subjectArea}) => {
    const {userStore} = useContext(Context)
    const [isVisibleEditTermForm, setIsVisibleEditTermForm] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [curTerm, setCurTerm] = useState("")
    const [userEdit, setUserEdit] = useState({})
    const user = userStore.User;

    const fetchDeleteTerm = async (nameTerm) => {
        setIsLoading(true)
        const item = {nameTerm: nameTerm}
        let response = await TestingApi.DeleteTerm(item);
        if (response.data === "ok") {
            message.success('Концепт удален успешно');
        }
        onUpdate()
        setIsLoading(false)
    }

    const fetchInfoTerm = async (termObj) => {
        setIsLoading(true)
        let response = await TestingApi.getInfoByTerm(termObj);
        console.log(response.data)
        setIsLoading(false)
    }

    const handleInfoTerm = (term) => {
        console.log(term)
        setCurTerm(term.term)
        setIsVisibleEditTermForm(true)
    }

    const handleDeleteTerm = (term) => {
        console.log(term)
        fetchDeleteTerm(term.term)
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
                dataLength={terms.length}
                hasMore={terms.length < 50}
                endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                scrollableTarget="scrollableDiv"
            >
                <List
                dataSource={terms}
                renderItem={(item) => (
                    <List.Item key={item.term}>
                    <List.Item.Meta
                        title={item.termStr}
                    />
                     { isAdmin(user)
                        ? <Button onClick={() => handleInfoTerm(item)} style={{marginLeft: "5px"}} variant="outline-success">Подробнее</Button>
                        : null
                    }
                    { isAdmin(user)
                        ? <Button onClick={() => handleDeleteTerm(item)} style={{marginLeft: "5px"}} variant="outline-success">Удалить концепт</Button>
                        : null
                    }
                    </List.Item>
                )}
                />
            </InfiniteScroll>
            <EditTerm isVisible={isVisibleEditTermForm} setIsVisible={setIsVisibleEditTermForm} term={curTerm} subjectArea={subjectArea} onUpdate={onUpdate}></EditTerm>  
            </div>
        );
    }
};

export default ListTerms;