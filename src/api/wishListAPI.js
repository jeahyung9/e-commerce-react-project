import axios from "axios";
import { API_SERVER_HOST } from "./hostAPI";

const host = `${API_SERVER_HOST}/api/wishlist`;

export const getWishList = async(mno) => {
    const res = await axios.get(`${host}/list/${mno}`);
    return res.data;
}

export const checkWishList = async(mno, pno) => {
    const res = await axios.get(`${host}/wno/${mno}/${pno}`);
    return res.data;
}

export const addWishList = async(mno, pno) => {
    const res = await axios.post(`${host}/add/${mno}/${pno}`);
    return res.data;
}

export const deleteWishList = async(wno, mno) => {
    const res = await axios.delete(`${host}/delete/${wno}/${mno}`);
    return res.data;
}