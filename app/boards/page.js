"use client";

import React, {useState, useEffect} from "react";


const BoardsPage = () => {
    const [user, setUser] = useState(null)
    const LoginUser = () => {
        try {
            const response = fetch("http://localhost:3030/users", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            console.log(response)
        } catch (error) {
            console.error("error", error);
        }
    };
    useEffect(() => {
        LoginUser();
    }, []);


    return (
        <>
            a
        </>
    )

};

export default BoardsPage;