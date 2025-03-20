import axios from "axios";
import { API_SERVER_HOST } from "./hostAPI";

const host = `${API_SERVER_HOST}/api/cart`;

export const addCartItem = async(cartItem) => {
    const res = await axios.post(`${host}/add`, cartItem);

    return res.data;
}

export const getCartItems = async(mno) => {
    const res = await axios.get(`${host}/${mno}`);
    
    return res.data;
}

export const getCartItemOne = async(mno, cino) => {
    const res = await axios.get(`${host}/${mno}/${cino}`);

    return res.data;
}

export const changeCartItem = async(cartItem) => {
    const res = await axios.put(`${host}/change`, cartItem);
    
    return res.data;
}

export const deleteCartItem = async(cino, mno) => {
    const res = await axios.delete(`${host}/delete/${cino}/${mno}`);

    return res.data;
}