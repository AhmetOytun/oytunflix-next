"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";

export default function UploadPage() {
  const router = useRouter();

  const handleArrowClick = () => {
    router.push("/library");
  };

  useEffect(() => {
    const token = localStorage.getItem("X-Auth-Token");
    if (!token) {
      router.push("/login");
    }
  }, []);

  return (
    <div className="bg-gradient-to-b from-gray-400 to-gray-800 min-h-screen flex flex-col items-center justify-center">
      <div className="flex flex-row gap-12">
        <Link
          href="/upload/movie"
          className="text-white font-thin flex flex-row items-center justify-between"
        >
          Upload Movie
        </Link>
        <Link
          href="/upload/subtitles"
          className="text-white font-thin flex flex-row items-center justify-between"
        >
          Upload Subtitles
        </Link>
        <div
          className="absolute top-5 left-5 cursor-pointer"
          onClick={handleArrowClick}
        >
          <FaArrowLeft className="m-3" size={30} color="white" />
        </div>
      </div>
    </div>
  );
}
