import { useEffect } from "react"
import { useLocation } from "react-router-dom";

export const Payment = () => {
    const location = useLocation();
    const mno = location.state ? location.state.mno : 0;
    const product = location.state ? location.state.selCartItem : 0;
    useEffect(() => {
        console.log(product);
        console.log(mno);
    }, [mno])
    return <div>페이먼트</div>
}