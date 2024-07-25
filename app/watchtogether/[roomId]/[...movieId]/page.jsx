"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { FaArrowLeft, FaComments } from "react-icons/fa";
import { useRouter, useParams } from "next/navigation";
import Videojs from "@/components/videojs";
import Chat from "@/components/Chat";
import io from "socket.io-client";

const StreamTogetherPage = () => {
  const [movieName, setMovieName] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const { roomId, movieId } = useParams();
  const [token, setToken] = useState(null);
  const [userName, setUserName] = useState("");
  const [chatVisible, setChatVisible] = useState(false);
  const playerRef = useRef(null);
  const socketRef = useRef(null);
  const isSeekingRef = useRef(false);
  const isPlayingRef = useRef(false);
  const waitingForBufferRef = useRef(false);
  const router = useRouter();

  const videojsOptions = useMemo(
    () => ({
      autoplay: true,
      controls: true,
      crossorigin: "anonymous",
      fluid: true,
      aspectRatio: "16:8",
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
        pictureInPictureToggle: false,
      },
    }),
    [movieId, userId]
  );

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
      false
    );

    player.addRemoteTextTrack(
      {
        kind: "captions",
        label: "Turkish",
        src: `/subtitles/${movieId}-tr.vtt`,
        srclang: "tr",
        default: false,
      },
      false
    );

    player.on("play", () => {
      if (!isPlayingRef.current) {
        isPlayingRef.current = true;
        socketRef.current.emit("video-event", { type: "play", roomId });
      }
    });

    player.on("pause", () => {
      if (isPlayingRef.current) {
        isPlayingRef.current = false;
        socketRef.current.emit("video-event", { type: "pause", roomId });
      }
    });

    player.on("seeked", () => {
      if (!isSeekingRef.current) {
        isSeekingRef.current = true;
        waitingForBufferRef.current = true;
        socketRef.current.emit("video-event", {
          type: "seek",
          roomId,
          currentTime: player.currentTime(),
        });
      }
      isSeekingRef.current = false;
    });

    player.on("canplay", () => {
      if (waitingForBufferRef.current) {
        waitingForBufferRef.current = false;
        socketRef.current.emit("video-event", { type: "ready", roomId });
      }
    });

    socketRef.current.on("video-event", (data) => {
      if (data.type === "play") {
        if (!isPlayingRef.current) {
          isPlayingRef.current = true;
          player.play();
        }
      } else if (data.type === "pause") {
        if (isPlayingRef.current) {
          isPlayingRef.current = false;
          player.pause();
        }
      } else if (data.type === "seek") {
        isSeekingRef.current = true;
        player.currentTime(data.currentTime);
        player.pause();
      } else if (data.type === "resume") {
        player.play();
      }
    });
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
        setUserName(userData.Username);

        const movieResponse = await fetch(`/api/library`, {
          headers: {
            "X-Auth-Token": storedToken,
          },
        });
        const movieData = await movieResponse.json();
        const movie = movieData.find((movie) => movie._id === movieId);
        if (movie) {
          setMovieName(movie.MovieName);
        }

        setLoading(false);

        // Initialize socket connection and join room after fetching user info
        socketRef.current = io();
        socketRef.current.emit("join-room", {
          roomId,
          username: userData.Username,
        });

      } catch (error) {
        console.error("Error fetching user or movie data:", error);
      }
    };

    fetchUserInfo();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [movieId, roomId]);

  const handleArrowClick = () => {
    router.push("/library");
  };

  const toggleChatVisibility = () => {
    setChatVisible((prevVisible) => !prevVisible);
  };

  if (loading) {
    return <div className="bg-black w-screen h-screen">Loading...</div>;
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-black">
      <div className="h-full w-full pt-[15rem] sm:pt-5 relative">
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
          <div
            className="absolute top-5 right-5 cursor-pointer"
            onClick={toggleChatVisibility}
          >
            <FaComments className="m-3" size={30} color="white" />
          </div>
          <Chat socket={socketRef.current} userName={userName} visible={chatVisible} />
        </div>
      </div>
    </div>
  );
};

export default StreamTogetherPage;
