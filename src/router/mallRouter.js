import { CartPage } from "../page/CartPage"
import { MainPage } from "../page/MainPage"
import { Navigate } from "react-router-dom"
import { cartRouter } from "./cartRouter"

export const mallRouter = () => {
    return [
        {
            path: "mall",
            element: <MainPage />,
        },
        {
            path: "",
            element: <Navigate replace to = "mall" />,
        },
    ]
}