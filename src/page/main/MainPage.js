import VisualSlide from '../../component/visual/visualSlide';
import styles from './MainPage.module.css';
import image1 from '../../assets/img/visual/visualImage1.png';
import image2 from '../../assets/img/visual/visualImage2.png';
import image3 from '../../assets/img/visual/visualImage3.png';
import ProductsSection from '../../component/main/productsSection';
import CategoriesSection from '../../component/main/categoriesSection';
import { useEffect, useMemo, useState } from 'react';
import useCustomLogin from '../../hooks/useCustomLogin';
import { getMember } from '../../api/MemberApi';

const MainPage = () => {
  const { isLogin, loginState } = useCustomLogin();
  const [ member, setMember ] = useState();
  const images = [image1, image2, image3];

  useEffect(() => {
      if(isLogin){
        if(loginState.email){
          getMember(loginState.email).then(data => {
            setMember(data);
          });
        }
      }else{
        setMember(null);
      }
  }, [isLogin]);

  const sections = useMemo(
    () => [
      {
        title: '픽앤딜 베스트',
        name: 'best',
        sortOption: {
          sort: 'p_salesVol',
        },
      },
      {
        title: '신상품',
        name: 'new',
        sortOption: {
          sort: 'pno',
        }
      },
      {
        title: '매진임박',
        name: 'soldOut',
        sortOption: {
          sort: 'p_stock',
          order: true, // 내림차순
        },
      },
    ],
    []
  );

  return (
    <>
      <VisualSlide images={images} />
      <div className={styles.mainWrap}>
        <CategoriesSection className={styles.section} mno={member?.mno}/>
        {sections.map((section) => (
          <ProductsSection
            className={styles.section}
            key={section.title}
            title={section.title}
            sortOption={section.sortOption}
            size={15}
            mno={member?.mno}
          />
        ))}
      </div>
    </>
  );
};

export default MainPage;
