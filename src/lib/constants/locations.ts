/**
 * Global constants for locations.
 * Prefer this over DB tables for static data like Cities to avoid migration fatigue.
 */

export const CITIES = [
  { value: 'bogota', label: 'Bogotá' },
  { value: 'medellin', label: 'Medellín' },
  { value: 'cali', label: 'Cali' },
  { value: 'barranquilla', label: 'Barranquilla' },
  { value: 'cartagena', label: 'Cartagena' },
] as const;

export type CityValue = (typeof CITIES)[number]['value'];

export const getCityLabel = (value: string) => {
  return CITIES.find((c) => c.value === value)?.label ?? value;
};
