import { Button } from "../ui/button";
import React from "react";

export default function Header(props: any) {
    return (
        <div className="flex justify-between items-center p-4">
            <div className="text-xl font-bold">{props.pageTitle}</div>
            <Button variant="default" onClick={props.onButtonClick}>
                {props.btnIcon && React.createElement(props.btnIcon, { className: "w-4 h-4" })}
                {props.btnLbl}
            </Button>
        </div>
    )
}