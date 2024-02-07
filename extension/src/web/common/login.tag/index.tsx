import React, { useEffect, useState, useRef } from 'react';
import { http } from '../../../pages/utils/http';
import { toast } from 'react-toastify';
// @ts-ignore
import { Input, Button } from 'semantic-ui-react';

interface LoginDialogProps {
  open?: boolean;
  afterLogin?: () => void;
}

export default function Login({ open = true, afterLogin }: LoginDialogProps) {
  let [isOpen, setIsOpen] = useState(open);
  let [loading, setLoading] = useState(false);
  let [disabled, setDisabled] = useState(false);
  let [account, setAccount] = useState('');
  let [password, setPassword] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    (inputRef as any).current.focus();
  }, []);

  async function login() {
    setLoading(true);
    setDisabled(true);

    await http
      .post('/api/login/', {
        username: account,
        password: password,
      })
      .then((res: any) => {
        toast.success('登录成功');
        localStorage.setItem('token', res.data.token);
        setIsOpen(false);
        afterLogin?.();
      })
      .catch((error: any) => {
        toast.error('登录失败，请确认账号密码是否正确');
      })
      .finally(() => {
        setLoading(false);
        setDisabled(false);
      });
  }

  async function register() {
    setLoading(true);
    setDisabled(true);

    await http
      .post('/api/register/', {
        username: account,
        password: password,
      })
      .then((res: any) => {
        login();
      })
      .catch((error: any) => {
        toast.error(`注册失败，${error.response?.data?.username.join('、')}`);
      })
      .finally(() => {
        setLoading(false);
        setDisabled(false);
      });
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // 检查按下的是否为 Alt + Enter
    if (event.key === 'Enter') {
      login();
      event.preventDefault();
    }
  };

  return (
    <>
      <div className="login-card">
        <div>
          <div>
            <div style={{ height: '24px' }}></div>
            <img
              src="https://fangsblog.oss-cn-shanghai.aliyuncs.com/logo/logo.svg"
              alt="logo"
              style={{
                width: '140px',
                position: 'absolute',
                top: '-30px',
                left: '-15px',
              }}
            />
          </div>
          <div style={{ marginTop: '12px' }}>
            <Input
              style={{ width: '100%' }}
              placeholder="请输入账号"
              value={account}
              onChange={(evt) => setAccount(evt.target.value)}
              onKeyDown={handleKeyDown}
              ref={inputRef}
            />
            <Input
              style={{ marginTop: '5px', width: '100%' }}
              type="password"
              placeholder="请输入密码"
              value={password}
              onChange={(evt) => setPassword(evt.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <br></br>
          <div>
            <Button
              compact
              primary
              style={{ float: 'right' }}
              onClick={login}
              disabled={disabled}
              loading={loading}
              size="mini"
            >
              登录
            </Button>
            <Button
              compact
              style={{ float: 'left' }}
              onClick={register}
              disabled={disabled}
              loading={loading}
              color="teal"
              size="mini"
            >
              注册
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
