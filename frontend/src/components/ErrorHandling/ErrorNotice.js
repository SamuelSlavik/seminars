import React from "react";

export default function ErrorNotice(props) {
    return (
        <div className={"errorNotice"}>
            <span>
                {props.message}
            </span>
            <button onClick={props.clearError}>Got it</button>
        </div>
    )
}