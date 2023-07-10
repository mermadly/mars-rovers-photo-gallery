export default function Dropdown({ handleChange }) {
  return (
    <div>
      <label htmlFor="rovers">Choose a rover: </label>

      <select
        onChange={(e) => {
          handleChange(e.target.value);
        }}
        name="rovers"
        id="rovers"
      >
        <option value="Curiosity">Curiosity</option>
        <option value="Opportunity">Opportunity</option>
        <option value="Spirit">Spirit</option>
      </select>
    </div>
  );
}
