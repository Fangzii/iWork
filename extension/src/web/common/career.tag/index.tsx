import React, { useEffect, useState } from 'react';
import { http } from '../../../pages/utils/http';
import ScrollSelect from '../components/select/select';
import { Button } from 'semantic-ui-react';
import Loading from '../components/Loading';
interface InfoProps {
  callback?: () => void;
}

export default function Career({ callback }: InfoProps) {
  const [loading, setLoading] = useState(false);
  const [occupation, setOccupation] = useState<any>();
  const [careers, setCareers] = useState([]);

  useEffect(() => {
    getCareers();
  }, []);

  const getCareers = async () => {
    const result = await http.get('/api/careers/');
    setCareers(result.data);
  };

  const setUserCareer = async () => {
    setLoading(true);
    await http.put(`/api/bind_career/${occupation.id}/`);
    setLoading(false);
    callback?.();
  };

  return (
    <>
      <div style={{ color: '#fff' }}>
        <div className="text-center" style={{ padding: '10px' }}>
          <div>选择您的职业</div>
        </div>
        {careers.length ? (
          <ScrollSelect
            // @ts-ignore
            keyword="name"
            option={careers}
            callback={(item: any) => {
              setOccupation(item);
            }}
          ></ScrollSelect>
        ) : (
          <Loading></Loading>
        )}

        <div className="text-center " style={{ padding: '15px' }}>
          <Button
            compact
            onClick={setUserCareer}
            disabled={occupation === null}
            loading={loading}
            color="teal"
            size="mini"
          >
            开始旅程
          </Button>
        </div>
      </div>
    </>
  );
}
