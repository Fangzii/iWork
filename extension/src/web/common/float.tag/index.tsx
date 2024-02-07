import React, { useState, useEffect } from 'react';
import Login from '../login.tag';
import Info from '../info.tag';
import Chat from '../chat.tag';
import Tool from '../tool.tag';
import { setupKeyboardListeners } from '../../../pages/utils/listener';
import './index.css';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { toBackground } from '../../../pages/utils/postman';

interface FloatTagProps {
  url?: string;
}

export default function FloatTag({ url }: FloatTagProps) {
  const myInfo = useSelector((state: any) => state.myInfo);
  const [show, setShow] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showTool, setShowTool] = useState(false);
  const [hover, setHover] = useState(false);
  const [logined, setLogined] = useState(false);
  const [grow, setGrow] = useState(false);
  const dispatch = useDispatch();
  (window as any)['requestMode'] = 'test';

  useEffect(() => {
    toBackground({
      action: 'store.get',
      data: { key: 'token' },
    }).then((token) => {
      console.log(token);
      if (token) {
        setLogined(true);
      }
    });
    setupKeyboardListeners({
      doubleSpace: () => setShow(true),
      doubleEsc: () => setShow(false),
    });
  }, []);

  useEffect(() => {
    if (!show) {
      dispatch({ type: 'UPDATE_MYINFO', payload: {} });
    } else {
      const win = window as any;
      const selectedText = win.getSelection().toString();
      if (selectedText) win.saveText = selectedText;
    }
  }, [show]);

  useEffect(() => {
    if (myInfo?.career?.id) {
      setShowChat(true);
      setShowTool(true);
    } else {
      setShowChat(false);
      setShowTool(false);
    }
  }, [myInfo]);

  return (
    <div className="base" style={{ fontSize: '14px' }}>
      <div>
        <div style={{ transition: 'all 0.3s ease' }}>
          <div
            className={'iwork-tag-lt'}
            style={{
              left: show ? '20px' : '-999px',
              background: logined ? '#7600ffc7' : '',
            }}
          >
            {show &&
              (!logined ? (
                <Login afterLogin={() => setLogined(true)}></Login>
              ) : (
                <Info
                  afterLogout={() => {
                    setLogined(false);
                    dispatch({ type: 'UPDATE_MYINFO', payload: {} });
                  }}
                ></Info>
              ))}
          </div>
          <div
            className={'iwork-tag-rt'}
            style={{
              right: show && showChat ? '20px' : '-999px',
              transformOrigin: 'top right',
              transform: `scale(${grow ? '1.2' : '1'})`,
            }}
          >
            {show && showChat && (
              <Chat onClickGrow={() => setGrow(!grow)}></Chat>
            )}
          </div>
          <div
            className={'iwork-tag-rb'}
            style={{ right: show && showTool ? '20px' : '-999px' }}
          >
            {show && showTool && <Tool></Tool>}
          </div>
        </div>
      </div>
      <span
        className="iwork-tag"
        onClick={() => setShow(!show)}
        style={{ bottom: '30px' }}
        onMouseOver={() => setHover(true)}
        onMouseOut={() => setHover(false)}
      >
        <p
          style={{
            float: 'right',
            transition: 'all 0.3s ease',
            position: 'fixed',
            left: hover ? '30px' : '-999px',
          }}
        >
          iWork
        </p>
        <img
          src="https://fangsblog.oss-cn-shanghai.aliyuncs.com/logo/icon-34.png"
          alt="logo"
          style={{
            height: '16px',
            position: 'relative',
            left: '20px',
            filter: `${hover ? 'none' : 'drop-shadow(-2px 1px 2px black)'}`,
          }}
        />
      </span>
    </div>
  );
}
