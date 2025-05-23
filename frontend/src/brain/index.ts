import { auth } from "app/auth";
import { API_PATH } from "../constants";
import { Brain } from "./Brain";
import type { RequestParams } from "./http-client";

const isLocalhost = /localhost:\d{4}/i.test(window.location.origin);

const constructBaseUrl = (): string => {
  if (isLocalhost) {
    return `${window.location.origin}${API_PATH}`;
  }

  return `https://api.databutton.com${API_PATH}`;
};

type BaseApiParams = Omit<RequestParams, "signal" | "baseUrl" | "cancelToken">;

const constructBaseApiParams = (): BaseApiParams => {
  return {
    credentials: "include",
    secure: true,
  };
};

const constructBrain = () => {
  const baseUrl = constructBaseUrl();
  const baseApiParams = constructBaseApiParams();

  return new Brain({
    baseUrl,
    baseApiParams,
    securityWorker: async () => {
      return {
        headers: {
          "authorization": await auth.getAuthHeaderValue(),
        },
      };
    },
  });
};

const brain = constructBrain();

export default brain;
