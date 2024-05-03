/**
 * @author Fahad Siddiqui <fahad.siddiqui@mareana.com>
 * @Mareana - CPV Product
 * @version  1
 * @Last Modified - 05 April, 2022
 * @Last Changed By - Fahad
 */

import React, { useEffect, useState } from 'react';
import {Collapse,Input,Card,Row, Col} from 'antd';
import ScreenHeader from '../../../components/ScreenHeader/screenHeader';
import faqImage from '../../../assets/images/faq_header.png';
import BreadCrumbWrapper from '../../../components/BreadCrumbWrapper';
//services
import { faqData } from '../../../services/helpService';
import './style.scss';

const { Panel } = Collapse;
const { Search } = Input;
const screenNames = ["genealogy","view_creation","workflow","workspace","report_generator","report_designer","audit_trail_report","data_load","analysis","system_error_report","manual_data_upload","chart_personalization","view_creation"]
const FaqMain = () => {

    const [faqDatas, setFaqDatas] = useState({});

    const getScreenData = async (search) => {
        try{
            let params ={
                screens:screenNames,
                search:search
            }
            const res = await faqData(params)
            setFaqDatas(res.Data);
        }catch(error){
            setFaqDatas({});
            console.log(error)
        }
    }

    useEffect(()=>{
        getScreenData("")
    },[])
    
    const onSearch = (value)=>{
        getScreenData(value);
    }
  
  return (
    <>
        <BreadCrumbWrapper/>
        <div style={{padding:"20px"}}>
        <ScreenHeader
              bannerbg={{
                background: 'linear-gradient(180deg, #E7E6FF 0%, #FFF4F4 100%)',
              }}
              title={`Hi ${localStorage.getItem('username') || localStorage.getItem('user')},`}
              description='Let’s see what you need help with. Here are a bunch of FAQs you can take a look at!'
              source={faqImage}
              sourceClass='geanealogy-image'
            />

            <Card className='faq-card'>
                    <Row>
                        <Col span={24}>
                            <div className='search-header'>Frequently Asked Questions</div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                        <Search
                            placeholder="Search"
                            allowClear
                            enterButton="Search"
                            size="large"
                            onSearch={onSearch}
                            className="search-button"
                        />
                        </Col>
                    </Row>

                    {faqDatas && <Row className='question-pannel'>
                        <Col span={22}>
                        
                            { Object.keys(faqDatas).map((value,index)=>{
                            return(
                                <>
                                {faqDatas[value].length > 0 && <Row className='margin-top-20'>
                                    <Col><div className='screen-name'>{value.replace("_", " ").toUpperCase()}</div></Col>
                                </Row>}
                                {faqDatas[value].length > 0 &&  <Collapse className='panel-text-style' >
                                    {faqDatas[value].map((val,i)=>{
                                        return(
                                        <>
                                            <Panel header={val.question} key={i+1}>
                                                <p>{val.answer}</p>
                                            </Panel>
                                        </> 
                                        )
                                    })}
                                 </Collapse>}

                                </>
                        )
                    }
                    )}
                        
                        </Col>
                    </Row>}
                
        
            </Card>

        
        </div>
        
        
        
        
  
        
    </>
  );
};

export default FaqMain;
