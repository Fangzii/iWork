import React, { useEffect, useState } from 'react';
import { http } from '../../../pages/utils/http';
import { useDispatch } from 'react-redux';
import Loading from '../components/Loading';
import { useSelector } from 'react-redux';
import ScrollSelect from '../components/select/select';
import { getTemplateGlobal } from '../../../pages/utils/storage';

export default function Tool() {
  const myInfo = useSelector((state: any) => state.myInfo);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [info, setInfo] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    if (myInfo?.career?.id) {
      getTemplates();
    }
  }, [myInfo]);

  const getTemplates = async () => {
    setLoading(true);
    const response = await http.get(`/api/get_templates/${myInfo.career.id}/`);
    const nowTemplate: any = await getTemplateGlobal();
    setInfo(nowTemplate);

    setLoading(false);
    const out = response.data.map((item: any) => {
      return { title: item.name, ...item };
    });

    // 当前模版提到第一个
    const index = out.findIndex((f: any) => f.id === nowTemplate.id);
    if (index > -1) {
      const replace = out.splice(index, 1)[0];
      out.unshift(replace);
    } else {
      dispatch({ type: 'UPDATE_TEMPLATE', payload: out[0] });
      setInfo(out[0]);
    }
    setData(out);
  };

  return (
    <>
      <div
        className="info-card"
        style={{ color: '#686868', background: '#f6fef9' }}
      >
        {loading ? (
          <Loading />
        ) : (
          <>
            {data.length ? (
              <>
                <ScrollSelect
                  // @ts-ignore
                  option={data}
                  callback={(item: any) => {
                    dispatch({ type: 'UPDATE_TEMPLATE', payload: item });
                    setInfo(item);
                  }}
                ></ScrollSelect>
                {info?.['name'] && (
                  <div
                    style={{
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                      overflowX: 'scroll',
                    }}
                  >
                    <div>{info?.['description']}</div>
                    <div>参数:{((info?.['params'] as []) || []).join(',')}</div>
                  </div>
                )}
              </>
            ) : (
              <Loading />
            )}
          </>
        )}
      </div>
    </>
  );
}
