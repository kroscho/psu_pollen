import React, { useState, useEffect, useContext } from "react";
import { Router, Switch, Route, Link } from "react-router-dom";
import { Layout, Button, Menu, message } from "antd";
import "antd/dist/antd.css";
import 'bootstrap/dist/css/bootstrap.css';
import MainPage from "./routes/MainPage";
import AddData from "./routes/AddData/AddData";
import Search from './routes/Search/Search';
import { auth } from "./services/firebase";
import ViewData from "./routes/ViewData/ViewData";
import history from "./services/history";
import { SpeciesContextProvider } from "./services/speciesContext";
import LoginForm from "./routes/LoginForm/LoginForm";
import ProtectedRoute from "./routes/ProtectedRoute";
import "./App.css";
import Archive from "./routes/Archive/Archive";
import Allergens from "./routes/Allergens/Allergens";
import Profile from "./routes/Profile/Profile"
import Testing from "./routes/Testing/Testing";
import { ADD_ROUTE, ALLERGENS_ROUTE, ARCHIVE_ROUTE, COURSE_INFO_ROUTE, COURSE_LECTIONS_ROUTE, COURSE_LECTURE_ROUTE, COURSE_LITERATURE_ROUTE, COURSE_ONTOLOGY_ROUTE, COURSE_TERMS_ROUTE, COURSE_TESTS_ROUTE, COURSE_TESTS_TEST_EDIT_ROUTE, COURSE_TESTS_TEST_ROUTE, COURSE_TESTS_TEST_VARIANTS_ROUTE, LOGIN_ROUTE, MAIN_ROUTE, PROFILE_ROUTE, SEARCH_ROUTE, TESTING_ALL_COURSES_ROUTE, TESTING_COURSES_ROUTE, TESTING_ROUTE, TESTS_TEST_ATTEMPTS_DETAILS_ROUTE, TESTS_TEST_ATTEMPT_ROUTE, TESTS_TEST_CHECK_WORKS_ROUTE, USER_STORAGE, VIEW_ROUTE } from "./utils/consts";
import { Context } from ".";
import TestingApi from "./API/TestingApi";
import { setLocalStorage } from "./components/utils/testing";

const { Header, Footer, Content } = Layout;

interface User {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  uid: string;
}

