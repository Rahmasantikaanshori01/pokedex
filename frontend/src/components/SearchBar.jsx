import { SearchIcon, XIcon } from "./Icons";

export default function SearchBar({
  value = "",
  onChange = () => {},
  onClear = () => {},
  placeholder = "Cari Pokémon...",
  disabled = false,
}) {
  const handleClear = () => {
    if (onClear) {
      onClear();
    } else {
      onChange("");
    }
  };

  return (
    <label className="search-bar" htmlFor="pokemon-search-input">
      <SearchIcon />
      <span className="sr-only">Cari Pokémon berdasarkan nama</span>
      <input
        id="pokemon-search-input"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        spellCheck="false"
        aria-label="Cari Pokémon berdasarkan nama"
      />
      {value ? (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Hapus kata kunci pencarian"
          title="Hapus pencarian"
        >
          <XIcon />
        </button>
      ) : null}
    </label>
  );
}
