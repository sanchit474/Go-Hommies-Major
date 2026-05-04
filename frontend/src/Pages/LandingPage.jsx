
import { Header, PostFeedSection, TopPackages } from '../Components'
import { BudgetOptimizer, TravelInsights } from '../Components/AI'
import Footer from '../Components/Footer/Footer'



const LandingPage = () => {




  return (
    <div className='flex flex-col'>
      
        <Header/>
        <TopPackages/>
        <div className='px-4 md:px-8 lg:px-16 py-8 max-w-7xl mx-auto w-full space-y-8'>
          <BudgetOptimizer/>
          <TravelInsights/>
        </div>
        <PostFeedSection/>  
        <Footer/>
    </div>
  )
}

export default LandingPage