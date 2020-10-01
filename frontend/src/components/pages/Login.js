import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import UserContext from "../../context/userContext";
import Axios from "axios";

import ErrorNotice from "../ErrorHandling/ErrorNotice";

export default function Login() {
    const [name, setName] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState();

    const { userData, setUserData } = useContext(UserContext);
    const history = useHistory();

    const submit = async (e) => {
        e.preventDefault();
        try {
            const loginUser = { name, password };
            const loginRes = await Axios.post(
                "http://localhost:5000/users/login",
                loginUser
            );
            setUserData({
                token: loginRes.data.token,
                user: loginRes.data.user,
            });
            localStorage.setItem("auth-token", loginRes.data.token);
            if (name === "admin") {
                history.push("/adminDashboard")
            } else history.push("/dashboard");
        } catch (e) {
            console.log(e);
            e.response.data.msg && setError(e.response.data.msg);
        }
    };
    return (
        <div className="loginWrapper">
            <form className="loginForm" onSubmit={submit} autoComplete={"off"}>
                {
                    error && <ErrorNotice message={error} clearError={()=> setError(undefined)}/>
                }
                <input type="text" style={{display:"none"}}/>
                <input type="password" style={{display:"none"}}/>
                <input
                    id={"login-name"}
                    type={"text"}
                    placeholder={"Name"}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete={"off"}
                />
                <input
                    id={"login-password"}
                    type={"password"}
                    placeholder={"Password"}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete={"off"}
                />
                <input
                    className={"loginSubmit"}
                    type={"submit"}
                    value={"Log in"}
                />
            </form>
        </div>
    );
}