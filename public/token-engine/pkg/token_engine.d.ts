/* tslint:disable */
/* eslint-disable */
export function start(): void;
export function add(left: number, right: number): number;
export function hello(name: string): string;
export class Calculator {
  private constructor();
  free(): void;
  static new(initial: number): Calculator;
  add(value: number): number;
  subtract(value: number): number;
  get_value(): number;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly start: () => void;
  readonly add: (a: number, b: number) => number;
  readonly hello: (a: number, b: number) => [number, number];
  readonly __wbg_calculator_free: (a: number, b: number) => void;
  readonly calculator_new: (a: number) => number;
  readonly calculator_add: (a: number, b: number) => number;
  readonly calculator_subtract: (a: number, b: number) => number;
  readonly calculator_get_value: (a: number) => number;
  readonly __wbindgen_export_0: WebAssembly.Table;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