const App = () => {
  const [user, setUser] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false)
  const {services} = useContext(Context);

  const fetchCreateUser = async (user:any) => {
    setIsLoading(true)
    try {
      let response = await TestingApi.createUser(user);
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

  const fetchUser = async (uid:any) => {
    setIsLoading(true)
    try {
      let response = await TestingApi.getUser(uid);
      setUser(response.data)
      setLocalStorage(USER_STORAGE, response.data)
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

  const handleSignIn = async (email: string, password: string) => {
    try {
      const res = await auth.signInWithEmailAndPassword(email, password);
      fetchUser(res.user?.uid)
      history.push(MAIN_ROUTE);
      setErrorMessage("")
    } catch (err) {
      let errMessage = "";
      if (err instanceof Error) {
        errMessage = err.message;
      }
      console.log(errMessage);
      message.error("?????????? ?????? ???????????? ?????????????? ??????????????")
      setErrorMessage(errMessage)
    }
  };

  const logOut = () => {
    return auth.signOut().then(() => {
      return history.push(LOGIN_ROUTE);
    });
  };

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
  }, []);

  const getDefaultKey = () => {
    switch (history.location.pathname) {
      case MAIN_ROUTE:
        return "1";
      case ALLERGENS_ROUTE:
        return "2";
      case ADD_ROUTE:
        return "3";
      case VIEW_ROUTE:
        return "4";
      case ARCHIVE_ROUTE:
        return "5";
      case SEARCH_ROUTE:
        return "6";
      case TESTING_ROUTE:
        return "7";
      case PROFILE_ROUTE:
        return "8";
      default:
        return "1";
    }
  };

  const menuItems = services.MenuApp.map((item: any) => {
    return (
      <Menu.Item key={item.id}>
        <Link to={item.link}>{item.name}</Link>
      </Menu.Item>
    )
  })

  return (
    <SpeciesContextProvider>
      <Router history={history}>
        <Layout style={{ minHeight: "100vh" }}>
          <Header className="mainHeader">
            <Menu
              theme="dark"
              mode="horizontal"
              //@ts-ignore
              defaultSelectedKeys={getDefaultKey()}
            >
              {/* defaultSelectedKeys={["1"]} */}
              {menuItems}
            </Menu>
            {user && (
              <Button type="link" onClick={logOut}>
                ??????????
              </Button>
            )}
          </Header>
          <Switch>
            <Route
              path={LOGIN_ROUTE}
              exact
              render={() => (
                <Content>
                  <LoginForm onSubmit={handleSignIn} />
                </Content>
              )}
            />

            <Route path={VIEW_ROUTE} exact component={ViewData} />

            <ProtectedRoute
              exact
              path={ADD_ROUTE}
              user={user}
              loading={loading}
              component={AddData}
            />

            <ProtectedRoute
              exact
              path={SEARCH_ROUTE}
              user={user}
              loading={loading}
              component={Search}
            />

            <ProtectedRoute
              exact
              path={TESTING_ROUTE}
              user={user}
              loading={loading}
              component={Testing}
            />

            <Route exact path={ARCHIVE_ROUTE} component={Archive} />
            <Route exact path={ALLERGENS_ROUTE} component={Allergens} />
            
            <Route 
              exact 
              path={PROFILE_ROUTE}
              user={user}
              component={Profile} 
            />

            <ProtectedRoute
              exact
              path={TESTING_COURSES_ROUTE}
              user={user}
              loading={loading}
              component={Testing}
            />

            <ProtectedRoute
              exact
              path={TESTING_ALL_COURSES_ROUTE}
              user={user}
              loading={loading}
              component={Testing}
            />

            <ProtectedRoute
              exact
              path={COURSE_INFO_ROUTE}
              user={user}
              loading={loading}
              component={Testing}
            />

            <ProtectedRoute
              exact
              path={COURSE_TESTS_TEST_ROUTE}
              user={user}
              loading={loading}
              component={Testing}
            />

            <ProtectedRoute
              exact
              path={COURSE_TESTS_TEST_EDIT_ROUTE}
              user={user}
              loading={loading}
              component={Testing}
            />

            <ProtectedRoute
              exact
              path={COURSE_TESTS_TEST_VARIANTS_ROUTE}
              user={user}
              loading={loading}
              component={Testing}
            />

            <ProtectedRoute
              exact
              path={COURSE_TESTS_ROUTE}
              user={user}
              loading={loading}
              component={Testing}
            />

            <ProtectedRoute
              exact
              path={COURSE_LECTIONS_ROUTE}
              user={user}
              loading={loading}
              component={Testing}
            />    

            <ProtectedRoute
              exact
              path={TESTS_TEST_ATTEMPT_ROUTE}
              user={user}
              loading={loading}
              component={Testing}
            />

            <ProtectedRoute
              exact
              path={TESTS_TEST_ATTEMPTS_DETAILS_ROUTE}
              user={user}
              loading={loading}
              component={Testing}
            />

            <ProtectedRoute
              exact
              path={TESTS_TEST_CHECK_WORKS_ROUTE}
              user={user}
              loading={loading}
              component={Testing}
            />   
            <ProtectedRoute
              exact
              path={COURSE_TERMS_ROUTE}
              user={user}
              loading={loading}
              component={Testing}
            />       
            <ProtectedRoute
              exact
              path={COURSE_ONTOLOGY_ROUTE}
              user={user}
              loading={loading}
              component={Testing}
            />      

            <Route path="/" exact component={MainPage} />
          </Switch>
          <Footer style={{ textAlign: "center" }}>PSU, 2020</Footer>
        </Layout>
      </Router>
    </SpeciesContextProvider>
  );
}

export default App;
