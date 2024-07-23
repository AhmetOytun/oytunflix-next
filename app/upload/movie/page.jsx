"use client";

import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";

function uploadMoviePage() {
  const [movieName, setMovieName] = useState("");
  const [movieYear, setMovieYear] = useState("");
  const [movieGenre, setMovieGenre] = useState("");
  const [movieDescription, setMovieDescription] = useState("");
  const [movieDirector, setMovieDirector] = useState("");
  const [movieFile, setMovieFile] = useState(null);
  const [movieCountry, setMovieCountry] = useState("");
  const [imdbRating, setImdbRating] = useState("");
  const [fileError, setFileError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [MovieSmallImage, setMovieSmallImage] = useState(null);
  const [MovieDuration, setMovieDuration] = useState(0);
  const [token, setToken] = useState(null);
  const router = useRouter();

  const countries = [
    "Afghanistan",
    "Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bhutan",
    "Bolivia",
    "Bosnia and Herzegovina",
    "Botswana",
    "Brazil",
    "Brunei",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cabo Verde",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Central African Republic",
    "Chad",
    "Chile",
    "China",
    "Colombia",
    "Comoros",
    "Congo, Democratic Republic of the",
    "Congo, Republic of the",
    "Costa Rica",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Czech Republic",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Eswatini",
    "Ethiopia",
    "Fiji",
    "Finland",
    "France",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Greece",
    "Grenada",
    "Guatemala",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Honduras",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Korea, North",
    "Korea, South",
    "Kosovo",
    "Kuwait",
    "Kyrgyzstan",
    "Laos",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Mauritania",
    "Mauritius",
    "Mexico",
    "Micronesia",
    "Moldova",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Morocco",
    "Mozambique",
    "Myanmar",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "North Macedonia",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Palestine",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Poland",
    "Portugal",
    "Qatar",
    "Romania",
    "Russia",
    "Rwanda",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Vincent and the Grenadines",
    "Samoa",
    "San Marino",
    "Sao Tome and Principe",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Sudan",
    "Spain",
    "Sri Lanka",
    "Sudan",
    "Suriname",
    "Sweden",
    "Switzerland",
    "Syria",
    "Taiwan",
    "Tajikistan",
    "Tanzania",
    "Thailand",
    "Timor-Leste",
    "Togo",
    "Tonga",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "United States",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Vatican City",
    "Venezuela",
    "Vietnam",
    "Yemen",
    "Zambia",
    "Zimbabwe",
  ];

  const genres = [
    "Action",
    "Adventure",
    "Animation",
    "Biography",
    "Comedy",
    "Crime",
    "Documentary",
    "Drama",
    "Family",
    "Fantasy",
    "Film Noir",
    "History",
    "Horror",
    "Music",
    "Musical",
    "Mystery",
    "Romance",
    "Sci-Fi",
    "Short",
    "Sport",
    "Superhero",
    "Thriller",
    "War",
    "Western",
  ];

  const validVideoTypes = [
    "video/avi",
    "video/mov",
    "video/mpeg",
    "video/webm",
    "video/mp4",
    "video/quicktime",
    "video/x-matroska",
    "video/x-msvideo",
    "video/mp2t",
  ];

  const validExtensions = [
    "avi",
    "mov",
    "mpeg",
    "webm",
    "mp4",
    "quicktime",
    "mkv",
    "avi",
    "ts",
  ];

  function isValidVideo(file) {
    const fileTypeValid = validVideoTypes.includes(file.type);
    const fileExtension = file.name.split(".").pop().toLowerCase();
    const fileExtensionValid = validExtensions.includes(fileExtension);

    return fileTypeValid || fileExtensionValid;
  }

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1500 + 1 },
    (v, k) => currentYear - k
  );

  const handleRatingChange = (e) => {
    const value = e.target.value;
    if (value === "" || (parseFloat(value) >= 0 && parseFloat(value) <= 10)) {
      setImdbRating(value);
    }
  };

  const handleMovieFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (isValidVideo(file)) {
        setFileError("");

        const video = document.createElement("video");
        video.preload = "metadata";
        video.onloadedmetadata = () => {
          const duration = Math.round(video.duration);
          setMovieDuration(duration);
        };
        video.src = URL.createObjectURL(file);

        setMovieFile(file);
      } else {
        setFileError(
          "Your file is not a valid video file. Please upload a valid video file."
        );
      }
    }
  };

  const handleSmallPictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png"
      ) {
        setFileError("");
        setMovieSmallImage(file);
      } else {
        setFileError(
          "Only JPG, JPEG or PNG files are allowed for the small picture."
        );
      }
    }
  };

  async function handleImageUploads() {
    if (!MovieSmallImage) {
      setFileError("All fields are required");
      return Promise.reject("All fields are required");
    }
    setFileError("");
    const formData = new FormData();
    formData.append("smallImage", MovieSmallImage);

    try {
      const response = await fetch(
        "/api/upload/images",
        {
          method: "POST",
          headers: {
            "X-Auth-Token": token,
          },
          body: formData,
        }
      );
      const data = await response.json();
      return Promise.resolve(data);
    } catch (error) {
      console.error("Error uploading images:", error);
      setFileError("Error uploading images");
      return Promise.reject(error);
    }
  }

  async function handleMovieUpload(e) {
    e.preventDefault();
    if (
      !movieFile ||
      !movieName ||
      !movieYear ||
      !movieGenre ||
      !movieDescription ||
      !movieDirector ||
      !movieCountry ||
      !imdbRating ||
      !MovieSmallImage
    ) {
      setFileError("All fields are required");
      return;
    }
    setFileError("");
    setIsUploading(true);

    try {
      const imageData = await handleImageUploads();
      const chunkSize = 10 * 1024 * 1024; // 10MB (adjust based on your requirements)
      const totalChunks = Math.ceil(movieFile.size / chunkSize);
      const chunkProgress = 100 / totalChunks;
      let chunkNumber = 0;
      let start = 0;
      let end = Math.min(chunkSize, movieFile.size);

      const uploadNextChunk = async () => {
        if (chunkNumber < totalChunks) {
          const chunk = movieFile.slice(start, end);
          const formData = new FormData();
          formData.append("movie", chunk);
          formData.append("chunkNumber", chunkNumber);
          formData.append("totalChunks", totalChunks);
          formData.append("originalname", movieFile.name);
          formData.append("MovieName", movieName);
          formData.append("MovieYear", movieYear);
          formData.append("MovieGenre", movieGenre);
          formData.append("MovieDescription", movieDescription);
          formData.append("MovieDirector", movieDirector);
          formData.append("MovieCountry", movieCountry);
          formData.append("MovieStars", imdbRating);
          formData.append("MovieSmallImage", imageData.smallImage);
          formData.append("MovieDuration", MovieDuration);

          fetch("/api/upload/movies", {
            method: "POST",
            headers: {
              "X-Auth-Token": token,
            },
            body: formData,
          })
            .then((response) => response.json())
            .then(() => {
              setUploadProgress(Number((chunkNumber + 1) * chunkProgress));
              chunkNumber++;
              start = end;
              end = Math.min(start + chunkSize, movieFile.size);
              uploadNextChunk();
            })
            .catch((error) => {
              console.error("Error uploading chunk:", error);
            });
        } else {
          setUploadProgress(100);
          setMovieFile(null);
          setSuccessMessage("File upload completed");
          setIsUploading(false);
          setTimeout(() => {
            router.push("/library");
          }, 1000);
        }
      };

      uploadNextChunk();
    } catch (error) {
      setIsUploading(false);
    }
  }

  const handleArrowClick = () => {
    router.push("/upload");
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("X-Auth-Token");
    setToken(storedToken);

    if (!storedToken) {
      router.push("/login");
    }
  }, []);

  return <div className="bg-gradient-to-b from-gray-400 to-gray-800 min-h-screen flex flex-col items-center justify-center text-center">
  <h1 className="text-4xl mb-8 font-bold text-gray-100 mt-5">Add Movie</h1>
  <form className="flex flex-col gap-4 w-80">
    <input
      type="text"
      placeholder="Movie Name"
      value={movieName}
      onChange={(e) => setMovieName(e.target.value)}
      className="p-2 rounded-md"
    />
    <select
      value={movieYear}
      onChange={(e) => setMovieYear(e.target.value)}
      className="p-2 rounded-md"
    >
      <option value="">Select Year</option>
      {years.map((year) => (
        <option key={year} value={year}>
          {year}
        </option>
      ))}
    </select>
    <select
      value={movieGenre}
      onChange={(e) => setMovieGenre(e.target.value)}
      className="p-2 rounded-md"
    >
      <option value="">Select Genre</option>
      {genres.map((genre) => (
        <option key={genre} value={genre}>
          {genre}
        </option>
      ))}
    </select>
    <textarea
      placeholder="Movie Description"
      value={movieDescription}
      onChange={(e) => setMovieDescription(e.target.value)}
      className="p-2 rounded-md resize-none h-32"
    ></textarea>
    <input
      type="text"
      placeholder="Movie Director"
      value={movieDirector}
      onChange={(e) => setMovieDirector(e.target.value)}
      className="p-2 rounded-md"
    />
    <select
      value={movieCountry}
      onChange={(e) => setMovieCountry(e.target.value)}
      className="p-2 rounded-md"
    >
      <option value="">Select Country</option>
      {countries.map((country) => (
        <option key={country} value={country}>
          {country}
        </option>
      ))}
    </select>
    <input
      type="number"
      step="0.1"
      min="0"
      max="10"
      placeholder="IMDB Rating"
      value={imdbRating}
      onChange={handleRatingChange}
      className="p-2 rounded-md"
    />
    <label className="bg-blue-500 text-white p-2 rounded-md cursor-pointer">
        {MovieSmallImage ? MovieSmallImage.name : "Upload Small Picture"}
        <input
            type="file"
            onChange={handleSmallPictureChange}
            className="hidden"
        />
    </label>
    <label className="bg-blue-500 text-white p-2 rounded-md cursor-pointer">
      {movieFile ? movieFile.name : "Upload Movie File"}
      <input
        type="file"
        onChange={handleMovieFileChange}
        className="hidden"
      />
    </label>
    {fileError && <p className="text-red-500">{fileError}</p>}
    <button
      type="submit"
      onClick={(e) => handleMovieUpload(e)}
      className="bg-blue-400 text-gray-800 p-2 rounded-md"
    >
      Upload
    </button>
    {successMessage && <p className="text-green-500">{successMessage}</p>}
    {isUploading && (
      <p className="text-blue-500">
        Uploading... {uploadProgress.toFixed(2)}%
      </p>
    )}
    <div
        className="absolute top-5 left-5 cursor-pointer"
        onClick={handleArrowClick}
      >
        <FaArrowLeft className="m-3" size={30} color="white" />
      </div>
  </form>
</div>;
}

export default uploadMoviePage;
