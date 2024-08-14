"use client";

import { useEffect, useRef, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter, useParams } from "next/navigation";
import Videojs from "@/components/videojs";

const streamPage = () => {
  const [movieName, setMovieName] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const { movieId } = useParams();
  const playerRef = useRef(null);
  const router = useRouter();
  const [token, setToken] = useState(null);
  const videojsOptions = {
    autoplay: true,
    controls: true,
    crossorigin: "anonymous",
    fluid: true,
    aspectRatio: "16:9",
    sources: [
      {
        src: `/api/${movieId}/${userId}`,
        type: "video/mp4",
      },
    ],
    controlBar: {
      volumePanel: {
        inline: false,
      },
    },
  };

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    player.addRemoteTextTrack(
      {
        kind: "captions",
        label: "English",
        src: `/subtitles/${movieId}-en.vtt`,
        srclang: "en",
        default: true,
      },
    );

    player.addRemoteTextTrack(
      {
        kind: "captions",
        label: "Turkish",
        src: `/subtitles/${movieId}-tr.vtt`,
        srclang: "tr",
        default: false,
      },
    );
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("X-Auth-Token");
    setToken(storedToken);
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("/api/user/info", {
          method: "GET",
          headers: {
            "X-Auth-Token": storedToken,
          },
        });
        const userData = await response.json();
        setUserId(userData._id);

        const movieResponse = await fetch(
          `/api/library`,
          {
            method: "GET",
            headers: {
              "X-Auth-Token": storedToken,
            },
          }
        );
        const movieData = await movieResponse.json();
        movieData.map(movie => {
            if (movie._id === movieId[0]) {
                setMovieName(movie.MovieName);
            }   
        })

        setLoading(false);
      } catch (error) {
        console.error("Error fetching user or movie data:", error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleArrowClick = () => {
    router.push("/library");
  };

  if (loading) {
    return <div className="bg-black w-screen h-screen">Loading...</div>;
  }
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-black">
      <div className="w-[90%]">
        <Videojs options={videojsOptions} onReady={handlePlayerReady} />
        <div>
          <div className="absolute top-8 left-20">
            <h1 className="text-white text-xl">{movieName}</h1>
          </div>
          <div
            className="absolute top-5 left-5 cursor-pointer"
            onClick={handleArrowClick}
          >
            <FaArrowLeft className="m-3" size={30} color="white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default streamPage;
