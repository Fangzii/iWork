import { baseHttp } from '../../utils/http';
import { getStore, setStore } from '../core/store';

export enum Action {
  Http = 'http',
  Open = 'open',
  GetStore = 'store.get',
  SetStore = 'store.set',
  TabOpen = 'tab.open',
  Logout = 'logout',
}

export const start = () => {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.action) {
      case Action.Http:
        baseHttp(request.data).then((res: any) => {
          sendResponse(res);
        });
        return true;
      case Action.Open:
        chrome.windows.create({
          url: 'popup.html',
          type: 'popup',
          width: 760,
          height: 630,
        });

        sendResponse('完成');
        return true;
      case Action.GetStore:
        getStore(request.data.key).then((res) => {
          sendResponse(res);
        });
        return true;
      case Action.SetStore:
        setStore(request.data.key, request.data.value).then((res) => {
          sendResponse(res);
        });
        return true;

      case Action.Logout:
        setStore('token', '').then((res) => {
          sendResponse(res);
        });
        return true;

      case Action.TabOpen:
        chrome.tabs.create({ active: true, url: request.data.url });
        sendResponse('success');
        return true;
    }
  });
};
