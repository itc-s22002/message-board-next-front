"use client";

import React, {useState, useEffect} from "react";

const LoginPage = () => {
    const [name, setName] = useState('');
    const [pass, setPass] = useState('');
    const [resMessages, setResMessages] = useState("")

    const [user, setUser] = useState(null);
    const fetchUser = async () => {
        try {
            const response = await fetch("http://localhost:3030/users",{
                headers: {
                    "Content-Type": "application/json",
                },
                credentials:"include",

            });
            const data = await response.json();

            if (response.ok) {
                setUser(data.user);
                console.log(data)
            } else {
                setUser(null);
                console.log(user)
            }
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    const handleLogin = async () => {
        try {
            const response = await fetch("http://localhost:3030/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials:"include",
                body: JSON.stringify({name: name, pass: pass}),
            });

            if (response.ok) {
                // ログイン成功
                console.log("ログイン成功", response)
                setResMessages("ログイン成功しました")
                setName("")
                setPass("")
            } else {
                // ログイン失敗
                console.error("ログイン失敗", response);
                setResMessages("ログイン失敗しました")
                setPass("")
            }
        } catch (error) {
            console.error("error", error);
        }
    };

    const handleLogout = async () => {
        try {
            const response = await fetch("http://localhost:3030/users/logout", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                // ログアウト成功
                console.log("ログアウトに成功", response)
                setResMessages("ログアウトに成功しました")
                setName("")
                setPass("")
            } else {
                // ログアウト失敗
                console.error("ログアウトに失敗", response);
                setResMessages("ログアウトに失敗しました")
                setName("")
                setPass("")
            }
        } catch (error) {
            console.error("error", error);
            setName("")
            setPass("")
        }
    };
    return (
        <>
            <div className="container">
                <header>
                    <h1 className="display-4">Login</h1>
                </header>
                <form>
                    <div className="mb-3">
                        <label className="form-label" htmlFor="name">NAME</label>
                        <input className="form-control" id="name" type="text" value={name}
                               onChange={(e) => setName(e.target.value)}/>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">PASSWORD</label>
                        <input className="form-control" type="password" value={pass}
                               onChange={(e) => setPass(e.target.value)}/>
                    </div>
                    <button onClick={handleLogin} className="btn btn-primary" type="button">ログイン</button>
                </form>
                {resMessages ? (
                    <p className="text-danger">{resMessages}</p>
                ) : (
                    <></>
                )}
                <div className="mt-4">
                    <a href="./singnup">新規登録ページへ&gt;&gt;</a>

                </div>
                <div className="mt-4">
                    <a href="./../boards">&lt;&lt;Topページへ</a>
                </div>
            </div>
        </>

    );
};

export default LoginPage;
