import React, { Fragment, useEffect, useState } from 'react';
import Ripple from 'react-ripples';
import Chat from './common/chat/index';
// import { CSSTransition } from 'react-transition-group';
import './styles.css'; // 导入样式表
import Login from './common/login/index';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { http } from '../pages/utils/http';
import { Transition } from '@headlessui/react';
import { useDispatch } from 'react-redux';
import { Icon, Input } from 'semantic-ui-react';
import { toBackground } from '../pages/utils/postman';

interface Props {
  title: string;
}
const main: React.FC<Props> = ({ title }: Props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [occupation, setOccupation] = useState<any>();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [step, setStep] = useState<string>(''); // TODO 路由
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [careers, setCareers] = useState([]);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [token, setToken] = useState(localStorage.getItem('token'));
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [count, setCount] = useState(0);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [createCareers, setCreateCareers] = useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [careerName, setCareerName] = useState('');
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const dispatch = useDispatch();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    toBackground({ action: 'store.get', data: { key: 'token' } }).then(
      // eslint-disable-next-line react-hooks/rules-of-hooks
      (res) => {
        const token: string = String(res);
        localStorage.setItem('token', token);
        setToken(token);
      }
    );
  }, []);

  const getMyInfo = async () => {
    setLoading(true);
    const result = await http.get('/api/myinfo/').catch((error: any) => {
      clearToken();
    });

    setLoading(false);
    if (result) {
      dispatch({ type: 'UPDATE_MYINFO', payload: result.data });
      setOccupation(result.data.career);
      if (result.data.career) setStep('one');
    } else {
      toast.warning('登录失效，请重新登录');
    }
    return result;
  };

  const getCareers = async () => {
    const result = await http.get('/api/careers/');
    setCareers(result.data);
  };

  const addCareer = async () => {
    await http.post('/api/careers/', {
      name: careerName,
      description: '',
    });
    toast.success(`创建 ${careerName}职业成功`);
    setCreateCareers(false);
    setCareerName('');
    getCareers();
  };

  const setUserCareer = async () => {
    await http.put(`/api/bind_career/${occupation.id}/`);
    await getMyInfo();
    setStep('one');
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // 检查按下的是否为 Alt + Enter
    if (event.key === 'Enter') {
      addCareer();
      event.preventDefault();
    }
  };

  const clearToken = () => {
    setToken('');
    localStorage.setItem('token', '');
  };

  const render: any = {
    base: () => <Chat />,
  };

  const init = async () => {
    // 后续优化
    let isLogin;
    if (!occupation) isLogin = await getMyInfo();
    if (isLogin) {
      !careers.length && (await getCareers());
    }
  };

  if (token && !count) {
    init();
    setCount(count + 1);
  }

  return (
    <div className="OptionsContainer">
      <div>
        <>
          {/* <CSSTransition  > */}
          <Transition
            as={Fragment}
            show={step ? true : false}
            enter="transform transition duration-[400ms]"
            enterFrom="opacity-0 rotate-[-120deg] scale-50"
            enterTo="opacity-100 rotate-0 scale-100"
            leave="transform duration-200 transition ease-in-out"
            leaveFrom="opacity-100 rotate-0 scale-100 "
            leaveTo="opacity-0 scale-95 "
          >
            <div className="option">
              {render[occupation]
                ? render[occupation.name]()
                : render['base']()}
            </div>
          </Transition>
        </>
        {step ? (
          <></>
        ) : (
          <>
            {!token && <Login afterLogin={() => init()}></Login>}
            {loading ? (
              <div className="image-container">
                <img
                  style={{ verticalAlign: 'middle' }}
                  src="https://fangsblog.oss-cn-shanghai.aliyuncs.com/loading.gif"
                  alt=""
                />
              </div>
            ) : (
              <div className="option bg-gray-900 min-h-screen flex items-center justify-center">
                <div className="max-w-md mx-auto bg-white rounded-lg overflow-hidden shadow-lg inside-setp-one">
                  <div className="text-center px-6 py-4">
                    <h1 className="text-3xl font-bold text-gray-800">
                      选择您的职业
                    </h1>
                  </div>
                  <div
                    className="px-6 py-4"
                    style={{ transition: 'background-color 1s ease' }}
                  >
                    {careers.map((option: any, index) => (
                      <Ripple
                        key={index}
                        className={` p-4 rounded-lg mb-4 cursor-pointer ${occupation === option ? 'selected-color' : 'base-card'}`}
                        color="#FFA50080"
                        during={1200}
                        onClick={() => setOccupation(option)} placeholder={undefined}                      >
                        <div className="flex items-center ">
                          <div>
                            <div className="text-gray-600 text-sm">
                              {option.name}
                            </div>
                          </div>
                        </div>
                      </Ripple>
                    ))}
                    {!createCareers ? (
                      <Ripple
                        className={` p-4 rounded-lg mb-4 cursor-pointer ${false ? 'selected-color' : 'base-card'}`}
                        color="#FFA50080"
                        during={1200}
                        onClick={() => setCreateCareers(true)} placeholder={undefined}                      >
                        <div className="flex items-center ">
                          <div>
                            <div className="text-gray-600 text-sm">
                              <Icon name="plus" />
                            </div>
                          </div>
                        </div>
                      </Ripple>
                    ) : (
                      <Input
                        action={{
                          icon: 'send',
                          onClick: () => addCareer(),
                        }}
                        style={{ width: '80px' }}
                        value={careerName}
                        size="small"
                        placeholder="您的职业"
                        onChange={(evt) => setCareerName(evt.target.value)}
                        onKeyDown={handleKeyDown}
                      />
                    )}
                  </div>
                  <div className="px-6 py-4 text-center">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full disabled:opacity-50"
                      disabled={occupation === null}
                      onClick={() => setUserCareer()}
                    >
                      开始
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
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
    </div>
  );
};

export default main;
