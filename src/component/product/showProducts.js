import { useState, useEffect, useRef } from "react";
import ProductItem from "./ProductItem";
import styles from "./showProducts.module.css";
import PageComponent from "../paging/PageComponent";
import { useCustomMove } from "../../hooks/useCustomMove";
import { ToggleButtonGroup, ToggleButton } from "@mui/material";
import { useLocation } from "react-router-dom";

const ShowProducts = ({ products, loading, mno, menu }) => {
  const { page, size, sort, moveToList } = useCustomMove();
  const productsContainerRef = useRef();
  const [sortBy, setSortBy] = useState('p_salesVol');
  const location = useLocation();
  const isCate = location.state?.isCate;

  useEffect(() => {
    //console.log(products);
    if(location.state?.menu){
      setSortBy(location.state ? location.state.sortBy : 'p_salesVol');
    }
    if(location.state?.searching){
      setSortBy("p_salesVol");
    }
  }, [products]);

  useEffect(() => {
    if(isCate){
      setSortBy("p_salesVol");
    }
  }, [isCate])

  const handlePageChange = (newPage) => {
    moveToList(newPage);
    window.scrollTo({
      top: productsContainerRef.current.offsetTop - 100,
    });
  };

  const handleSortChange = (event, newSortBy) => {
    if (newSortBy !== null) {
      setSortBy(newSortBy);
    }
  };

  const sortToList = (sort) => {
    moveToList({sort: sort});
  }

  return (
    <>
      <div className={styles.btnWrap}>
        <ToggleButtonGroup value={sortBy} exclusive onChange={handleSortChange}>
          <ToggleButton value="p_salesVol" onClick={() =>sortToList("p_salesVol")}>인기순</ToggleButton>
          <ToggleButton value="pno" onClick={() =>sortToList("pno")}>최신순</ToggleButton>
          <ToggleButton value="p_salePer" onClick={() =>sortToList("p_salePer")}>할인순</ToggleButton>
          <ToggleButton value="p_price" onClick={() =>sortToList("p_price")}>가격순</ToggleButton>
        </ToggleButtonGroup>
      </div>
      <div className={styles.productsContainer} ref={productsContainerRef}>
        {products.dtoList?.map((product) => (
          <div className={styles.itemWrap}>
            <ProductItem key={product.pno} product={product} mno={mno} loading={loading} />
          </div>
        ))}
      </div>
      <PageComponent
        serverData={products}
        movePage={handlePageChange}
        mno={mno}
        sort={sort}
        menu={menu}
      />
    </>
  );
};

export default ShowProducts;
