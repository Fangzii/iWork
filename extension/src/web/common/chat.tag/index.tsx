import React, { useState, useRef, useCallback, useEffect } from 'react';
import { sleeper } from '../../../pages/utils/time';
import { scrollToBottom } from '../../../pages/utils/element';
import MarkdownRender from '../components/content';
import { http } from '../../../pages/utils/http';
import { useSelector } from 'react-redux';
import TextareaAutosize from 'react-textarea-autosize';
import { Form, Button, Icon, Message } from 'semantic-ui-react';
import { toast } from 'react-toastify';
import { cloneDeep } from 'lodash';
import Loading from '../components/Loading';
import {
  getTemplateGlobal,
  setTemplateGlobal,
} from '../../../pages/utils/storage';

type ChatMessage = {
  text: string;
  isSent: boolean;
  loading?: boolean;
};

type ChatWindowProps = {
  messages: ChatMessage[];
  onClickGrow?: any;
};

function ChatWindow({ messages, onClickGrow }: ChatWindowProps) {
  const myInfo = useSelector((state: any) => state.myInfo);
  const templateGlobal = useSelector((state: any) => state.template);
  const body: any = useRef();
  const [msg, setMsg] = useState(messages);
  const [count, setCount] = useState(0);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [widen, setWiden] = useState<boolean>(false);
  const [showHelper, setShowHelper] = useState<boolean>(false);
  const [showTemplate, setShowTemplate] = useState<boolean>(true);
  const [open, setOpen] = React.useState(false);
  const [isBlowup, setIsblowup] = React.useState(false);
  const [, updateState] = useState<any>();
  const forceUpdate = useCallback(() => updateState({}), []);
  const [template, setTemplate] = useState<any>({});
  const [useParams, setUseParams] = useState<any>([]);
  const [step, setStep] = useState<any>(0);
  const [outParams, setOutParams] = useState<any>([]);
  const [outHelper, setOutHelper] = useState<any>('');
  const inputRef = useRef(null);
  const virtualSelect = useRef(null);
  let showhelperTimeout: any;
  let inhelperTimeout: any;

  useEffect(() => {
    // 第一次进入页面滚动最底部
    // 读取本地模版
    let localTemplate: any = `{"id":1,"params":["完整内容"],"name":"默认模版","key_words":"-","description":"-","content":"{{完整内容}}","career":1,"customize_users":[1]}`;
    getTemplateGlobal().then((res: any) => {
      if (res?.id) localTemplate = res;

      if (localTemplate) {
        if (typeof localTemplate === 'string')
          localTemplate = JSON.parse(localTemplate);
        setTemplateGlobal(localTemplate);
        setTemplate(localTemplate);
        setUseParams(localTemplate?.params);
        setInput((window as any)['saveText']);
      }
    });

    (inputRef as any).current.focus();
    listenAction();
  }, []);

  const listenAction = () => {
    (virtualSelect.current as any).addEventListener(
      'wheel',
      function (event: any) {
        event.preventDefault();
        // 获取滚动方向
        const delta = Math.max(
          -1,
          Math.min(1, event.wheelDelta || -event.detail)
        );
        // 在B元素上执行相应的滚动
        (window as any).iWorkSelectDom.scrollTop += delta * 2;
      }
    );
  };

  useEffect(() => {
    setTemplateGlobal(templateGlobal);
    setTemplate(templateGlobal);
    setUseParams(templateGlobal?.params);
    setStep(0);
    setOutParams([]);
  }, [templateGlobal]);

  const sendHandle = async (msg: string = '') => {
    setIsOpen(!isOpen);
    /* 发送处理
     * 1. 设置信息
     * 2. 发送后处理
     */
    if (!input) return;
    await setMessage(msg);
    await afterSend(msg || input);
  };

  const setMessage = async (inMsg = '', isSent = true, loading = false) => {
    /* 设置消息
     * 1. 设置信息
     * 2. 设置计数器
     * 3. 清空输入框
     * 4. 滑动至最新
     */

    msg.push({ text: inMsg ? inMsg : input, isSent, loading });
    const num = count + 1;
    setMsg(msg);
    setCount(num);
    if (!inMsg) setInput('');
    forceUpdate();

    // 拉开新数据间隔
    await sleeper(0.1);
  };

  const afterSend = async (inputMsg: string) => {
    await setMessage('', false, true); // 设置loading
    setOutHelper('');
    const result = await toAIChat(inputMsg);

    msg.splice(msg.length - 1, 1); // 删除loading

    // 异常抛错
    const returnMessage = result.content;
    myInfo.fee = result.fee;

    await setMessage(returnMessage, false);
  };

  const toAIChat = async (inputMsg: string) => {
    const response = await http.post('/api/ai_chat/', {
      content: inputMsg,
      chat_id: myInfo.chat.id,
      template_id: template.id,
      params: getInputParams(inputMsg),
    });
    return response.data;
  };

  const getInputParams = (input: string) => {
    const inputParams = input.split('[参数]')[1].substr(1).split('|');
    return inputParams;
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // 检查按下的是否为 Alt + Enter
    if (event.altKey && event.key === 'Enter') {
      // 在当前光标位置插入换行符
      const cursorPosition = event.currentTarget.selectionStart;
      const newValue = [
        input.slice(0, cursorPosition),
        '\n',
        input.slice(cursorPosition),
      ].join('');
      setInput(newValue);

      // 防止事件传播
      event.preventDefault();
      event.stopPropagation();
    }

    if (event.keyCode === 13 && event.key === 'Enter') {
      enterAction();
      event.preventDefault();
    }

    if (event.key === 'Backspace' && !input && step) {
      const nowStep = step - 1;
      outParams.pop();
      setStep(nowStep);
      setOutParams(outParams);
      setOutHelper('');
      event.preventDefault();
    }
  };

  const enterAction = () => {
    if (template?.name === undefined) return toast.warn('请选择模版');
    let finallyInput = '';
    let nowStep;
    if (useParams?.[step]) {
      outParams.push(input);
      setOutParams(outParams);
      nowStep = step + 1;
      setStep(nowStep);
    } else {
      sendHandle();
      setStep(0);
      setOutParams([]);
    }

    if (useParams.length === nowStep) {
      if (fastRule()) {
        sendHandle(contentRule());
        setStep(0);
        setOutParams([]);
      } else {
        setOutHelper('请确认输入参数, 回车发送');
        finallyInput = contentRule();
      }
    }
    setInput(finallyInput);
  };

  const fastRule = () => {
    return useParams.length === 1;
  };

  const contentRule = () => {
    return `[模版] ${template.name}  \n[参数] ${outParams.join('|')}`;
  };

  const getLastMsg = (data: any, mode = 'user') => {
    const newData = cloneDeep(data);
    newData.reverse();
    return newData.find((f: any) => (mode === 'user' ? f.isSent : !f.isSent));
  };

  return (
    <div>
      <Form style={{ width: '100%' }}>
        <div
          style={{
            transition: 'all .2s ease',
            color: 'rgba(96, 68, 207, 0.56)',
            cursor: 'pointer',
            position: 'absolute',
            top: '483px',
            width: '14px',
            left: '-8px',
            transform: `rotate(${isBlowup ? '140' : '-140'}deg) scale(.8)`,
            background: '#fff',
            borderRadius: '2px',
            height: '4px',
          }}
          onClick={() => (onClickGrow?.(), setIsblowup(!isBlowup))}
        ></div>
        <Message
          color="violet"
          size="mini"
          style={{
            padding: '3px',
            left: '2%',
            width: '96%',
            position: 'absolute',
            transition: 'all .2s',
            top: showTemplate ? '452px' : '0px',
            backgroundColor: '#494949',
            color: '#fff',
            boxShadow: '0 0 0 1px #919191 inset, 0 0 0 0 transparent',
            opacity: 0.9,
          }}
        >
          <div
            ref={virtualSelect}
            style={{
              height: '20px',
              width: '100%',
              overflow: 'auto',
              position: 'fixed',
              zIndex: '9999999999',
            }}
            className="mouse-wheel-tips"
          >
            &nbsp;
            <br />
            &nbsp;
            <br />
            &nbsp;
            <br />
            &nbsp;
          </div>
          <span style={{ marginLeft: '3px' }}>
            <b>
              {outHelper}
              {template?.params?.[step]}
            </b>
          </span>
          <span
            onClick={() => setOpen(true)}
            style={{
              float: 'right',
              cursor: 'pointer',
              marginRight: '5px',
              marginTop: '1px',
            }}
          >
            <b>{template?.name ?? '滚动滑轮选择模版'}</b>
          </span>
        </Message>
        <TextareaAutosize
          ref={inputRef}
          rows={1}
          style={{
            fontSize: '12px',
            width: '100%',
            resize: 'none',
            position: 'absolute',
            padding: '8px 16px',
          }}
          value={input}
          placeholder={template?.params?.[step]}
          onChange={(evt) => setInput(evt.target.value)}
          onKeyDown={handleKeyDown}
        ></TextareaAutosize>
        <div style={{ height: '35px' }}></div>
        <div style={{ color: '#3d2a2a' }}>
          {getLastMsg(msg)?.text && (
            <div className="template_chat">
              <MarkdownRender>{getLastMsg(msg)?.text}</MarkdownRender>
            </div>
          )}
          <div
            className={`${widen ? 'ai_chat_widen' : ''} ai_chat ai_chat_header`}
            onMouseEnter={() => {
              clearTimeout(showhelperTimeout);
              clearTimeout(inhelperTimeout);
              setShowHelper(true);
            }}
            onMouseLeave={() => {
              showhelperTimeout = setTimeout(() => {
                setShowHelper(false);
              }, 300);
            }}
          >
            {true && (
              <div
                style={{
                  transition: 'all .1s ease',
                  position: 'fixed',
                  width: '45px',
                  height: '14px',
                  right: '20px',
                  marginTop: '-12px',
                  borderRadius: '5px 0px 0px 5px',
                  opacity: showHelper ? 1 : 0,
                }}
              >
                <div
                  className="green-dot"
                  style={{ float: 'right' }}
                  onClick={() => setWiden(!widen)}
                ></div>
              </div>
            )}

            {getLastMsg(msg, 'ai')?.loading ? (
              <Loading />
            ) : (
              <MarkdownRender>
                {getLastMsg(msg, 'ai')?.text.replaceAll('\n\n', '  \n') ??
                  '欢迎使用，发出你想问的问题'}
              </MarkdownRender>
            )}
          </div>
        </div>
      </Form>
    </div>
  );
}
type Prop = {
  onClickGrow?: any;
};

function Chat({ onClickGrow }: Prop) {
  const original_message = useSelector(
    (state: any) =>
      state.myInfo?.chat?.message ?? [
        { content: '欢迎使用，发出你想问的问题', role: 'ai' },
      ]
  );
  const messages: ChatMessage[] = original_message.map((item: any) => {
    return { text: item.content, isSent: item.role !== 'ai' };
  });

  return (
    <div className="chat-card" style={{ background: '#656269' }}>
      <ChatWindow messages={messages} onClickGrow={onClickGrow} />
    </div>
  );
}

export default Chat;
