"use client";

import { useEffect, useState } from "react";
import DatePicker from "react-multi-date-picker";
import { Calendar } from "react-multi-date-picker";
import Dropdown from "../components/Dropdown";

export default function RootLayout({ children }) {
  const [roverDates, setRoverDates] = useState({});
  const [rover, setRover] = useState("Curiosity");
  const [date, setDate] = useState();
  const [photosArray, setPhotosArray] = useState([]);
  const [camera, setCamera] = useState("All cameras");
  const [dateType, setDateType] = useState("Sol");

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
    const date = new Date(e);
    const formattedDate = date.toISOString().split("T")[0];
    setDate(formattedDate);
  };
  useEffect(() => {
    const getDates = async () => {
      const res = await fetch(
        "https://api.nasa.gov/mars-photos/api/v1/rovers?api_key=gagtDJwzdcAoAzeAfiQsv6Huoakig7CPKNxOehd9"
      );
      const { rovers } = await res.json();
      let roversData = {};
      rovers.map((rover) => {
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
    const res = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?earth_date=${date}&&api_key=gagtDJwzdcAoAzeAfiQsv6Huoakig7CPKNxOehd9`
    );
    const { photos } = await res.json();
    setPhotosArray(photos);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    camera == "All cameras" ? getImages() : getPhotoByCamera();
  };

  const getPhotoByCamera = async () => {
    const res = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?earth_date=${date}&camera=${camera}&api_key=gagtDJwzdcAoAzeAfiQsv6Huoakig7CPKNxOehd9`
    );
    const { photos } = await res.json();
    console.log("funcionó el fetch de camara", photos);
    setPhotosArray(photos);
  };

  const handleChangeCamera = (e) => {
    setCamera(e);
  };

  const handleChangeDateType = (e) => {
    console.log(e);
    setDateType(e);
  };

  return (
    <html lang="en">
      <body>
        <h1>Mars Rovers Photo Gallery</h1>
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
            dateType == "Earth Date" ? (
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
              <>
                <label htmlFor="Sol date">
                  Sol date (max {roverDates[rover].sol}):
                </label>

                <input
                  type="number"
                  id="day"
                  name="number"
                  min="0"
                  max={roverDates[rover].sol}
                />
              </>
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

        {photosArray.length > 0
          ? photosArray.map((photo) => {
              return (
                <img
                  key={photo.id}
                  src={photo.img_src}
                  alt=""
                  style={{ maxWidth: "250px" }}
                />
              );
            })
          : null}
      </body>
    </html>
  );
}
