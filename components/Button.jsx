export default function Button({ value, handlePage, disabled, label }) {
  return (
    <div>
      <button
        type="button"
        value={value}
        onClick={handlePage}
        disabled={disabled}
        className={`${value} ${disabled ? "disabled" : null}`}
      >
        {/* {label} */}
      </button>
    </div>
  );
}
