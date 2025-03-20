import { useEffect, useState } from 'react';
import { banUser, getAdmin, getUserList, unbanUser } from '../../api/adminAPI';
import { useCustomMove } from '../../hooks/useCustomMove';
import PageComponent from '../paging/PageComponent';

const AdminUserManageComponent = () => {
  const [userList, setUserList] = useState([]);
  const [serverData, setServerData] = useState([]);
  const [userState, setUserState] = useState();
  const [id, setId] = useState(null);
  const { page, size, moveToList } = useCustomMove();

  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const data = await getUserList({ page: page, size: 10 });
        console.log(data);
        setServerData(data);
        setUserList(data.dtoList);
      } catch (error) {
        console.error('유저 목록 로딩 실패', error);
        setUserList([]);
      }
    };

    fetchUserList();
  }, [page, id]);

  const switchUserState = async (mno) => {
    console.log(mno);
    try {
      const userInfo = await getAdmin(mno);
      if (!userInfo) {
        console.error('유저 정보를 찾을 수 없습니다.');
        return;
      }

      if (!userInfo.isBan) {
        await banUser(mno);
      } else {
        await unbanUser(mno);
      }

      console.log(userInfo);
      console.log(userInfo?.isBan);

      // 유저 목록 갱신
      setUserList((prevList) =>
        prevList.map((user) =>
          user.mno === mno ? { ...user, isBan: !user.isBan } : user
        )
      );
    } catch (error) {
      console.error('유저 상태 변경 실패', error);
    }
  };

  return (
    <>
      <div>유저 관리 페이지</div>
      <div>
        <ul>
          {userList?.map((user) => (
            <li key={userList.mno}>
              {user.email}
              <button onClick={() => switchUserState(user.mno)}>
                {/* isBan이 true이면 '정지 해제' 버튼, false이면 '정지' 버튼 */}
                {user.isBan ? '정지 해제' : '정지'}
              </button>
            </li>
          ))}
        </ul>
        <PageComponent serverData={serverData} movePage={moveToList} />
      </div>
    </>
  );
};

export default AdminUserManageComponent;
