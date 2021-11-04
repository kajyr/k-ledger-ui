export async function callApi(url: string, options: RequestInit = {}) {
  const fetchOptions: RequestInit = {
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    ...options,
  };

  const response = await fetch(url, fetchOptions);
  // IE11 polyfill for response.ok
  if (!("ok" in response)) {
    //@ts-ignore
    response.ok = response.status >= 200 && response.status < 300;
  }
  return response;
}

export function callJsonApi<T>(url, options): Promise<T | undefined> {
  return callApi(url, options).then((response) => {
    if (response.ok) {
      return response.json() as Promise<T>;
    }
  });
}
