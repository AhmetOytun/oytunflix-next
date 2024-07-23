"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";
import {FaArrowLeft} from "react-icons/fa";

export default function registerPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [failMessage, setFailMessage] = useState("");
    const router = useRouter();

    async function handleRegister(e){
        e.preventDefault();
        await fetch("api/user/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                Username: username,
                Password: password,
                Name: name,
                Surname: surname,
                Email: email,
            }),
        }).then((res)=>{
            if(res.status === 200){
                setSuccessMessage("You have successfully registered.");
                setTimeout(() => {
                    router.push("/login");
                }, 1000); // navigate after 1 second
            }else{
                setFailMessage("User already exists");
            }
        }).catch((err)=>{
            alert("An error occurred");
            console.log(err);
        });
    }

  return (
    
    <div className="bg-gradient-to-b from-gray-400 to-gray-800 min-h-screen flex flex-col items-center justify-center">
        <FaArrowLeft className="text-white cursor-pointer absolute top-6 left-6 size-6" onClick={() => router.push("/")} /> {/* Adding arrow icon */}
      <h1 className="text-4xl mb-8 font-bold text-gray-100">Register</h1>
      <form className="flex flex-col items-center">
        <label>Username</label>
        <input
          className="border-1 border-gray-300 rounded-md p-0.5 w-48 text-center mb-3 mt-1"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label>Password</label>
        <input
          className="border-1 border-gray-300 rounded-md p-0.5 w-48 text-center mb-3 mt-1"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label>Name</label>
        <input
          className="border-1 border-gray-300 rounded-md p-0.5 w-48 text-center mb-3 mt-1"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label>Surname</label>
        <input
          className="border-1 border-gray-300 rounded-md p-0.5 w-48 text-center mb-3 mt-1"
          type="text"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
        />
        <label>Email</label>
        <input
          className="border-1 border-gray-300 rounded-md p-0.5 w-48 text-center mb-3 mt-1"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className=" bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md p-1 w-32 mt-3" onClick={(e)=>handleRegister(e)}>Register</button>
        {successMessage && <p className="text-green-500 mt-3">{successMessage}</p>}
        {(failMessage && !successMessage) && <p className="text-red-500 mt-3">{failMessage}</p>}
      </form>
    </div>
  );
}

