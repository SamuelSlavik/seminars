import React, {useContext} from "react";
import {Link} from "react-router-dom";
import Dashboard from "./Dashboard";
import UserContext from "../../context/userContext";

export default function Homepage() {
    const { userData, setUserData } = useContext(UserContext);

    const logout = () => {
        setUserData({
            token: undefined,
            user: null,
        });
        localStorage.setItem("auth-token", "");
    };

    if (userData.user === null) return (
        <div className={"loadingWrapper"}>
            <h2 className={"loadingMessage"}>Loading...</h2>
        </div>
    ); else return (
                <div className={"homepageWrapper"}>
                <div className={"homepageContent"}>
                <h1 className={"homepageHeader"}>Welcome to the Your Seminars App, <br/>which will help you to choose the right path!</h1>
                <br/>
                <Link className={"homepageLogin"} to={"/login"}>Log In </Link>
                </div>
                </div>
    )
}
