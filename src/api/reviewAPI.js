import axios from "axios";
import { API_SERVER_HOST } from "./hostAPI";

const host = `${API_SERVER_HOST}/api/review`;

export const getReview = async(pno, [page, size, sort]) => {
    const res = await axios.get(`${host}/list/${pno}`, {
        params:{
            page: page,
            size: size,
            sortBy: sort
        }
    });

    return res.data;
}

export const getReviewRate = async(pno, rate, [page, size, sort]) => {
    const res = await axios.get(`${host}/list/rate/${pno}`, {
        params:{
            rate: rate,
            page: page,
            size: size,
            sortBy: sort
        }
    });
    return res.data;
}

export const getReviewOne = async(rno) => {
    const res = await axios.get(`${host}/review/${rno}`);

    return res.data;
}

export const getReviewCnt = async(pno) => {
    const res = await axios.get(`${host}/cnt/${pno}`);

    return res.data;
}

export const addReview = async(orno, review) => {
    const res = await axios.post(`${host}/add/${orno}`, review);

    return res.data
}

export const changeReview = async(review) => {
    const res = await axios.put(`${host}/change`, review);
    
    return res.data;
}