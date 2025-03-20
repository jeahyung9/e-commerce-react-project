import { useEffect, useState } from "react";
import { getNoticeList } from "../../../api/adminAPI";
import AdminNoticeComponent from "../../../component/admin/AdminNoticeComponent";
import styles from '../Admin.module.css';

export const AdminNoticeListPage = () => {
  // const [noticeList, setNoticeList] = useState([]);

  // useEffect(() => {
  //   getNoticeList().then((data) => {
  //     console.log(data);
  //     setNoticeList(data);
  //   });
  // }, []);

  return (
    <>
      <div className={styles.wrap}>
        <AdminNoticeComponent />
      </div>
    </>
  );
};
