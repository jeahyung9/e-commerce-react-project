import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFaqList } from '../../api/adminAPI';
import PageComponent from '../paging/PageComponent';
import { useCustomMove } from '../../hooks/useCustomMove';

const AdminFaqComponent = () => {
  const [faqData, setfaqData] = useState();
  const [serverData, setServerData] = useState([]);
  const navigate = useNavigate();
  const { page, size, sort, moveToList } = useCustomMove();

  useEffect(() => {
    const fetchFaqsData = async () => {
      try {
        const data = await getFaqList({ page: page, size: 10 });
        setServerData(data);
        setfaqData(data.dtoList);
      } catch (error) {
        console.error('FAQ Load Failed', error.message);
      }
    };

    fetchFaqsData();
  }, [page]);

  const handleFaq = (fno) => {
    navigate('/admin', { state: { fno } });
  };

  const handleAddFaq = () => {
    console.log('addFaq');
    navigate('/admin', { state: { addFaq: true } });
  };

  return (
    <>
      <div onClick={handleAddFaq}>등록</div>
      <div>
        <ul>
          {faqData?.map((faq) => (
            <li key={faq.encodedId} onClick={() => handleFaq(faq.fno)}>
              {faq.question}
            </li>
          ))}
        </ul>
        <PageComponent serverData={serverData} movePage={moveToList} />
      </div>
    </>
  );
};

export default AdminFaqComponent;
