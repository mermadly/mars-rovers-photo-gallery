"use client";

import { useEffect, useState } from "react";
import { Calendar } from "react-multi-date-picker";
import Button from "../components/Button";
import "../styles.css";
import Form from "../components/Form";
import Gallery from "../components/Gallery";

export default function RootLayout({ children }) {
  const [roverDates, setRoverDates] = useState({});
  const [rover, setRover] = useState("Curiosity");
  const [date, setDate] = useState();
  const [photosArray, setPhotosArray] = useState([]);
  const [camera, setCamera] = useState("All cameras");
  const [dateType, setDateType] = useState("sol");
  const [page, setPage] = useState(1);

  const cameraByRover = {
    Curiosity: [
      "All cameras",
      "FHAZ",
      "RHAZ",
      "MAST",
      "CHEMCAM",
      "MAHLI",
      "MARDI",
      "NAVCAM",
    ],
    Opportunity: ["All cameras", "FHAZ", "RHAZ", "NAVCAM", "PANCAM"],
    Spirit: ["All cameras", "FHAZ", "RHAZ", "NAVCAM", "PANCAM"],
  };

  useEffect(() => {
    const getDates = async () => {
      const res = await fetch(
        "https://api.nasa.gov/mars-photos/api/v1/rovers?api_key=gagtDJwzdcAoAzeAfiQsv6Huoakig7CPKNxOehd9"
      );
      const { rovers } = await res.json();
      let roversData = {};
      rovers?.map((rover) => {
        const roverName = rover.name;
        const roverData = {
          [roverName]: {
            minEarth: rover.landing_date,
            maxEarth: rover.max_date,
            sol: rover.max_sol,
          },
        };
        roversData = { ...roversData, ...roverData };
      });
      delete roversData.Perseverance;
      setRoverDates(roversData);
      return rovers;
    };
    getDates();
  }, []);

  useEffect(() => {
    getPhotos();
  }, [page]);

  const handleChangeRover = (name) => {
    setRover(name);
    setDate();
    setCamera("All cameras");
    setPhotosArray([]);
  };
  const handleDate = (e) => {
    if (dateType == "earth_date") {
      const date = new Date(e);
      const formattedDate = date.toISOString().split("T")[0];
      setDate(formattedDate);
    } else {
      setDate(e.target.value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("hola", camera);
    setPage(1);
    getPhotos();
  };

  const handleChangeCamera = (e) => {
    setCamera(e);
  };

  const handleChangeDateType = (e) => {
    console.log(e);
    e == "Sol" ? setDateType("sol") : setDateType("earth_date");
  };
  const handlePage = (e) => {
    console.log("click");
    if (e.target.value === "back") {
      setPage((prevPage) => prevPage - 1);
    }
    if (e.target.value === "next") {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const getPhotos = async () => {
    const res = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?${dateType}=${date}&page=${page}${
        camera === "All cameras" ? "" : "&camera=" + camera
      }&api_key=gagtDJwzdcAoAzeAfiQsv6Huoakig7CPKNxOehd9`
    );
    const { photos } = await res.json();
    console.log("photos", photos);
    setPhotosArray(photos);
  };

  return (
    <html lang="en">
      <body>
        <h1>Mars Rovers Photo Gallery</h1>
        <Form
          handleSubmit={handleSubmit}
          handleChangeRover={handleChangeRover}
          roverDates={roverDates}
          rover={rover}
          date={date}
          handleDate={handleDate}
          cameraByRover={cameraByRover}
          handleChangeDateType={handleChangeDateType}
          handleChangeCamera={handleChangeCamera}
          dateType={dateType}
        />
        <Gallery photosArray={photosArray} />
        <Button
          value={"back"}
          handlePage={handlePage}
          disabled={page == 1}
          label={"Back"}
        />
        <Button
          value={"next"}
          handlePage={handlePage}
          disabled={photosArray.length < 25}
          label={"Next"}
        />
      </body>
    </html>
  );
}
