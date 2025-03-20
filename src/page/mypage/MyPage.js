import React from "react";
import { Outlet } from "react-router-dom";
import styles from "./MyPage.module.css";
import MyPageSideBar from "../../component/mypage/MyPageSideBar";

const MyPage = () => {
  return (
    <div className={styles.mypageWrap}>
      <div className={styles.mypageContainer}>
        <h2 className={styles.mypageTitle}>
          <div className={styles.verBar} />
          <span>마이페이지</span>
        </h2>
        <div className={styles.mypageContent}>
          <div className={styles.sidebarContainer}>
            <MyPageSideBar />
          </div>
          <div className={styles.mypageOutlet}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;