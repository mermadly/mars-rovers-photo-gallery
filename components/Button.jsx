export default function Button({ value, handlePage, disabled, label }) {
  return (
    <div>
      <button
        type="button"
        value={value}
        onClick={handlePage}
        disabled={disabled}
        className={value}
      >
        {label}
      </button>
    </div>
  );
}
