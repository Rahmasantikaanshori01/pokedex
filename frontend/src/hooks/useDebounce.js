import { useState, useEffect } from "react";

/**
 * Custom hook untuk men-debounce perubahan value (misal input pencarian).
 * Mencegah pengiriman request API pada setiap ketikan karakter.
 *
 * @param {any} value - Nilai yang ingin di-debounce
 * @param {number} delay - Waktu tunda dalam milidetik (default: 400ms)
 * @returns {any} Nilai yang telah di-debounce
 */
export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
