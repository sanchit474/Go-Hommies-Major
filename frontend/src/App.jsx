import { RouterProvider } from 'react-router-dom';
import Routers from './Routes'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


export default function App() {
  return (
   <RouterProvider router={Routers}/>
  );
}
