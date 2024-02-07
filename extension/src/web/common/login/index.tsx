import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useState } from 'react';
import { http } from '../../../pages/utils/http';
import { toast } from 'react-toastify';
// @ts-ignore
import logo from '../../../assets/img/logo.svg';
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

  function closeModal() {
    // setIsOpen(false);
  }

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

  function openModal() {
    setIsOpen(true);
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
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    <div style={{ height: '24px' }}></div>
                    <img
                      src={logo}
                      alt="logo"
                      style={{
                        position: 'absolute',
                        bottom: '126px',
                        left: '-7px',
                        width: '140px',
                      }}
                    />
                  </Dialog.Title>
                  <div className="mt-2">
                    <Input
                      style={{ width: '100%' }}
                      label={{ icon: 'user' }}
                      labelPosition="left corner"
                      placeholder="请输入账号"
                      value={account}
                      onChange={(evt) => setAccount(evt.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    <Input
                      style={{ marginTop: '5px', width: '100%' }}
                      label={{ icon: 'unlock alternate' }}
                      labelPosition="left corner"
                      type="password"
                      placeholder="请输入密码"
                      value={password}
                      onChange={(evt) => setPassword(evt.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                  </div>

                  <div className="mt-4">
                    <Button
                      compact
                      primary
                      style={{ float: 'right' }}
                      onClick={login}
                      disabled={disabled}
                      loading={loading}
                    >
                      登录
                    </Button>
                    <Button
                      compact
                      onClick={register}
                      disabled={disabled}
                      loading={loading}
                      color="teal"
                    >
                      注册
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
