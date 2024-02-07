"use client";

import React, {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import {cdate} from "cdate"


const BoardsPage = () => {
    const [user, setUser] = useState("")
    const [messages, setMessages] = useState()
    const [nameMessages, setUserMessages] = useState()
    const [userName, setUserName] = useState("aaaa")
    const [pageNumber, setPageNumber] = useState(1)
    const [text, setText] = useState("")
    const [resMessages, setResMessages] = useState("")
    const [userAll, setUserAll] = useState()
    const [boardDisplay, setBoardDisplay] = useState(false)

    const router = useRouter();

    /**
     *ログイン中のユーザー確認
     */
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

    /**
     *メッセージ一覧
     */
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
                console.log(data)
            } else {
                console.error(data);
            }
        } catch (error) {
            console.error("error", error);
        }
    };


    useEffect(() => {
        messageAll();
    }, [pageNumber, resMessages]);

    useEffect(() => {
        fetchUser();
    })
    /**
     *ユーザー一覧
     */
    useEffect(() => {
        const GetUserAll = async () => {
            try {
                const response = await fetch(`http://localhost:3030/users/read`, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                });
                const data = await response.json()

                if (response.ok) {
                    setUserAll(data.documents)
                    console.log(data.documents[3])
                } else {
                    console.error(data);
                }
            } catch (error) {
                console.error("error", error);
            }
        }
        GetUserAll()
    }, []);

    /**
     *ページ遷移
     */
    const pageNext = () => {
        setPageNumber(pageNumber + 1)
        messageAll()
    }
    const pagePrev = () => {
        setPageNumber(pageNumber - 1)
        messageAll()
    }
    const routerTopPage = () => {
        setBoardDisplay(false)
    }
    /**
     *メッセージ作成
     */
    const messageCreate = async () => {
        if (text) {
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
                    console.log("送信完了:", data);
                    setText("")
                    setResMessages("メッセージをを送信しました")
                    await messageAll()
                } else {
                    console.error("送信失敗", data.message);
                    setResMessages(data.message)
                    setText("")
                    await messageAll()

                }

            } catch (error) {
                console.error("error", error);
            }
        } else {
            setResMessages("入力してください")
        }
    };
    /**
     *ユーザーごとのメッセージ一覧
     */
    const userMessages = async (uid) => {
        try {
            const response = await fetch(`http://localhost:3030/messages/${uid}/read?${pageNumber}`, {
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
                console.log(data.user[0].name)
                setUserMessages(data)
                setUserName(data.user[0].name)
                setBoardDisplay(true)
            } else {
                console.error(data);
            }
        } catch (error) {
            console.error("error", error);
        }
    }
    /**
     *ユーザー名をクリックした処理
     */
    const selectMessages = (uMes) => {
        userMessages(uMes.id)
    }

    /**
     *boardsを切り替える
     */
    if (boardDisplay) {
        return (
            <>
                <div className="container">
                    <header>
                        <h1 className="display-4">Boards</h1>
                    </header>

                    {userName ? (
                        <p className="h4">{userName}'s messages</p>
                    ) : (
                        <p className="h4">Loading....</p>
                    )}

                    {resMessages ? (
                        <p className="text-danger">{resMessages}</p>
                    ) : (
                        <></>
                    )}
                    <div>
                        {nameMessages ? (
                            <table className="table mt-5">
                                <tbody className="">
                                {nameMessages.messages.map((val, i) =>
                                    <tr className="row align-items-center mx-auto" key={i}>
                                        <td className="col-2">
                                            <div className="text-dark">
                                                {userName ? (
                                                    <a>
                                                        {userName}
                                                    </a>
                                                ) : (<></>)}
                                            </div>
                                        </td>
                                        <td className="col-7">{val.text}</td>
                                        <td className="col-3">{cdate(val.createdAt).format("YYYY-MM-DD HH:mm:ss")}</td>
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
                    <div className="mt-4">
                        <a className="text-primary" onClick={routerTopPage}>&lt;&lt;Topページへ</a>
                    </div>
                </div>
            </>
        )
    } else {
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
                            <button className="btn btn-primary col-2" type="button" onClick={messageCreate}>送信
                            </button>
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
                                <tbody className="">
                                {messages.map((val, i) =>
                                    <tr className="row align-items-center mx-auto" key={i}>
                                        <td className="col-2">
                                            <div className="text-dark">
                                                {userAll ? (
                                                    <a onClick={() => selectMessages(userAll.find(u => u.id === val.accountId))}>
                                                        {userAll.find(u => u.id === val.accountId).name}
                                                    </a>
                                                ) : (<></>)}
                                            </div>
                                        </td>
                                        <td className="col-7">{val.text}</td>
                                        <td className="col-3">{cdate(val.createdAt).format("YYYY-MM-DD HH:mm:ss")}</td>
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
                    <div className="mt-4">
                        <a className="text-primary" href="./../users/login">&lt;&lt;ログインページへ</a>
                    </div>
                </div>
            </>
        )
    }

};

export default BoardsPage;