import React, { useState, useRef, useCallback, useEffect } from 'react';
import { sleeper } from '../../../pages/utils/time';
import { scrollToBottom } from '../../../pages/utils/element';
import Loading from '../components/Loading';
import MarkdownRender from '../components/content';
import { TemplateTable } from '../template/list/index';
// import Example from './components/Tags';
import { http } from '../../../pages/utils/http';
import { useSelector } from 'react-redux';
import TextareaAutosize from 'react-textarea-autosize';
import { Form, Button, Icon, Message, Modal, Label } from 'semantic-ui-react';
import { toast } from 'react-toastify';

type ChatMessage = {
  text: string;
  isSent: boolean;
  loading?: boolean;
};

type ChatBubbleProps = {
  message: ChatMessage;
};

type ChatHeaderProps = {
  username: string;
  career: string;
  fee: number;
};

function ChatHeader({ username, career, fee }: ChatHeaderProps) {
  const is_warning = () => {
    return fee <= 0;
  };
  return (
    <div className="ui fixed menu chat-header">
      <h3 className="header-title">{username}</h3>
      <Label
        as="a"
        color="teal"
        image
        style={{ height: '24px', left: '10px', top: '18px' }}
      >
        {career}
        <Label.Detail style={{ color: is_warning() ? '#da2f2f' : '#fff' }}>
          ¥{(fee || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </Label.Detail>
      </Label>
    </div>
  );
}

function ChatBubble({ message }: ChatBubbleProps) {
  const messageClasses = message.isSent
    ? 'bg-blue-500 text-white rounded-br-none rounded-lg mb-2 ml-auto max-w-sm break-words p-3'
    : 'bg-gray-200 text-gray-800 rounded-bl-none rounded-lg mb-2 mr-auto max-w-sm break-words p-3';

  return (
    <div className="flex">
      <div className={messageClasses} style={{ maxWidth: '600px' }}>
        {message.loading ? (
          <Loading />
        ) : (
          <MarkdownRender>
            {message.text.replaceAll('\n\n', '  \n')}
          </MarkdownRender>
        )}
      </div>
    </div>
  );
}

type ChatWindowProps = {
  messages: ChatMessage[];
};

function ChatWindow({ messages }: ChatWindowProps) {
  const myInfo = useSelector((state: any) => state.myInfo);
  const body: any = useRef();
  const [msg, setMsg] = useState(messages);
  const [count, setCount] = useState(0);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showTemplate, setShowTemplate] = useState<boolean>(true);
  const [open, setOpen] = React.useState(false);
  const [, updateState] = useState<any>();
  const forceUpdate = useCallback(() => updateState({}), []);
  const [template, setTemplate] = useState<any>({});
  const [useParams, setUseParams] = useState<any>([]);
  const [step, setStep] = useState<any>(0);
  const [outParams, setOutParams] = useState<any>([]);
  const [outHelper, setOutHelper] = useState<any>('');
  useEffect(() => {
    // 第一次进入页面滚动最底部
    scrollToBottom(body.current);
    // 读取本地模版
    let localTemplate: any = localStorage.getItem('template');
    if (localTemplate) {
      localTemplate = JSON.parse(localTemplate);

      setTemplate(localTemplate);
      setUseParams(localTemplate?.params);
    }
  }, []);

  const sendHandle = async () => {
    setIsOpen(!isOpen);
    /* 发送处理
     * 1. 设置信息
     * 2. 发送后处理
     */
    if (!input) return;
    await setMessage();
    await afterSend(input);
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
    scrollToBottom(body.current);
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
      params: outParams,
    });
    return response.data;
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

    if (event.key === 'Enter') {
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
      setOutHelper('请确认输出内容，回车发送');
      finallyInput = contentRule();
    }
    setInput(finallyInput);
  };

  const contentRule = () => {
    return `[模版] ${template.name}  \n[参数] ${outParams.join('|')}`;
  };

  return (
    <div>
      <ChatHeader
        username={myInfo.username}
        career={myInfo.career?.name}
        fee={myInfo?.fee}
      />
      <div className="flex flex-col base-window" style={{ paddingTop: '65px' }}>
        <div className="flex-grow overflow-y-auto px-4 py-2" ref={body}>
          {msg.map((message, index) => (
            <ChatBubble key={index} message={message} />
          ))}
        </div>
        {/* <Example></Example> */}
        <div className="flex items-center bg-gray-100 px-4 py-2 base-bottom">
          <Form style={{ width: '100%' }}>
            <Button primary onClick={() => setOpen(true)}>
              添加指令
            </Button>
          </Form>
        </div>
      </div>
      <Modal
        basic
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        size="small"
      >
        <Modal.Content
          style={{
            width: '145%',
            position: 'relative',
            right: '24%',
            heigth: '300px',
          }}
        >
          <TemplateTable
            onClick={(item: any) => {
              setTemplate(item);
              setUseParams(item.params);
              localStorage.setItem('template', JSON.stringify(item));
              setOpen(false);
            }}
            defaultCreate={true}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button basic color="red" inverted onClick={() => setOpen(false)}>
            <Icon name="remove" /> 返回
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
}

function Chat() {
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
    <div className="bg-gray-100 min-h-screen">
      <ChatWindow messages={messages} />
    </div>
  );
}

export default Chat;
