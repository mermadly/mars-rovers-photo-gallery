"use client";

import { useEffect, useState } from "react";
import DatePicker from "react-multi-date-picker";
import { Calendar } from "react-multi-date-picker";
import Dropdown from "../components/Dropdown";

export default function RootLayout({ children }) {
  const [roverDates, setRoverDates] = useState({});
  const [rover, setRover] = useState("Curiosity");
  const [date, setDate] = useState();

  const handleChangeRover = (name) => {
    console.log("rover name", name);
    setRover(name);
    setDate();
  };
  const handleDate = (e) => {
    const date = new Date(e);
    const formattedDate = date.toISOString().split("T")[0];
    console.log(date.toISOString().split("T")[0]);
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

  return (
    <html lang="en">
      <body>
        <h1>Mars Rovers Photo Gallery</h1>
        <Dropdown handleChange={handleChangeRover} />
        {Object.keys(roverDates).length > 0 ? (
          <>
            <label htmlFor="date">Pick an Earth Date: </label>
            <DatePicker
              value={date}
              onChange={handleDate}
              minDate={roverDates[rover].minEarth}
              maxDate={roverDates[rover].maxEarth}
            />
          </>
        ) : null}
      </body>
    </html>
  );
}
