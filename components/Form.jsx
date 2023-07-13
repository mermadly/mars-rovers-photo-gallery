import Dropdown from "./Dropdown";

export default function Form({
  handleSubmit,
  handleChangeRover,
  roverDates,
  rover,
  date,
  handleDate,
  cameraByRover,
  handleChangeDateType,
  handleChangeCamera,
  dateType,
}) {
  return (
    <form
      onSubmit={() => {
        handleSubmit;
      }}
    >
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
      {rover ? (
        <Dropdown
          handleChange={handleChangeCamera}
          name={"cameras"}
          options={cameraByRover[rover]}
          label={"Choose a camera: "}
        />
      ) : null}
      <input type="submit" value="Submit" />
    </form>
  );
}
