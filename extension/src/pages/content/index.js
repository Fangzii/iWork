import React from 'react';
import ReactDOM from 'react-dom';
import FloatTag from '../../web/common/float.tag';
import store from '../utils/store';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { adInit } from '../utils/advertise';
import 'react-toastify/dist/ReactToastify.css';
adInit();

const id = 'iwork-tag';
let cacheStyle = '';

function render() {
  const container = document.createElement('div');
  container.id = id;
  const toastContainer = document.createElement('div');

  const setStyle = (dom) => {
    const styleTags = document.querySelectorAll('style');
    const style = Array.from(styleTags).find((styleTag) => {
      if (styleTag.innerHTML.includes('iwork-tag')) return styleTag;
    });

    const newStyleTag = document.createElement('style');
    newStyleTag.innerHTML = style?.innerHTML ?? cacheStyle;
    if (style?.innerHTML) cacheStyle = style?.innerHTML;
    dom.appendChild(newStyleTag);
    style?.remove();
  };

  const shadowRoot = container.attachShadow({ mode: 'open' });
  document.body.appendChild(container);
  document.body.appendChild(toastContainer);
  const tag = document.createElement('div');
  shadowRoot.append(tag);
  setStyle(shadowRoot);

  const cdn = [
    'https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/semantic-ui/2.4.1/semantic.min.css',
    'https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/tailwindcss/2.2.19/tailwind.min.css',
  ];

  cdn.forEach((url) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    shadowRoot.appendChild(link);
  });

  const url = chrome.runtime.getURL('popup.html');

  function App() {
    return (
      <Provider store={store}>
        <FloatTag url={url}></FloatTag>
      </Provider>
    );
  }

  function Toast() {
    return (
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    );
  }

  ReactDOM.render(<App />, tag);
  ReactDOM.render(<Toast />, toastContainer);
}
render();

window.addEventListener('input', handleInput);
// 输入事件处理函数
function handleInput(event) {
  const inputValue = event.target.value;
  window.saveText = inputValue;
}

function listen() {
  // 执行监听操作
  if (!document.getElementById(id)) {
    console.log('检测到容器消失');
    render();
  }
}
// 设置一个定时器，每隔一段时间执行监听函数
var intervalId = setInterval(listen, 5000); // 每隔1秒执行一次监听函数
