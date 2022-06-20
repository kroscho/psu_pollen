import React from "react";
import { Form, Input } from "antd";
import SingleTask from "../Single/SingleTask";
import MultipleTask from "../Multiple/MultipleTask";
import { LOGICAL_TASK_TYPE, MULTIPLE_TASK_TYPE, SINGLE_TASK_TYPE } from "../../../utils/consts";
import TextTask from "../Text/TextTask";

const Task = ({field, form, tasks}) => {
    let questionType = ""
    if (tasks) {
        if (tasks[field.key] && tasks[field.key].type) {
            questionType = tasks[field.key].type
        } else {
            questionType = "1" 
        }
    }
    if (questionType === SINGLE_TASK_TYPE || questionType === LOGICAL_TASK_TYPE) {
        return <SingleTask field={field} task={tasks[field.key]}></SingleTask>
    }
    else if (questionType === MULTIPLE_TASK_TYPE) {
        return <MultipleTask field={field} task={tasks[field.key]}></MultipleTask>
    }
    else {
        return <TextTask field={field} task={tasks[field.key]}></TextTask>
    }
}

export default Task;