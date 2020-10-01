import React, {useContext, useState} from "react";
import {Link, useHistory} from "react-router-dom";
import UserContext from "../../context/userContext";
import ErrorNotice from "../ErrorHandling/ErrorNotice";

export default function UserProfile() {
    const { userData, setUserData } = useContext(UserContext);
    const history = useHistory();
    const [error, setError] = useState();

    const logout = () => {
        try {
            setUserData({
                token: undefined,
                user: undefined,
            });
            localStorage.setItem("auth-token", "");
            history.push("/login");
        } catch (err) {
            err.response.data.msg && setError(err.response.data.msg);
        }
    };

    return (
        <div className={"userProfileWrapper"}>
            <i className="fa fa-user fa-5x userImage" aria-hidden="true"/>
            <h2 className={"userData"}>{userData.user.name}</h2>
            <p className={"userLabel"}>Grade</p>
            <h3 className={"userData"}>{userData.user.grade}</h3>
            <p className={"userLabel"}>Free Lessons</p>
            <h3 className={"userData"}>{userData.user.lessons}</h3>
            <button className={"logOut"} onClick={logout}>Log Out</button>
            <br/>
            {
                error && <ErrorNotice message={error} clearError={()=> setError(undefined)}/>
            }
            {console.log(userData)}
        </div>
    )
}
