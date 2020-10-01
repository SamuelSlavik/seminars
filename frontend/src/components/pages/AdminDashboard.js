import React, {useContext} from "react";
import {Link} from "react-router-dom";
import Dashboard from "./Dashboard";
import UserContext from "../../context/userContext";

import UserProfile from "../layout/UserProfile";
import SeminarsList from "../layout/SeminarsList";

export default function AdminDashboard() {
    const { userData, setUserData } = useContext(UserContext);

    const logout = () => {
        setUserData({
            token: undefined,
            user: null,
        });
        localStorage.setItem("auth-token", "");
    };

    if (userData.user === undefined || userData.user.name !== "admin") return (
        <div className={"loadingWrapper"}>
            <h2 className={"loadingMessage"}>Please Log In!</h2>
            {console.log(userData)}
        </div>
    ); else return  (
        <div className={"dashboardWrapper"}>
            <UserProfile />
            <div className={"adminDashboardWrapper"}>
                <h2>Welcome Admin! Don't worry, everything is working properly.</h2>
                <div className={"adminNavigation"}>
                    <Link to={"addUser"}>Add user</Link>
                </div>
            </div>
            {console.log(userData)}
        </div>
    )
}