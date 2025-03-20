import axios from "axios"
import { API_SERVER_HOST } from "./hostAPI";

const host = `${API_SERVER_HOST}/api/qa`;

export const getQAList = async(pno, [page, size]) => {
    const res = await axios.get(`${host}/list/${pno}`, {
        params:{
            page: page,
            size: size,
            sortBy: "qno"
        }
    });

    return res.data;
}

export const getQAListBymno = async(mno) => {
    const res = await axios.get(`${host}/list/my/${mno}`);

    return res.data;
}

export const addQA = async(qa) => {
    const res = await axios.post(`${host}/add`, qa);

    return res.data;
}

export const changeQA = async(qa) => {
    const res = await axios.put(`${host}/change`, qa);

    return res.data;
}

export const deleteQA = async(qno) => {
    const res = await axios.delete(`${host}/delete/${qno}`);

    return res.data
}