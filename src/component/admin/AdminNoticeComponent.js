import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNoticeList } from '../../api/adminAPI';
import { useCustomMove } from '../../hooks/useCustomMove';
import PageComponent from '../paging/PageComponent';

const AdminNoticeComponent = () => {
  const [noticeData, setnoticeData] = useState();
  const [serverData, setServerData] = useState([]);
  const navigate = useNavigate();
  const { page, size, sort, moveToList } = useCustomMove();

  useEffect(() => {
    const fetchNoticesData = async () => {
      try {
        const data = await getNoticeList({ page: page, size: 10 });
        console.log(data);
        setServerData(data);
        setnoticeData(data.dtoList);
      } catch (error) {
        console.error('Notice Load Failed', error.message);
      }
    };

    fetchNoticesData();
  }, [page]);

  const handleNotice = (nno) => {
    navigate('/admin', { state: { nno } });
  };

  const handleAddNotice = () => {
    console.log('addNotice');
    navigate('/admin', { state: { addNotice: true } });
  };

  return (
    <>
      <div onClick={handleAddNotice}>등록</div>
      <div>
        <ul>
          {noticeData?.map((notice) => (
            <li key={notice.encodedId} onClick={() => handleNotice(notice.nno)}>
              {notice.title}
            </li>
          ))}
        </ul>
        <PageComponent serverData={serverData} movePage={moveToList} />
      </div>
    </>
  );
};

export default AdminNoticeComponent;
