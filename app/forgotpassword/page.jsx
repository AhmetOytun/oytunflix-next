"use client"

import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";

const forgotMyPasswordPage = () => {
    const [username, setUsername] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [failMessage, setFailMessage] = useState("");
    const router = useRouter();

    const sendMail = async () => {
        await fetch("api/user/forgotpassword", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                Username: username,
            }),
        }).then((res)=>{
            if(res.status === 200){
                setSuccessMessage("An email has been sent to your email address.");
                setTimeout(() => {
                    router.push("/entertoken");
                }
                , 1000);
            }else{
                setFailMessage("User not found");
            }
        }).catch((err)=>{
            alert("An error occurred");
            console.log(err);
        });
    }
  return (
    <div className="bg-gradient-to-b from-gray-400 to-gray-800 min-h-screen flex flex-col items-center justify-center">
        <FaArrowLeft className="text-white cursor-pointer absolute top-6 left-6 size-6" onClick={() => router.push("/login")} />
        <h1 className=" text-white text-3xl font-bold mb-10">Forgot My Password</h1>
        <label className="text-white font-extralight mb-2">Username</label>
        <input
            className="border-1 border-gray-300 rounded-md p-0.5 w-48 text-center mb-3 mt-1"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
        />
        <button className="text-white font-extralight mt-5" onClick={sendMail}>Send Email</button>
        <p>{successMessage}</p>
        <p>{failMessage}</p>
    </div>
  )
}

export default forgotMyPasswordPage
