import { ReviewComponent } from "../component/review/ReviewComponent"

export const reviewRouter = () => {
    return[
        {
            path: ":pno",
            element: <ReviewComponent />,
        }
    ]
}