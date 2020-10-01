import React, {useContext, useEffect, useState} from "react";
import {Link, useHistory} from "react-router-dom";
import UserContext from "../../context/userContext";
import Axios from "axios";
import ErrorNotice from "../ErrorHandling/ErrorNotice";

export default function SeminarsList() {
    const [seminarData, setSeminarData] = useState({
        seminar: [],
    });
    const { userData, setUserData } = useContext(UserContext);
    const [error, setError] = useState();

    useEffect(() => {
        const listSeminarData = async () => {
            const seminarRes = await Axios.get("http://localhost:5000/seminars/",)
            setSeminarData({
                seminar: seminarRes.data
            })
        };

        listSeminarData();
    }, []);
    const history = useHistory();
    let seminarArray = seminarData.seminar.seminar;

    //BORDER STYLES
    const greenBorderStyle = {borderImage: "linear-gradient(45deg, #17823b, white) 1"};
    const orangeBorderStyle = {borderImage: "linear-gradient(45deg, #eb9947, white) 1"};
    const redBorderStyle = {borderImage: "linear-gradient(45deg, #d22d2d, white) 1"};

    //API REQUESTS
    const joinSeminar = async (name) => {
        try {
            const title = name.title;
            const joiningStudent = userData.user.name;
            const joinUser = { title, joiningStudent };
            const loginRes = await Axios.post(
                "http://localhost:5000/seminars/joinSeminar",
                joinUser
            );
            window.location.reload(false);
            /*setUserData({
                token: loginRes.data.token,
                user: loginRes.data.user,
            });*/
        } catch (err) {
            err.response.data.msg && setError(err.response.data.msg);
        }
    };

    const leaveSeminar = async (name) => {
        try {
            const title = name.title;
            const joiningStudent = userData.user.name;
            const leaveUser = { title, joiningStudent };
            const loginRes = await Axios.post(
                "http://localhost:5000/seminars/leaveSeminar",
                leaveUser
            );
            window.location.reload(false);
            /*setUserData({
                token: loginRes.data.token,
                user: loginRes.data.user,
            });*/
        } catch (err) {
            console.log(err)
        }
    };

    if (seminarArray === undefined) return (
        <div className={"loadingWrapper"}>
            <h2 className={"loadingMessage"}>Loading...</h2>
        </div>
    ); else return (
        <div className={"seminarsWrapper"}>
            {
                error && <ErrorNotice message={error} clearError={()=> setError(undefined)}/>
            }
            {console.log("first", seminarData)}
            <div className={"seminarCurrentPath"}>
                <h2>My current path:</h2>
                <div className={"seminarCurrentPath__content"}>
                    {seminarArray.map(({_id, title, numberOfLessons, numberOfStudents, loggedStudents}) => (
                        (loggedStudents.includes(userData.user.name)) ?
                            <p key={_id}>{title}, {numberOfLessons}</p> :
                            <div>
                                <p></p>
                            </div>
                    ))}
                </div>
            </div>
            <h2 className={"seminarHeading"}>Choose wisely:</h2>
            <div className={"seminars"}>
                {
                    error && <ErrorNotice message={error} clearError={()=> setError(undefined)}/>
                }
                {seminarArray.map(({_id, title, numberOfLessons, numberOfStudents, loggedStudents}) => (
                    <div style={(numberOfStudents >= 15) ? greenBorderStyle : (numberOfStudents >= 12) ? orangeBorderStyle: redBorderStyle} className={"singleSeminar"} key={_id}>
                        <h3>
                            {title},
                            {numberOfLessons}
                        </h3>
                        <span className={"singleSeminar__left"}>
                            <a className={"popupAnchor"} href={"#popup" + title}>{numberOfStudents}</a>
                            {
                                (loggedStudents.includes(userData.user.name)) ?
                                    <button onClick={() => leaveSeminar({title})} className={"seminarButton"}>Save your Life</button> :
                                    <button onClick={() => joinSeminar({title})} className={"seminarButton"}>Sign in Blood</button>
                            }
                        </span>
                        <div className="popup" id={"popup" + title}>
                            <a className="popup__close" href="#!">X</a>
                            <div className={"popupInner"}>
                                {loggedStudents.map((item) => (
                                    <p key={item}>{item}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
                {
                    error && <ErrorNotice message={error} clearError={()=> setError(undefined)}/>
                }
            </div>
        </div>
    )
}
