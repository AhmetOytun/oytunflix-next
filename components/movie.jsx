"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FaPlay } from "react-icons/fa"; // Import FaPlay icon from FontAwesome

export default function Movie({
  movieName,
  movieSmallImage,
  movieScreenshots,
  movieId,
  movieDuration,
  movieStars,
  movieDirector,
  movieYear,
  movieGenre,
  movieDescription,
}) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [isWindowOpen, setIsWindowOpen] = useState(false);
  const [currentScreenshotIndex, setCurrentScreenshotIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);

  useEffect(() => {
    let images = [];

    if (isWindowOpen) {
      setIsLoading(true);
      const preloadImages = (imageUrls) => {
        let loadedImages = 0;
        images = imageUrls.map((url, index) => {
          const img = new Image();
          img.src = `/screenshots/${url}`;
          img.onload = () => {
            loadedImages += 1;
            if (loadedImages === imageUrls.length) {
              setAllImagesLoaded(true);
              setIsLoading(false);
            }
          };
          return img;
        });
      };

      preloadImages(movieScreenshots);

      return () => {
        images.forEach((img) => {
          img.onload = null;
        });
      };
    }
  }, [isWindowOpen, movieScreenshots]);

  useEffect(() => {
    if (isWindowOpen && allImagesLoaded) {
      const interval = setInterval(() => {
        setCurrentScreenshotIndex(
          (prevIndex) => (prevIndex + 1) % movieScreenshots.length
        );
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isWindowOpen, allImagesLoaded, movieScreenshots.length]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleMovieClick = () => {
    setIsWindowOpen(true);
  };

  const closeWindow = () => {
    setIsWindowOpen(false);
  };

  const handlePlayClick = () => {
    router.push(`/stream/${movieId}`);
  };

  return (
    <>
      <div
        className="rounded-lg w-[21rem] h-[11rem] md:w-[21rem] md:h-[12rem] lg:w-[20rem] lgh-[12rem] xl:w-[24rem] xl:h-[13rem] bg-gray-500 flex flex-col justify-end items-center relative"
        onClick={handleMovieClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: isHovered || isWindowOpen ? "pointer" : "auto" }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center rounded-lg z-0"
          style={{
            backgroundImage: `url('/images/${movieSmallImage}')`,
            opacity: isHovered ? "0.8" : "0.5",
            transition: "opacity 0.3s ease-in-out",
            transitionDelay: isHovered ? "0.05s" : "0s",
          }}
        ></div>
        <h1
          className="mb-4 font-sans font-bold text-xl text-white z-10"
          style={{
            opacity: isHovered ? "0.5" : "1",
            transition: "opacity 0.3s ease-in-out",
            transitionDelay: isHovered ? "0s" : "0.05s",
          }}
        >
          {movieName}
        </h1>
      </div>

      {isWindowOpen && (
        <>
          <div
            className="fixed inset-0 bg-black opacity-90 z-40"
            onClick={closeWindow}
          ></div>

          {isLoading ? (
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-700 rounded-md z-50 p-1 text-white text-center">
              <div className="rounded-md overflow-hidden relative ml-[0.2rem] w-[22rem] h-[12rem] md:w-[46rem] md:h-[28rem] lg:w-[60rem] lg:h-[35rem] xl:w-[68rem] xl:h-[38rem]">
                <p>Loading Images...</p>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <FaPlay
                    size={60}
                    className="cursor-pointer w-10 md:w-20 md:h-14 lg:w-36 lg:h-24 xl:w-44 xl:h-32 opacity-80"
                    onClick={handlePlayClick}
                  />{" "}
                  {/* Play icon */}
                </div>
                <div
                  className="absolute bottom-0 left-0 p-4 bg-black bg-opacity-70 text-white"
                  style={{
                    width: "auto",
                    textAlign: "left",
                  }}
                >
                  <h1 className="font-sans font-bold text-xl">{movieName}</h1>
                </div>
              </div>
              <div className="mt-2 flex flex-col items-center justify-evenly md:flex-row">
                <div>Length: {movieDuration}</div>
                <div>Imdb: {movieStars}</div>
                <div>Director: {movieDirector}</div>
                <div>Year: {movieYear}</div>
                <div>Genre: {movieGenre}</div>
              </div>
              <p className="pt-3 pb-3">{movieDescription}</p>
            </div>
          ) : (
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-700 rounded-md z-50 p-1 text-white text-center">
              <div
                className="rounded-md overflow-hidden relative ml-[0.2rem] w-[22rem] h-[12rem] md:w-[46rem] md:h-[28rem] lg:w-[60rem] lg:h-[35rem] xl:w-[68rem] xl:h-[38rem]"
                style={{
                  transition: "background-image 2s ease-in-out",
                  backgroundImage: `url('/screenshots/${movieScreenshots[currentScreenshotIndex]}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <FaPlay
                    size={60}
                    className="cursor-pointer w-10 md:w-20 md:h-14 lg:w-36 lg:h-24 xl:w-44 xl:h-32 opacity-80"
                    onClick={handlePlayClick}
                  />{" "}
                  {/* Play icon */}
                </div>
                <div
                  className="absolute bottom-0 left-0 p-4 bg-black bg-opacity-70 text-white"
                  style={{
                    width: "auto",
                    textAlign: "left",
                  }}
                >
                  <h1 className="font-sans font-bold text-xl">{movieName}</h1>
                </div>
              </div>
              <div className="mt-2 flex flex-col items-center justify-evenly md:flex-row">
                <div>Length: {movieDuration}</div>
                <div>Imdb: {movieStars}</div>
                <div>Director: {movieDirector}</div>
                <div>Year: {movieYear}</div>
                <div>Genre: {movieGenre}</div>
              </div>
              <p className="pt-3 pb-3">{movieDescription}</p>
            </div>
          )}
        </>
      )}
    </>
  );
}
