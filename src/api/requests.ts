type DataChecker = (data: unknown) => never | void;

export const responseStatusValidation = (status: number) => {
  if (status >= 200 && status <= 299) {
    return true;
  } else {
    return false;
  }
};

const dataCheckerNullOrUndefined: DataChecker = (
  data: unknown
): never | void => {
  if (data === undefined || data === null)
    throw new Error("Data from api null or undefined!");
};

export interface FetchDataOptions {
  deleteWithResponse?: boolean;
}

export interface FetchDataReturnValue<T> {
  ok: boolean;
  status: number;
  statusText: string;
  body: T;
}

const fetchData = async (
  url: RequestInfo,
  method: "GET" | "POST" | "DELETE" | "PATCH",
  body?: BodyInit,
  options?: FetchDataOptions,
  abortControllerSignal?: AbortSignal,
  dataChecker?: DataChecker
): Promise<FetchDataReturnValue<any>> => {
  const fetchOptions: RequestInit = {
    method: method,
  };

  if (body) {
    fetchOptions.body = body;
    fetchOptions.headers = { "Content-Type": "application/json" };
  }

  if (abortControllerSignal) fetchOptions.signal = abortControllerSignal;

  try {
    const res = await fetch("/api" + url, fetchOptions);

    let data = null;

    if (
      method === "GET" ||
      method === "POST" ||
      method === "PATCH" ||
      (method === "DELETE" && options?.deleteWithResponse)
    ) {
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        throw new Error(`Response not in JSON format!`);
      }
    }

    if (dataChecker) dataChecker(data);

    return {
      ok: res.ok,
      status: res.status,
      statusText: res.statusText,
      body: data,
    };
  } catch (error) {
    return Promise.reject(error);
  }
};

export { fetchData, dataCheckerNullOrUndefined };
