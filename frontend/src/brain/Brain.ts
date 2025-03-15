import {
  CrashNowData,
  CreateExampleData,
  CreateExampleError,
  CreateExampleParams,
  ExampleData,
  ExampleError,
  ExampleInput,
  ExampleParams,
  HandleHealthzData,
  HelloData,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Brain<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @name handle_healthz
   * @summary Handle Healthz
   * @request GET:/_healthz
   */
  handle_healthz = (params: RequestParams = {}) =>
    this.request<HandleHealthzData, any>({
      path: `/_healthz`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @name example
   * @summary Example
   * @request GET:/routes/example/{kind}
   */
  example = ({ kind, ...query }: ExampleParams, data: ExampleInput, params: RequestParams = {}) =>
    this.request<ExampleData, ExampleError>({
      path: `/routes/example/${kind}`,
      method: "GET",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * No description
   *
   * @name create_example
   * @summary Create Example
   * @request POST:/routes/example/{kind}
   */
  create_example = ({ kind, ...query }: CreateExampleParams, data: ExampleInput, params: RequestParams = {}) =>
    this.request<CreateExampleData, CreateExampleError>({
      path: `/routes/example/${kind}`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * No description
   *
   * @name hello
   * @summary Hello
   * @request GET:/routes/hello
   */
  hello = (params: RequestParams = {}) =>
    this.request<HelloData, any>({
      path: `/routes/hello`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @name crash_now
   * @summary Crash Now
   * @request GET:/routes/crash
   */
  crash_now = (params: RequestParams = {}) =>
    this.request<CrashNowData, any>({
      path: `/routes/crash`,
      method: "GET",
      ...params,
    });
}
