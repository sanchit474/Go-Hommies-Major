
import { Outlet } from 'react-router-dom'
import AppAppBar from '../AppAppBar/AppAppBar'
import { TripPlanningAssistant } from '../Components/AI'

const MainLayout = () => {
  return (
    <div>
        <AppAppBar/>
        <Outlet/>
        <TripPlanningAssistant/>
    </div>
  )
}

export default MainLayout