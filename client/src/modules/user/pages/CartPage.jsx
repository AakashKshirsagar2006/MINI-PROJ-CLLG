import { useContext} from "react";
import{ AuthContext} from "../../../shared/store/auth-context";
import { useCart } from "../../../shared/store/cart-context";
import PlainMessage from "../../../shared/components/PlainMessage";
import { useOrder } from "../../../shared/store/order-context";
import CartFoodItemQtyMng from "../components/CartFoodQtyMng";
import Footer from "../components/Footer";
import CheckOutCard from "../components/CheckoutCard";

const CartPage = () => {
  const {userState} = useContext(AuthContext);
  
const {items}=useCart();

const { orderDetails} = useOrder();
   
  return (
<> 
   {!userState? (<PlainMessage head={"Not Loged In !"} linkTo="Login" link="/login">Please login to view your cart.</PlainMessage>):(
    orderDetails?<CheckOutCard orderDetails={orderDetails}/>:
   (
  Object.keys(items).length === 0
    ? (
        <PlainMessage
          head={"No Food Items In Your Cart !"}
          linkTo="Menu"
          link="/menu"
        >
          Add food items to place order
        </PlainMessage>
      )
    : (
        <CartFoodItemQtyMng />
      )
)

 )         }
          
   </>
  );
};

export default CartPage;