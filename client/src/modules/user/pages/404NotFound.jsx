import PlainMessage from "../../../shared/components/PlainMessage"
import Footer from "../components/Footer";

const NotFoundPage = ()=>{
  return(
    <>
    <PlainMessage head={"404 Not Found !"} linkTo="Home Page" link="/">The page you are looking for does not exist.</PlainMessage>
     
    </>
  )
}

export default NotFoundPage;