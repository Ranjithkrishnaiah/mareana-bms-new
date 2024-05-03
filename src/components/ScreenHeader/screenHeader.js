import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import './styles.scss';

const ScreenHeader = (props) => {
  const [resultDate, setResultDate] = useState('');
  useEffect(() => {
    updateDate();
  }, []);
  

  const updateDate = () => {
    const date = new Date();
    const month = date.toLocaleString('default', { month: 'long' });
    const latestDate = date.getDate();
    const year = date.getFullYear();
    const resultDate = month + ' ' + latestDate + ',' + ' ' + year;
    setResultDate(resultDate);
  };
  return (
    <Card className='screen_header_wrap' style={props.bannerbg}>
      <div className='screen_header_head'>
        <div>
          <p className='screen_header_username'>{props.title}</p>
          <p className='screen_header_text'>{props.description}</p>
        </div>
        <div className={props.sourceClass}>
          <img src={props.source} />
        </div>
        <div>
          <span className='screen_header_resultdate'>{resultDate}</span>
        </div>
      </div>
    </Card>
  );
};

export default ScreenHeader;
