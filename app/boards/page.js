"use client";

import React, {useState, useEffect} from "react";
import {useRouter} from "next/navigation";


const BoardsPage = () => {
    const [user, setUser] = useState("")
    const [messages, setMessages] = useState()
    const [pageNumber, setPageNumber] = useState(1)
    const [text, setText] = useState("")
    const [resMessages, setResMessages] = useState("")
    const router = useRouter();
    const fetchUser = async () => {
        try {
            const response = await fetch("http://localhost:3030/users", {
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",

            });
            const data = await response.json();

            if (response.ok) {
                setUser(data.user.name);
            } else {
                setUser(null)
                await router.push("./../users/login")
            }
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    const messageAll = async () => {
        try {
            const response = await fetch(`http://localhost:3030/messages/read${pageNumber}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                orderBy: [
                    {createdAt: "desc"}
                ],
                credentials: "include",
            });
            const data = await response.json()

            if (response.ok) {
                setMessages(data.documents)
                console.log(data.documents)
            } else {
                console.error(data);
            }
        } catch (error) {
            console.error("error", error);
        }
    };


    useEffect(() => {
        fetchUser();
        messageAll();
    }, [pageNumber, resMessages]);


    const pageNext = () => {
        setPageNumber(pageNumber + 1)
        messageAll()
    }

    const pagePrev = () => {
        setPageNumber(pageNumber - 1)
        messageAll()
    }

    const messageCreate = async () => {
        if(text) {
            try {
                const response = await fetch("http://localhost:3030/messages/create", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({text}),
                });

                const data = await response.json();

                if (response.ok) {
                    console.log("送信完了:", data.message);
                    setText("")
                    setResMessages("送信完了")
                    await messageAll()
                } else {
                    console.error("送信失敗", data.message);
                    setResMessages("送信失敗")
                    setText("")
                    await messageAll()

                }

            } catch (error) {
                console.error("error", error);
            }
        }else {
            setResMessages("入力してください")
        }
    };


    return (
        <>
            <div className="container">
                <header>
                    <h1 className="display-4">Boards</h1>
                </header>
                {user ? (
                    <p className="h4">Welcome to {user}.</p>
                ) : (
                    <p className="h4">Loading....</p>
                )}
                <form>
                    <div className="row">
                        <div className="col-10">
                            <input className="form-control"
                                   type="text"
                                   id="messages"
                                   placeholder="メッセージ"
                                   value={text}
                                   onChange={(e) => setText(e.target.value)}></input>
                        </div>
                        <button className="btn btn-primary col-2" type="button" onClick={messageCreate}>送信</button>
                    </div>
                </form>
                {resMessages ? (
                    <p className="text-danger">{resMessages}</p>
                ) : (
                    <></>
                )}

                <div>
                    {messages ? (
                        <table className="table mt-5">
                            <tbody>
                            {messages.map((val, i) =>
                                <tr className="row" key={i}>
                                    <td className="col-9">{val.text}</td>
                                    <td className="col-3">{val.createdAt}</td>
                                </tr>
                            )}
                            </tbody>
                        </table>

                    ) : (
                        <p className="h4">Loading....</p>
                    )}
                </div>
                <ul className="pagination justify-content-center">
                    <li className="page-item">
                        <a className="page-link" onClick={pagePrev}>&lt;&lt;prev</a>
                    </li>

                    <li className="page-item">
                        <a className="page-link" onClick={pageNext}>next&gt;&gt;</a>
                    </li>

                </ul>

            </div>
        </>
    )

};

export default BoardsPage;