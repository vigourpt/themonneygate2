/** ExampleInput */
export interface ExampleInput {
  /** X */
  x: number;
  /** Y */
  y: string;
  /** Z */
  z: number;
}

/** ExampleOutput */
export interface ExampleOutput {
  /** Msg */
  msg: string;
}

/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[];
}

/** ValidationError */
export interface ValidationError {
  /** Location */
  loc: (string | number)[];
  /** Message */
  msg: string;
  /** Error Type */
  type: string;
}

export type HandleHealthzData = any;

export interface ExampleParams {
  /** Kind */
  kind: string;
}

export type ExampleData = ExampleOutput;

export type ExampleError = HTTPValidationError;

export interface CreateExampleParams {
  /** Kind */
  kind: string;
}

export type CreateExampleData = ExampleOutput;

export type CreateExampleError = HTTPValidationError;

export type HelloData = any;

export type CrashNowData = any;
