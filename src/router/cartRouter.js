import { CartPage } from "../page/cart/CartPage";

export const cartRouter = () => {
    return[
        {
            path: "",
            element: <CartPage />
        }
    ]
}