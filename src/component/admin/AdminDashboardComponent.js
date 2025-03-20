import { useEffect, useState } from 'react';
import {
  getNoticeList,
  getFaqList,
  visitorCount,
  getAdminById,
} from '../../api/adminAPI';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AdminNoticeDetailPage } from '../../page/admin/notice/AdminNoticeDetailPage';
import useCustomLogin from '../../hooks/useCustomLogin';

const AdminDashboardComponent = () => {
  const [notices, setNotices] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [dailyVisit, setDailyVisit] = useState([]);
  const [hourVisit, setHourVisit] = useState([]);
  const { isLogin, loginState, doLogout } = useCustomLogin();
  const [admin, setAdmimn] = useState();
  const navigate = useNavigate(); // 페이지 이동을 위한 네비게이션

  useEffect(() => {
      if (isLogin && loginState.eamil) {
        console.log(loginState);
        if (loginState.email) {
          getAdminById(loginState.email).then((data) => setAdmimn(data));
        } else if (loginState.adminId) {
          getAdminById(loginState.adminId).then((data) => setAdmimn(data));
        }
      }
    }, [isLogin]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const noticeData = await getNoticeList({ page: 1, size: 5 });
        setNotices(noticeData.dtoList);

        const faqData = await getFaqList({ page: 1, size: 5 });
        setFaqs(faqData.dtoList);

        const dailyCount = await visitorCount();
        console.log('dailyCount : ' + dailyCount);
        setDailyVisit(dailyCount);

        const hourCount = await visitorCount();
        console.log('hourCount : ' + hourCount);
        setHourVisit(hourCount);
      } catch (error) {
        console.error('대시보드 데이터 로드 실패:', error.message);
      }
    };

    fetchDashboardData();
  }, []);

  const handleNotice = (nno) => {
    navigate('/admin', { state: { nno } });
  };

  const handleFaq = (fno) => {
    navigate('/admin', { state: { fno } });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>📊 관리자 대시보드</h2>

      {/* 공지사항 리스트 */}
      <div style={{ marginBottom: '20px' }}>
        <h3>📢 최근 공지사항</h3>
        <ul>
          {notices.map((notice) => (
            <li key={notice.encodedId} onClick={() => handleNotice(notice.nno)}>
              {notice.title}
            </li>
          ))}
        </ul>
      </div>

      {/* FAQ 리스트 */}
      <div style={{ marginBottom: '20px' }}>
        <h3>❓ 자주 묻는 질문 (FAQ)</h3>
        <ul>
          {faqs.map((faq) => (
            <li key={faq.encodedId} onClick={() => handleFaq(faq.fno)}>
              {faq.question}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3>방문자 카운팅</h3>
        <p>
          일일 방문자 수:{' '}
          {dailyVisit && dailyVisit.counter ? dailyVisit.counter : '로딩 중...'}
        </p>
        <p>
          시간대별 방문자 수:{' '}
          {hourVisit && hourVisit.counter ? hourVisit.counter : '로딩 중...'}
        </p>
      </div>

      {/* 관리자 기능 버튼 */}
      <div>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/admin/users')} // 누르면 component 변경으로
        >
          유저 관리
        </Button>
        &nbsp;
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate('/admin/products')} // 누르면 component 변경으로
        >
          상품 관리
        </Button>
      </div>
    </div>
  );
};

export default AdminDashboardComponent;
