import React from "react";
import { Form, Input } from "antd";

const TextTask = ({field, task}) => {
    const numberTask = field.key + 1

    return (
        <Form.Item
            name={[field.name, 'answer']}
            label={numberTask + ". " + task.question} 
            style={{borderBottomStyle: "solid", color: "rgb(216 162 162 / 13%)"}}
            rules={[
                {
                required: true,
                message: 'Заполните поле',
                },
            ]}
        >
            <Input placeholder="input placeholder" />
        </Form.Item>
    )
}

export default TextTask;