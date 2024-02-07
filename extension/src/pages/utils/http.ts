import axios, { AxiosInstance } from 'axios';
import { getStore, setStore } from '../background/core/store';
import { toBackground } from './postman';
const BASE_URL = 'http://localhost:8000';

// eslint-disable-next-line no-restricted-globals
let requestMode = location.href.startsWith('chrome') ? 'http' : 'test';

const backgroundHttp: any = {
  get: async (url: string) =>
    httpResponse(
      await toBackground({ action: 'http', data: { method: 'get', url } })
    ),
  post: async (url: string, data: any) =>
    httpResponse(
      await toBackground({
        action: 'http',
        data: { method: 'post', url, data },
      })
    ),
  put: async (url: string, data: any) =>
    httpResponse(
      await toBackground({ action: 'http', data: { method: 'put', url, data } })
    ),
};

const httpResponse = (response: any) => {
  if (String(response.code).startsWith('2')) return response;
  throw { response };
};
// 创建一个Axios实例
export const http: AxiosInstance | any =
  requestMode === 'http'
    ? axios.create({
        baseURL: BASE_URL,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    : backgroundHttp;

// 请求拦截器
if (requestMode === 'http') {
  http.interceptors.request.use(
    (config: any) => {
      const noToken = ['/api/login/', '/api/register/'];
      // 在请求发送之前可以进行一些操作，例如添加token
      if (noToken.includes(String(config.url))) return config;
      const token = localStorage.getItem('token');
      config.headers.Authorization = `Token ${token}`;
      return config;
    },
    (error: any) => {
      return Promise.reject(error);
    }
  );

  // 响应拦截器
  http.interceptors.response.use(
    (response: any) => {
      // 在接收响应之前可以进行一些操作，例如处理错误
      return response;
    },
    (error: any) => {
      if (error?.response?.status === 502) {
        return http(error.config);
      }
      // 处理错误
      return Promise.reject(error);
    }
  );
}

export const baseHttp: any = async (data: any) => {
  const storeToken = ['/api/login/', '/api/register/'];
  let headers: any = {
    'Content-Type': 'application/json',
  };
  if (!storeToken.includes(data.url)) {
    const token = await getStore('token');
    console.log(token);
    headers['Authorization'] = `Token ${token}`;
  }

  const response = await fetch(BASE_URL + data.url, {
    method: data.method,
    body: JSON.stringify(data.data),
    headers: headers,
  });

  if (response.status === 502) return await baseHttp(data);
  const out: any = await response.json();
  if (storeToken.includes(data.url) && out.token) setStore('token', out.token);
  return { data: out, code: response.status };
};
