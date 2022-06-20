import React, { useContext, useState } from 'react';
import 'antd/dist/antd.css';
import { Modal, Button, Form, List, Divider } from 'antd';
import { Context } from '../../..';
import InfiniteScroll from 'react-infinite-scroll-component';

const SelectTerms = ({isVisible, setIsVisible, updateFormTerms, field, terms}) => {
    const {userStore} = useContext(Context)
    const user = userStore.User;
    const module = userStore.Module;
    const [form] = Form.useForm();

    const handleOk = () => {
        setIsVisible(false);
    };

    const handleCancel = () => {
        setIsVisible(false);
    };

    const handleTerm = (term) => {
        userStore.setCurFieldKey(field)
        updateFormTerms(term.term)
    }

    return (
        <>
        <Modal title="Редактирование профиля" visible={isVisible} onOk={handleOk} onCancel={handleCancel}>
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
                dataLength={terms.length}
                hasMore={terms.length < 50}
                endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                scrollableTarget="scrollableDiv"
            >
                <List
                dataSource={terms}
                renderItem={(item) => (
                    <List.Item key={item.term} style={{pointerEvents: true}}>
                    <List.Item.Meta
                        title={item.term}
                    />
                    <Button onClick={() => handleTerm(item)} style={{marginLeft: "5px"}} variant="outline-success">Выбрать</Button>
                    </List.Item>
                )}
                />
            </InfiniteScroll>
            </div>
        </Modal>
        </>
    )};
    

export default SelectTerms;