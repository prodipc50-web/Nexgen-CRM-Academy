import { useState, useEffect } from 'react';

/**
 * useDebounce hook
 * Delays updating the debounced value until after the specified delay in ms.
 * Reduces unnecessary filter re-computations and renders during fast typing.
 */
export function useDebounce<T>(value: T, delay: number = 250): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

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
