declare module 's2-geometry' {
  export function calculator_add(a: number, b: number, c: number): number;
  export function calculator_subtract(a: number, b: number): number;
  export function calculator_get_value(): number;
  export function calculator_new(): void;
  export function calculator_free(): void;
  export function hello(): string;
  export function add(a: number, b: number): number;
  export function start(): void;
  export function latLngToKey(lat: number, lng: number, level: number): number;
  export function keyToLatLng(key: number): { lat: number; lng: number };
  export function getNeighborKeys(key: number): number[];
  export function getParentKey(key: number): number;
  export function getChildKeys(key: number): number[];
} 