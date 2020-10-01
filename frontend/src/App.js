import React,{ useState, useEffect, } from "react";
import Axios from "axios";
import {BrowserRouter, Switch, Route} from "react-router-dom";

import UserContext from "./context/userContext";

import Homepage from "./components/pages/Homepage";
import Login from "./components/pages/Login";
import Dashboard from "./components/pages/Dashboard";
import AdminDashboard from "./components/pages/AdminDashboard";
import AddUser from "./components/pages/administration/AddUser";

export default function App(){
    const [userData, setUserData] = useState({
        token: undefined,
        user: undefined,
    });const [seminarData, setSeminarData] = useState({
        seminar: undefined,
    });
    useEffect(() => {
    const checkLoggedIn = async () => {
        let token = localStorage.getItem("auth-token");
        if (token === null) {
            localStorage.setItem("auth-token", "");
            token = "";
        }
        const tokenRes = await Axios.post(
            "http://localhost:5000/users/tokenIsValid",
            null,
            { headers: { "x-auth-token": token } }
        );
        if (tokenRes.data) {
            const userRes = await Axios.get("http://localhost:5000/users/", {
                headers: { "x-auth-token": token },
            });
            setUserData({
                token,
                user: userRes.data,
            });
        }
    };
    const listSeminarData = async () => {
        const seminarRes = await Axios.get("http://localhost:5000/seminars/",)
        setSeminarData({
            seminar: seminarRes.data
        })
    };

    listSeminarData();
    checkLoggedIn();

}, []);
        return (
            <div className={"app"}>
                {userData.user === 2 ? (
                    <div className={"loadingWrapper"}>
                        <h2 className={"loadingMessage"}>Loading...</h2>
                    </div>
                ) : (
                    <UserContext.Provider value={{ userData, setUserData }}>
                    <Switch className={"innerContent"}>
                        <Route exact path="/">
                            <Homepage />
                        </Route>
                        <Route exact path="/login">
                            <Login/>
                        </Route>
                        <Route exact path={"/dashboard"}>
                            <Dashboard/>
                        </Route>
                        <Route exact path={"/adminDashboard"}>
                            <AdminDashboard/>
                        </Route>
                        <Route exact path={"/addUser"}>
                            <AddUser />
                        </Route>
                    </Switch>
                    </UserContext.Provider>
                )}
            </div>
        )
}