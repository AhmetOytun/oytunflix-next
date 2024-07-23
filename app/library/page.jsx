"use client";

import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Movie from "@/components/Movie";

export default function libraryPage() {
  const router = useRouter();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [accordionOpen, setAccordionOpen] = useState(false);
  const [profilePicWindowOpen, setProfilePicWindowOpen] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("X-Auth-Token");
    setToken(storedToken);

    if (!storedToken) {
      router.push("/login");
    } else {
      fetchMovies(storedToken);
      fetchUserInfo(storedToken);
    }
  }, []);

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const fetchMovies = async (token) => {
    try {
      setLoading(true);
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
      }else if(response.status == 401){
        localStorage.removeItem("X-Auth-Token");
        router.push("/login");
      } else {
        console.error("Failed to fetch movies");
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserInfo = async (token) => {
    try {
      const response = await fetch("/api/user/info", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": token,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUserInfo(data);
      }else if(response.status == 401){
        localStorage.removeItem("X-Auth-Token");
        router.push("/login");
      } else {
        console.error("Failed to fetch user info");
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const filteredMovies = movies.filter((movie) =>
    movie.MovieName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
    setAccordionOpen(e.target.value.length > 0);
  };

  const handleMovieClick = (movieId) => {
    router.push(`/stream/${movieId}`);
  };

  const toggleProfilePicWindow = () => {
    setProfilePicWindowOpen(!profilePicWindowOpen);
  };

  const handleProfilePicChange = (newPicUrl) => {
    setUserInfo((prev) => ({ ...prev, profilePic: newPicUrl }));
    setProfilePicWindowOpen(false);
  };

  return (
    <div className="bg-gradient-to-t from-gray-400 to-gray-800 min-h-screen">
      <nav className="flex flex-col lg:flex-row lg:items-center justify-between p-5">
        <h1 className="text-4xl font-bold text-gray-100 text-center lg:text-start">Oytunflix</h1>
        <div className="flex flex-row items-center text-white relative justify-center py-5">
          <input
            className="bg-gray-600 p-2 mr-4 rounded-md"
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchInputChange} // Update search query state
          />
          <FaSearch className="text-white cursor-pointer size-5 mb-2 mt-3" />
          {accordionOpen && (
            <div className="absolute top-full mt-2 w-full bg-gray-700 rounded-md shadow-lg z-10">
              {filteredMovies.length > 0 ? (
                <ul className="max-h-64 overflow-y-auto">
                  {filteredMovies.map((movie) => (
                    <li
                      key={movie._id}
                      className="p-2 hover:bg-gray-600 cursor-pointer text-white"
                      onClick={() => handleMovieClick(movie._id)}
                    >
                      {movie.MovieName}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-white text-center p-2">No movies found</p>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-row justify-evenly py-5">
        <Link
          href="/upload"
          className="text-white font-thin flex flex-row items-center justify-between md:pr-8"
        >
          Upload
        </Link>
        <Link
          href="/watchtogether"
          className="text-white font-thin flex flex-row items-center justify-between md:pr-8"
        >
          Watch2Gether
        </Link>
        </div>
        <div className="flex flex-row gap-12 items-center justify-center">
          <p className="text-white font-thin">Welcome Again {userInfo.Name}</p>
          <div>
            <div className="relative">
              <div
                className="border-2 border-gray-500 rounded-md mb-2 h-15 w-15 flex items-center justify-center"
                onClick={toggleProfilePicWindow}
              >
                <img
                  className="rounded-md h-14 w-14 hover:cursor-pointer"
                  src={userInfo.profilePic || "https://samurai-gamers.com/wp-content/uploads/2023/09/sg-p5t-mona-character-icon.png"} //must be 200x200
                  alt="Avatar"
                />
              </div>
              {profilePicWindowOpen && (
                <div className="absolute top-full mt-2 w-40 bg-gray-700 rounded-md shadow-lg z-10 p-2">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <img
                      key={i}
                      src={`https://via.placeholder.com/200?text=Profile+${i}`}
                      className="rounded-md h-10 w-10 cursor-pointer mb-1"
                      alt={`Profile ${i}`}
                      onClick={() => handleProfilePicChange(`https://via.placeholder.com/200?text=Profile+${i}`)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="p-5">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div role="status">
              <svg
                aria-hidden="true"
                className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="grid gap-y-20 place-items-center items-center justify-center sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {movies.map((movie) => (
              <Movie
                key={movie._id}
                movieName={movie.MovieName}
                movieId={movie._id}
                movieStars={movie.MovieStars}
                movieDescription={movie.MovieDescription}
                movieDirector={movie.MovieDirector}
                movieGenre={movie.MovieGenre}
                movieYear={movie.MovieYear}
                movieDuration={formatDuration(movie.MovieDuration)}
                movieSmallImage={movie.MovieSmallImage}
                movieScreenshots={movie.MovieScreenshots}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
