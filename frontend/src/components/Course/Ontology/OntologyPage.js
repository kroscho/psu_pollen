import React, { useContext, useEffect, useState } from "react";
import 'antd/dist/antd.css';
import { Button, Form, Input, Select, Tabs  } from "antd";
import { Context } from "../../..";
import Concepts from "./Compon/Concepts";
import Templates from "./Compon/Templates";


const { TabPane } = Tabs;

const OntologyPage = () => {
    const {userStore} = useContext(Context)
    const [updateConcepts, setUpdateConcepts] = useState(false)
    const [updateTemplates, setUpdateTemplates] = useState(false)
    const curCourse = userStore.CurCourse;
    const user = userStore.User;

    const onChange = (key) => {
       // console.log(key);
        if (key === "1") {
          setUpdateConcepts(!updateConcepts)
        } else if (key === "2") {
          setUpdateTemplates(!updateTemplates)
        }
    };

    return (
        <Tabs defaultActiveKey="1" onChange={onChange}>
        <TabPane tab="Концепты" key="1">
          <Concepts updatePage={updateConcepts}/>
        </TabPane>
        <TabPane tab="Шаблоны вопросов" key="2">
          <Templates updatePage={updateTemplates}/>
        </TabPane>
        <TabPane tab="Пока неизвестно" key="3">
          Content of Tab Pane 3
        </TabPane>
      </Tabs>
    )
}

export default OntologyPage;