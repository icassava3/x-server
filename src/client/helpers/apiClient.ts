
//Ce projet tourne toujours sur la machine hote
export const API_URL = 'http://localhost:49500'
// export const API_URL = 'http://192.168.1.154:1970'

export interface IServerResponse {
  status: number;
  data?: any;
  error?: any
}

export async function request<T>(
  route: string,
  url?: string,
  config?: RequestInit,
): Promise<T> {
  const myUrl: string =
    url === undefined
      ? `${API_URL}${route}`
      : `${url}${route}`
  console.log('myUrl===>', myUrl)
  const response = await fetch(myUrl, config);
  return await response.json() as T;
}

export const apiClient = {
  /**
   * Effectue un GET vers le serveur et renvoi la réponse en Json
   * {status:number; data?:any; error?: any}
   * @param route obligatoire 
   * @param url   optional 
   * @returns IServerResponse
   */
  get: (route: string, url?: string) =>
    request<IServerResponse>(route, url),

  /**
   * Effectue un POST vers le serveur et renvoi la réponse en Json
   * {status:number; data?:any; error?: any}
   * @param route :string
   * @param payload : object
   * @returns IServerResponse
   */
  post: (route: string, payload: any) =>
    request<IServerResponse>(
      route,
      undefined,
      {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          // authorization: authToken,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }),

}






