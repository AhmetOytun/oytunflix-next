"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";

const enterTokenPage = () => {
    const [token, setToken] = useState("");
    const [password, setPassword] = useState("");
    const [failMessage, setFailMessage] = useState("");
    const router = useRouter();

    const verifyToken = async () => {
        await fetch("api/user/verifytoken", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                Token: token,
                Password: password,
            }),
        }).then((res)=>{
            if(res.status === 200){
                localStorage.removeItem("X-Auth-Token");
                router.push("/login");
            }else{
                setFailMessage("Token is invalid");
            }
        }).catch((err)=>{
            alert("An error occurred");
            console.log(err);
        });

    }

  return (
    <div className="bg-gradient-to-b from-gray-400 to-gray-800 min-h-screen flex flex-col items-center justify-center">
        <FaArrowLeft className="text-white cursor-pointer absolute top-6 left-6 size-6" onClick={() => router.push("/login")} />
        <h1 className=" text-white text-3xl font-bold mb-10">Enter Token</h1>
        <label className="text-white font-extralight mb-2">New Password</label>
        <input
            className="border-1 border-gray-300 rounded-md p-0.5 w-48 text-center mb-3 mt-1"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />
        <label className="text-white font-extralight mb-2">Token</label>
        <input
            className="border-1 border-gray-300 rounded-md p-0.5 w-48 text-center mb-3 mt-1"
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
        />
        <button className="text-white font-extralight mt-5" onClick={verifyToken}>Verify Token</button>
        <p>{failMessage}</p>
    </div>
  )
}

export default enterTokenPage
