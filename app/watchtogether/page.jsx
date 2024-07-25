"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";

const watchtogetherPage = () => {
  const [movieId, setMovieId] = useState("");
  const [roomId, setRoomId] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [failMessage, setFailMessage] = useState("");
  const [movies, setMovies] = useState([]);
  const [token, setToken] = useState(null);
  const router = useRouter();
  const roomIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

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

  const handleJoin = (e) => {
    e.preventDefault();
    if (!movieId || !roomId) {
      setFailMessage("Please select a movie and a room");
      return;
    }

    router.push(`/watchtogether/${roomId}/${movieId}`);
  };
  return (
    <div className="bg-gradient-to-b from-gray-400 to-gray-800 min-h-screen flex flex-col items-center justify-center">
      <FaArrowLeft
        className="text-white cursor-pointer absolute top-6 left-6 size-6"
        onClick={() => router.push("/library")}
      />
      <h1 className="text-4xl mb-8 font-bold text-gray-100">Watch2Gether</h1>

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
        <select
          value={roomId}
          onChange={(e) => {
            setRoomId(e.target.value);
          }}
          className="p-2 rounded-md bg-gray-100 text-gray-800 mb-4 w-[18rem]"
        >
          <option value="" disabled>
            Select a room
          </option>
          {roomIds.map((roomId) => (
            <option key={roomId} value={roomId}>
              {roomId}
            </option>
          ))}
        </select>
        {failMessage && !successMessage && (
          <p className="text-red-500 mt-3">{failMessage}</p>
        )}
      </form>
      <button
        type="submit"
        onClick={(e) => handleJoin(e)}
        className="bg-blue-400 text-gray-800 p-2 rounded-md w-[18rem] my-5"
      >
        Join Room
      </button>
    </div>
  );
};

export default watchtogetherPage;
