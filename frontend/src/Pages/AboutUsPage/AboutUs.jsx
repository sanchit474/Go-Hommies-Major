import React from 'react'
import AboutUsHeader from '../../Components/AboutUs/AboutUsHeader'
import AboutUsDetails from '../../Components/AboutUs/AboutUsDetails'
import TravelAgencySection from '../../Components/AboutUs/TravelAgencySection'
import Footer from '../../Components/Footer/Footer'

const AboutUs = () => {
  return (
    <div className="flex  flex-col">
      <AboutUsHeader/>
      <AboutUsDetails/>
      <TravelAgencySection/>
      <Footer/>
    </div>
  )
}

export default AboutUs
