import { useEffect, useState } from 'react';
import { getMemberList } from '../../api/MemberApi';
import AdminUserManageComponent from '../../component/admin/AdminUserManageComponent';
import styles from './Admin.module.css';

export const AdminUserManagePage = () => {
  const [memberList, setMemberList] = useState([]);

  useEffect(() => {
    getMemberList().then((data) => {
      console.log(data);
      setMemberList(data);
    });
  }, []);

  return (
    <>
      <div className={styles.wrap}>
        <AdminUserManageComponent />
      </div>
    </>
  );
};
