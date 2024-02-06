"use client";

import React, {useState, useEffect} from "react";
import {useRouter} from "next/navigation";


const LoginPage = () => {
    const [name, setName] = useState('');
    const [pass, setPass] = useState('');
    const [resMessages, setResMessages] = useState("")
    const [user, setUser] = useState(null);

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
    useEffect(() => {
        fetchUser()
    }, []);

    /**
     *ログイン処理
     */
    const handleLogin = async () => {
        try {
            const response = await fetch("http://localhost:3030/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({name: name, pass: pass}),
            });

            if (response.ok) {
                // ログイン成功
                console.log("ログイン成功", response)
                // setResMessages("ログインしました")
                await router.push("./../../boards")
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
    /**
     *トップベージに遷移処理
     */
    const routerTopPage = () =>{
        if(user){
            router.push("./../boards")
        }else {
            setResMessages("ログインしてください")
        }
    }
    /**
     *ログアウト処理
     */
    const handleLogout = async () => {
        try {
            const response = await fetch("http://localhost:3030/users/logout", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include"
            });

            if (response.ok) {
                // ログアウト成功
                console.log("ログアウトに成功", response)
                fetchUser()
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
                    <div className="d-grid gap-2 d-md-block">
                        <button onClick={handleLogin} className="btn btn-primary m-1" type="button">ログイン</button>
                        {user?(
                            <button onClick={handleLogout} className="btn btn-primary m-1"
                                    type="button">ログアウト
                            </button>
                        ):(
                            <></>
                        )}
                    </div>
                </form>
                {resMessages ? (
                    <p className="text-danger">{resMessages}</p>
                ) : (
                    <></>
                )}
                <div className="mt-4">
                    <a className="text-primary" onClick={routerTopPage}>&lt;&lt;Topページへ戻る</a>
                    &nbsp; | &nbsp;
                    <a href="./singnup">新規登録ページへ&gt;&gt;</a>
                </div>
            </div>
        </>

    );
};

export default LoginPage;
