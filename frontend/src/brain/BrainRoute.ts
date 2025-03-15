import {
  CrashNowData,
  CreateExampleData,
  ExampleData,
  ExampleInput,
  HandleHealthzData,
  HelloData,
} from "./data-contracts";

export namespace Brain {
  /**
   * No description
   * @name handle_healthz
   * @summary Handle Healthz
   * @request GET:/_healthz
   */
  export namespace handle_healthz {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = HandleHealthzData;
  }

  /**
   * No description
   * @name example
   * @summary Example
   * @request GET:/routes/example/{kind}
   */
  export namespace example {
    export type RequestParams = {
      /** Kind */
      kind: string;
    };
    export type RequestQuery = {};
    export type RequestBody = ExampleInput;
    export type RequestHeaders = {};
    export type ResponseBody = ExampleData;
  }

  /**
   * No description
   * @name create_example
   * @summary Create Example
   * @request POST:/routes/example/{kind}
   */
  export namespace create_example {
    export type RequestParams = {
      /** Kind */
      kind: string;
    };
    export type RequestQuery = {};
    export type RequestBody = ExampleInput;
    export type RequestHeaders = {};
    export type ResponseBody = CreateExampleData;
  }

  /**
   * No description
   * @name hello
   * @summary Hello
   * @request GET:/routes/hello
   */
  export namespace hello {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = HelloData;
  }

  /**
   * No description
   * @name crash_now
   * @summary Crash Now
   * @request GET:/routes/crash
   */
  export namespace crash_now {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CrashNowData;
  }
}
