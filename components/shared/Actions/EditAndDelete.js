import React from "react";
import { IconContext } from "react-icons";
import { BiEdit } from "react-icons/bi";
import { RiDeleteBin5Line } from "react-icons/ri";

const EditAndDelete = ({ isLoading, onEdit, onDelete }) => {
    return (
        <p
            className="my-1"
            style={{
                pointerEvents: isLoading ? "none" : "",
                display: "flex",
                gap: "0.8rem",
                cursor: "pointer",
                justifyContent: "flex-end",
            }}
        >
            <span
                onClick={(e) => onEdit(e)}
                style={{
                    color: "white",
                    background: "#1FB42E",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    padding: "5px",
                    borderRadius: "5px",
                }}
            >
                <IconContext.Provider value={{ size: "26px" }}>
                    <BiEdit />
                </IconContext.Provider>
            </span>
            <span
                onClick={(e) => onDelete(e)}
                style={{
                    color: "white",
                    background: "#FF0000",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    borderRadius: "5px",
                    padding: "5px",
                }}
            >
                <IconContext.Provider value={{ size: "26px" }}>
                    <RiDeleteBin5Line />
                </IconContext.Provider>
            </span>
        </p>
    );
};

export default EditAndDelete;
