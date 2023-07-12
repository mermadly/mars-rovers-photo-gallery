import "../styles.css";

export default function Dropdown({ handleChange, name, options, label }) {
  return (
    <div>
      <label htmlFor={name}> {label}</label>

      <select
        required
        onChange={(e) => {
          handleChange(e.target.value);
        }}
        name={name}
        id={name}
      >
        {options.map((option) => {
          return (
            <option key={option} value={option}>
              {option}
            </option>
          );
        })}
      </select>
    </div>
  );
}
