import React, { useState, useEffect, useRef } from 'react';
import { cloneDeep } from 'lodash';
interface Props {
  option?: any;
  callback?: any;
  keyword?: string;
}

const ScrollSelect: React.FC = ({
  keyword = 'title',
  option,
  callback,
}: Props) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [data, setData] = useState([]);
  const selectRef = useRef(null);
  const [last, setLast] = useState(false);

  useEffect(() => {
    // 空list 支持滚动
    (window as any).iWorkSelectDom = selectRef.current;
    const options = cloneDeep(option);

    options.push({ [keyword]: '' });
    setData(options);
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const optionHeight =
      (e.currentTarget.querySelector('.option') as any)?.offsetHeight || 0;
    const scrollOffset = e.currentTarget.scrollTop;
    const targetIndex = Math.round(scrollOffset / optionHeight);

    if (targetIndex !== selectedIndex) {
      setSelectedIndex(targetIndex);
      callback(option[targetIndex]);
      targetIndex === option.length - 1 ? setLast(true) : setLast(false);
    }
  };

  return (
    <>
      <div
        ref={selectRef}
        className="container mouse-wheel-tips"
        style={{ height: '60px', overflowY: 'scroll', overflowX: 'hidden' }}
        onScroll={handleScroll}
      >
        <div className="options" style={{ padding: '10px' }}>
          {(data as any).map((item: any, index: number) => {
            return (
              <div
                className={`option ${
                  selectedIndex === index ? 'selected' : ''
                } mouse-wheel-tips`}
                key={index}
              >
                {item[keyword]}
              </div>
            );
          })}
        </div>
      </div>
      <div
        style={{
          transition: 'all .5s ease',
          opacity: last ? 0 : 1,
          height: '1px',
          background: '#81e7b9',
          filter: 'blur(2px)',
          width: '58%',
          position: 'absolute',
          left: '21%',
        }}
      ></div>
    </>
  );
};

export default ScrollSelect;
