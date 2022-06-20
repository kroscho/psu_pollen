import React, { useState } from "react";
import { Form, Radio, Space } from "antd";

const SingleTask = ({field, task}) => {
    
    let listAnswers = []
    const numberTask = field.key + 1

    //const logicalAnswers = [{"answer": "Да"}, {"answer": "Нет"}]

   /* if (task.answers.length === 0) {
        listAnswers = logicalAnswers.map((item, ind) => {
            return (
                <Radio key={ind} value={item.answer}>{item.answer}</Radio>
            )
        })
    } else {*/
    listAnswers = task.answers.map((item, ind) => {
        return (
            <Radio key={ind} value={item.answer}>{item.answer}</Radio>
        )
    })
    
    return (        
        <Form.Item 
            name={[field.name, "answer"]}  
            label={numberTask + ". " + task.question}
            rules={[
                {
                required: true,
                message: 'Заполните поле',
                },
            ]}
        >
            <Radio.Group>
                <Space direction="vertical">
                {listAnswers}
                </Space>
            </Radio.Group>
        </Form.Item>
    )
}

export default SingleTask;