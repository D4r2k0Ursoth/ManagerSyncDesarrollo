import React from 'react';
import { ImgLoadingPage } from './components/activity/ImageLoadingPage.jsx';
import { CardLoadingPage } from './components/activity/CardLoading.jsx';
import { EndSectionLoad } from './components/activity/EndSectionLoad.jsx';
import { Header } from '../src/components/Header.jsx';
import { Footer } from '../src/components/Footer.jsx';
import { PriceCard } from './components/activity/PriceCard.jsx';
export function  LoadingPage() {

  return ( 
    <div>
      <Header/>
      <ImgLoadingPage image="\image.svg"/>
      <CardLoadingPage image00="\fast.svg" image01="\efficient.svg" image02="\calendar.svg" image03="\users.svg"/>
      <EndSectionLoad image="\bg1.jpg"/>
      <PriceCard></PriceCard>
      <Footer/>
    </div>
      )
}
