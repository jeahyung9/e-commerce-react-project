import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getCartItems } from "../api/cartAPI";
import { getWishList } from "../api/wishListAPI";

// export const useCustomCount = () => {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const [wishCnt, setWishCnt] = useState(0);
//     const [cartCnt, setCartCnt] = useState(0);
//     // let wishCnt = location.state? wishCnt : 0;
//     // let cartCnt = location.state? cartCnt : 0;

//     useEffect(() => {
//     }, [wishCnt, cartCnt])
    
//     const changeCnt = () => {
//         navigate("", {state: {isCnt: true}});
//     }

//     const changeCntByProduct = () => {
//         navigate("", {state: {isCnt: true, page: 1, size: 10}});
//     }

//     return {
//         // wishCnt,
//         // cartCnt,
//         // changeCnt,
//         // changeCntByProduct
//     }
// }