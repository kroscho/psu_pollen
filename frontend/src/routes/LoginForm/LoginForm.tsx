import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { Layout } from "antd";
import { auth } from "../../services/firebase";
import "./styles.css";
import TestingApi from "../../API/TestingApi";
import Loader from "../../components/UI/Loader/Loader";

const { Content } = Layout;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

function LoginForm({ onSubmit }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false)
  const [typeLog, setTypeLog] = useState(true)

  const fetchCreateUser = async (item:any) => {
    setIsLoading(true)
    let response = await TestingApi.createUser(item);
    if (response.data === "ok") {
        message.success('Вы успешно зарегистрированы');
    }
    setIsLoading(false)
}

  const handleRegIn = async () => {
    try {
      const res = await auth.createUserWithEmailAndPassword(email, password);
      const user = res.user;
      const item = {uid: user?.uid, email: user?.email, firstName: firstName, lastName: lastName}
      console.log("user: ", item)
      fetchCreateUser(item)
    } catch(err) {
      let errMessage = "";
      if (err instanceof Error) {
        errMessage = err.message;
      }
      console.log(errMessage);
    }
  };

  const handleSubmit = () => {
    onSubmit(email, password);
  };
  if (isLoading) {
    return <Loader/>
  } else {
    if (typeLog) {
      return (
        <Content>
          <div className="loginContainer">
            <Form
              {...layout}
              name="basic"
              initialValues={{ remember: true }}
              onFinish={handleSubmit}
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: "Введите почту" }]}
              >
                <Input
                  required
                  type={"email"}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </Form.Item>
    
              <Form.Item
                label="Пароль"
                name="password"
                rules={[{ required: true, message: "Введите пароль" }]}
              >
                <Input.Password
                  required
                  type={"password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </Form.Item>
    
              <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit">
                  Войти
                </Button>
                <div>Или <a onClick={() => setTypeLog(!typeLog)} >зарегистрироваться сейчас!</a></div>
              </Form.Item>
            </Form>
          </div>
        </Content>
      );
    }
    else {
      return (
        <Content>
          <div className="loginContainer">
            <Form
              {...layout}
              name="basic"
              initialValues={{ remember: true }}
              onFinish={handleRegIn}
            >
              <Form.Item
                label="Имя"
                name="firstName"
                rules={[{ required: true, message: "Введите имя" }]}
              >
                <Input
                  required
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                />
              </Form.Item>
    
              <Form.Item
                label="Фамилия"
                name="lastName"
                rules={[{ required: true, message: "Введите фамилию" }]}
              >
                <Input
                  required
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: "Введите почту" }]}
              >
                <Input
                  required
                  type={"email"}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </Form.Item>
    
              <Form.Item
                label="Пароль"
                name="password"
                rules={[{ required: true, message: "Введите пароль" }]}
              >
                <Input.Password
                  required
                  type={"password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </Form.Item>
    
              <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit">
                  Зарегистрироваться
                </Button>
                <div>Или <a onClick={() => setTypeLog(!typeLog)} >войдите сейчас!</a></div>
              </Form.Item>
            </Form>
          </div>
        </Content>
      );
    }
  }
}

export default LoginForm;
