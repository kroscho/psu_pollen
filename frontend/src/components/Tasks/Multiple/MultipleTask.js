import React from "react";
import { Form, Checkbox, Space } from "antd";

const MultipleTask = ({task, field}) => {
    
    const numberTask = field.key + 1

    const listAnswers = task.answers.map((item, ind) => {
        return (
            <Checkbox key={ind} value={item.answer}>{item.answer}</Checkbox>
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
            <Checkbox.Group style={{ width: '100%' }}>
                <Space direction="vertical">
                    {listAnswers}
                </Space>
            </Checkbox.Group>
        </Form.Item>
    )
}

export default MultipleTask;