import React, { useEffect, useState } from 'react';
import { http } from '../../../pages/utils/http';
import { Label } from 'semantic-ui-react';
import { useDispatch } from 'react-redux';
import Loading from '../components/Loading';
import Career from '../career.tag';
import { toBackground } from '../../../pages/utils/postman';
interface InfoProps {
  afterLogout?: () => void;
}

export default function Info({ afterLogout }: InfoProps) {
  const [myInfo, setMyInfo] = useState();
  const [color, setColor] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const getMyInfo = async () => {
    setLoading(true);
    const result = await http.get('/api/myinfo/').catch((error: any) => {});
    dispatch({ type: 'UPDATE_MYINFO', payload: result.data });
    setMyInfo(result.data);
    setLoading(false);
    return result.data;
  };

  useEffect(() => {
    getMyInfo().then(() => {
      setColor(String(randomColor()));
    });
  }, []);

  const is_warning = (fee: number) => {
    return fee <= 0;
  };

  const randomColor = () => {
    const colors = [
      'red',
      'orange',
      'yellow',
      'olive',
      'green',
      'teal',
      'blue',
      'violet',
      'purple',
      'pink',
      'brown',
      'grey',
      'black',
    ];
    // 生成一个随机索引值
    const randomIndex = Math.floor(Math.random() * colors.length);
    // 获取随机颜色
    const outColor = colors[randomIndex];
    return outColor;
  };

  const jumpFull = () => {
    const url = chrome.runtime.getURL('popup.html');
    toBackground({ action: 'tab.open', data: { url } });
  };

  return (
    <>
      <div
        className="info-card"
        style={{ color: '#686868', background: '#3a3939' }}
      >
        {loading ? (
          <Loading />
        ) : (
          <>
            {myInfo?.['career'] ? (
              <>
                <span
                  style={{ float: 'right', cursor: 'pointer' }}
                  onClick={() => jumpFull()}
                >
                  查看更多
                </span>
                <Label as="a" image color={color as any}>
                  <span style={{ fontSize: '16px' }}>
                    {myInfo?.['username']}
                  </span>
                </Label>
                <br></br>
                <Label as="a" color="teal" image style={{ marginTop: '10px' }}>
                  {myInfo?.['career']?.['name']}
                  <Label.Detail
                    style={{
                      color: is_warning(myInfo?.['fee'] ?? 0)
                        ? '#da2f2f'
                        : '#fff',
                    }}
                  >
                    ¥
                    {((myInfo?.['fee'] || 0) as number).toLocaleString(
                      'en-US',
                      {
                        minimumFractionDigits: 2,
                      }
                    )}
                  </Label.Detail>
                  <Label.Detail
                    onClick={() => {
                      toBackground({ action: 'logout' });
                      afterLogout?.();
                    }}
                  >
                    登出
                  </Label.Detail>
                </Label>
              </>
            ) : (
              <>
                <Career callback={getMyInfo}></Career>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
