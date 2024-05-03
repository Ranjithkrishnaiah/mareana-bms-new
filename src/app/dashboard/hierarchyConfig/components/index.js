/**
 * @author Mihir
 * @Mareana - CPV Product
 * @version  1
 * @Last Modified - 20 April, 2022
 * @Last Changed By - Mihir
 */

 import React from 'react';
 import BreadCrumbWrapper from '../../../../components/BreadCrumbWrapper';
 import Landing from '../components/landing/landingPage';
 
 const ViewPage = () => {
     return (
         <div className='custom-wrapper'>
             <BreadCrumbWrapper />
             <div className='custom-content-layout'>
                 <Landing />
             </div>
         </div>
     );
 };
 
 export default ViewPage;
 