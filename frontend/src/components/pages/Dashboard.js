import React, {useContext} from "react";
import {Link} from "react-router-dom";
import Dashboard from "./Dashboard";
import UserContext from "../../context/userContext";

import UserProfile from "../layout/UserProfile";
import SeminarsList from "../layout/SeminarsList";

export default function DashBoard() {
    const { userData, setUserData } = useContext(UserContext);

    const logout = () => {
        setUserData({
            token: undefined,
            user: null,
        });
        localStorage.setItem("auth-token", "");
    };

    if (userData.user === undefined) return (
        <div className={"loadingWrapper"}>
            <h2 className={"loadingMessage"}>Please Log In!</h2>
        </div>
    ); else return  (
        <div className={"dashboardWrapper"}>
            <UserProfile />
            <SeminarsList />
            {console.log(userData)}
        </div>
    )
}
