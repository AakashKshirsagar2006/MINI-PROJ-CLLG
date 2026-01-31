import StaffLayout from "../modules/staff/layout/StaffLayout"
import PlainMessage from "../shared/components/PlainMessage";
import StaffMainPage from "../modules/staff/pages/StaffMainPage";
const staffRoutes = {
  path:'/staff',
  element:
  <StaffLayout/>,
  children:[
    { index: true, element: <StaffMainPage/> },
    { path: "*", 
      element: <PlainMessage
       head={"404 Page Not Found !"}
       linkTo="Staff Dashboard"
       link="/staff"
       >
        The page you are looking for is not available
        </PlainMessage> 
        },

  ]
}

export default staffRoutes;