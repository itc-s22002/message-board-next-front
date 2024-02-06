"use client";

import React, {useState, useEffect} from "react";


const SingUpPage = () => {
    const [name, setName] = useState('');
    const [pass, setPass] = useState('');
    const [resMessages, setResMessages] = useState("")

    /**
     *新規登録処理
     */

    const handleSignup = async () => {
        try {
            const response = await fetch("http://localhost:3030/users/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, pass }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("新規登録完了:", data.message);
                setResMessages("ユーザー登録をしました")
            } else {
                console.error("新規登録失敗", data.message);
                setResMessages("ユーザー登録を失敗しました")

            }
        } catch (error) {
            console.error("error", error);
        }
    };

    return (
        <>
            <div className="container">
                <header>
                    <h1 className="display-4">SingUp</h1>
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
                    <button onClick={handleSignup} className="btn btn-primary" type="button">新規登録</button>
                </form>
                {resMessages ? (
                    <p className="text-danger">{resMessages}</p>
                ) : (
                    <></>
                )}
                <div className="mt-4">
                    <a href="./login">&lt;&lt;ログインページへ</a>
                </div>
            </div>
        </>
    );
};

export default SingUpPage;
