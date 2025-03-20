import { createSearchParams, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";

const getNum = (param, defaultvalue) => {
    
    if(!param){
        return defaultvalue;
    }
    return parseInt(param);
};

export const useCustomMove = () => {
    const navigate = useNavigate();
    const { pno } = useParams();
    const location = useLocation();
    const [ queryString ] = useSearchParams();

    const page = location.state ? location.state.page : 1;
    const size = location.state ? location.state.size : 10;
    let rate = location.state ? location.state.rate : 0;
    let sort = location.state ? location.state.sortBy : null;
    let component = location.state ? location.state.component : null;
    let keyword = location.state ? location.state.keyword : null;
    
    if(pno){
        sort = "reviewLike";
    }else if(!sort){
        sort = "p_salesVol";
    }

    const queryDefault = createSearchParams({page, size}).toString();

    const moveToList = (pageParam) => {
        let pageNum = page;
        let sizeNum = pageParam.size;
        const mno = pageParam.mno;
        component = pageParam.component;
        sort = pageParam.sort ? pageParam.sort : sort;
        rate = pageParam.rate ? pageParam.rate : rate;
        let menu = pageParam.menu;
        keyword = pageParam.keyword ? pageParam.keyword : keyword;
        // console.log(pageParam);
        // console.log(rate);
        
        if(pageParam){

            pageNum = getNum(pageParam.page, 1);
        }
        
        if(pno){
            navigate(`../${pno}`,{ state: {rate: rate, page: pageNum, size : sizeNum, sortBy: sort, component: component }, replace: true });
        }else{
            navigate(``, {state: {rate: rate, page: pageNum, size : sizeNum, sortBy: sort, mno: mno, menu: menu, keyword: keyword }, replace: true });
        }

    };
    
    return {rate, page, size, sort, keyword, moveToList, component};
}