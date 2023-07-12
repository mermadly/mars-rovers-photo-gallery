"use client";

import { useEffect, useState } from "react";
import DatePicker from "react-multi-date-picker";
import { Calendar } from "react-multi-date-picker";
import Button from "../components/Button";
import "../styles.css";
import Form from "../components/Form";
import Dropdown from "../components/Dropdown";

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

  const getImages = async () => {
    console.log(dateType, date);
    const res = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?${dateType}=${date}&page=${page}&api_key=gagtDJwzdcAoAzeAfiQsv6Huoakig7CPKNxOehd9`
    );
    const { photos } = await res.json();
    console.log("fetch", photos);

    setPhotosArray(photos || []);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("hola", camera);
    setPage(1);
    camera == "All cameras" ? getImages() : getPhotoByCamera();
  };

  const getPhotoByCamera = async () => {
    const res = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?${dateType}=${date}&page=${page}&camera=${camera}&api_key=gagtDJwzdcAoAzeAfiQsv6Huoakig7CPKNxOehd9`
    );
    const { photos } = await res.json();
    console.log("photos", photos);
    setPhotosArray(photos);
  };

  const handleChangeCamera = (e) => {
    setCamera(e);
  };

  const handleChangeDateType = (e) => {
    console.log(e);
    e == "Sol" ? setDateType("sol") : setDateType("earth_date");
  };
  const handlePage = (e) => {
    console.log(e.target.value);
    if (e.target.value === "back") {
      setPage((prevPage) => prevPage - 1);
    }
    if (e.target.value === "next") {
      setPage((prevPage) => prevPage + 1);
    }
  };
  useEffect(() => {
    camera == "All cameras"
      ? getImages() && console.log("getImages")
      : getPhotoByCamera() && console.log("getbycamera");
  }, [page]);

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
        />
        <form onSubmit={handleSubmit}>
          <Dropdown
            handleChange={handleChangeRover}
            name={"rovers"}
            options={["Curiosity", "Opportunity", "Spirit"]}
            label={"Choose a rover:"}
          />
          <Dropdown
            handleChange={handleChangeDateType}
            name={"rovers"}
            options={["Sol", "Earth Date"]}
            label={"Choose a type of date: "}
          />
          {Object.keys(roverDates).length > 0 ? (
            dateType == "earth_date" ? (
              <>
                <label htmlFor="date">Pick an Earth Date: </label>
                <DatePicker
                  value={date}
                  onChange={handleDate}
                  minDate={roverDates[rover].minEarth}
                  maxDate={roverDates[rover].maxEarth}
                />
              </>
            ) : (
              <div>
                <label htmlFor="Sol date">
                  Sol date (max {roverDates[rover].sol}):
                </label>

                <input
                  type="number"
                  id="day"
                  name="number"
                  min="0"
                  max={roverDates[rover].sol}
                  onChange={handleDate}
                />
              </div>
            )
          ) : null}
          <Dropdown
            handleChange={handleChangeCamera}
            name={"cameras"}
            options={cameraByRover[rover]}
            label={"Choose a camera: "}
          />
          <input type="submit" value="Submit" />
        </form>
        <div className="photo-gallery">
          {photosArray?.map((photo) => {
            return (
              <img
                key={photo.id}
                src={photo.img_src}
                alt=""
                style={{ maxWidth: "250px" }}
              />
            );
          })}
        </div>
        <Button
          value={"back"}
          handlePage={handlePage}
          disabled={page == 1}
          label={"Back"}
        />
        <Button
          value={"next"}
          onClick={handlePage}
          disabled={photosArray.length < 25}
          label={"Next"}
        />
      </body>
    </html>
  );
}
