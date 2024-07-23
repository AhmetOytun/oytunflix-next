"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";

const uploadSubtitlePage = () => {
  const router = useRouter();
  const [subtitle, setSubtitle] = useState(null);
  const [movieId, setMovieId] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [failMessage, setFailMessage] = useState("");
  const [movies, setMovies] = useState([]);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("X-Auth-Token");
    if (!storedToken) {
      router.push("/login");
    } else {
      setToken(storedToken);
    }
  }, [router]);

  useEffect(() => {
    if (token) {
      fetchMovies();
    }
  }, [token]);


  const fetchMovies = async () => {
    try {
      const response = await fetch("/api/library", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": token,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setMovies(data);
      } else {
        console.error("Failed to fetch movies");
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const handleSubtitleUpload = async (e) => {
    e.preventDefault();
    if (!movieId || !subtitle) {
      setFailMessage("Please select a movie and a subtitle file");
      return;
    }
    const formData = new FormData();
    formData.append("subtitles", subtitle);
    formData.append("movieId", movieId);
    try {
      const response = await fetch(
        "/api/upload/subtitles",
        {
          method: "POST",
          headers: {
            "X-Auth-Token": token,
          },
          body: formData,
        }
      );
      if (response.ok) {
        setSuccessMessage("Subtitle uploaded successfully");
        setTimeout(() => {
          setSuccessMessage("");
          router.push("/");
        }, 2000);
      } else {
        setFailMessage("Failed to upload subtitle");
      }
    } catch (error) {
      console.error("Error uploading subtitle:", error);
      setFailMessage("Failed to upload subtitle");
    }
  };
  return (
    <div className="bg-gradient-to-b from-gray-400 to-gray-800 min-h-screen flex flex-col items-center justify-center">
      <FaArrowLeft
        className="text-white cursor-pointer absolute top-6 left-6 size-6"
        onClick={() => router.push("/upload")}
      />
      <h1 className="text-4xl mb-8 font-bold text-gray-100">
        Upload Subtitles
      </h1>

      <form className="flex flex-col items-center">
        <select
          value={movieId}
          onChange={(e) => {
            setMovieId(e.target.value);
          }}
          className="p-2 rounded-md bg-gray-100 text-gray-800 mb-4 w-[18rem]"
        >
          <option value="" disabled>
            Select a movie
          </option>
          {movies.map((movie) => (
            <option key={movie._id} value={movie._id}>
              {movie.MovieName}
            </option>
          ))}
        </select>
        <label className="bg-blue-500 text-white p-2 rounded-md cursor-pointer w-[18rem] my-5 text-center">
          Select Subtitle File
          <input
            type="file"
            accept=".vtt , .srt"
            onChange={(e) => setSubtitle(e.target.files[0])}
            className="hidden"
          />
        </label>
        <button
          type="submit"
          onClick={(e) => handleSubtitleUpload(e)}
          className="bg-blue-400 text-gray-800 p-2 rounded-md w-[18rem] my-5"
        >
          Upload Subtitles
        </button>
        <p className=" text-blue-300">Subtitles must be in english.</p>
        {failMessage && !successMessage && (
          <p className="text-red-500 mt-3">{failMessage}</p>
        )}
        {successMessage && (
          <p className="text-green-500 mt-3">{successMessage}</p>
        )}
      </form>
    </div>
  );
};

export default uploadSubtitlePage;
