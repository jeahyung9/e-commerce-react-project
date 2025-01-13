import { Link } from 'react-router';
import { ReactComponent as VerticalLine } from '../../assets/icon/verticalLine.svg';
import iconInstagram from '../../assets/icon/ico_instagram.png';
import iconFacebook from '../../assets/icon/ico_fb.png';
import iconNaverBlog from '../../assets/icon/ico_blog.png';
import iconNaverPost from '../../assets/icon/ico_naverpost.png';
import iconYoutube from '../../assets/icon/ico_youtube.png';
import './Footer.css';

const BasicFooter = () => {
  return (
    <div className="footerWrap">
      <div className="footerTop">
        <div className="left">
          <p className="center">고객행복센터</p>
          <p className="call">
            <span className="callNumber">1644-8282</span>
            <span className="callTime">월~토요일 오전 7시 - 오후 6시</span>
          </p>
          <div className="ask">
            <div className="askBlock">
              <button type="button">카카오톡 문의</button>
              <p>
                월~토요일 <VerticalLine /> 오전 7시 - 오후 6시
                <br />
                일/공휴일 <VerticalLine /> 오전 7시 - 오후 1시
              </p>
            </div>
            <div className="askBlock">
              <button type="button">1:1 문의</button>
              <p>
                365일
                <br />
                고객센터 운영시간에 순차적으로 답변드리겠습니다.
              </p>
            </div>
            <div className="askBlock">
              <button type="button">대량주문 문의</button>
              <p>
                월~금요일 <VerticalLine /> 오전 9시 - 오후 6시
                <br />
                점심시간 <VerticalLine /> 낮 12시 - 오후 1시
              </p>
            </div>
            <p>비회원 문의 : help@pndcorp.com</p>
          </div>
        </div>
        <div className="right">
          <ul className="footerNav">
            <li>
              <Link>피앤디소개</Link>
            </li>
            <li>
              <Link>피앤디소개영상</Link>
            </li>
            <li>
              <Link>투자정보</Link>
            </li>
            <li>
              <Link>인재채용</Link>
            </li>
            <li>
              <Link>이용약관</Link>
            </li>
            <li>
              <Link>개인정보처리방침</Link>
            </li>
            <li>
              <Link>이용안내</Link>
            </li>
          </ul>
          <div className="introduction">
            <p>
              <span>
                법인명 (상호) : 주식회사 피앤디
                <VerticalLine />
                사업자등록번호 : 123-45-67890&nbsp;
              </span>
              <Link>사업자정보 확인</Link>
            </p>
            <p>통신판매업 : 제 2024-서울종로-01234 호</p>
            <p>
              주소 : 서울특별시 종로구 우정국로2길 21, 9층(관철동)
              <VerticalLine />
              대표이사 : 김주영
            </p>
            <p>
              <span>채용문의 :&nbsp;</span>
              <Link>recruit@pndcorp.com</Link>
            </p>
            <p>팩스 : 070 - 1234 - 5678</p>
          </div>
          <ul className="snsLink">
            <li>
              <img src={iconInstagram} alt="Instagram"></img>
            </li>
            <li>
              <img src={iconFacebook} alt="Facebook"></img>
            </li>
            <li>
              <img src={iconNaverBlog} alt="NaverBlog"></img>
            </li>
            <li>
              <img src={iconNaverPost} alt="NaverPost"></img>
            </li>
            <li>
              <img src={iconYoutube} alt="Youtube"></img>
            </li>
          </ul>
        </div>
      </div>
      <div className="footerBot">
        <p>
          피앤디에서 판매되는 상품 중에는 피앤디에 입점한 개별 판매자가 판매하는
          마켓플레이스(오픈마켓) 상품이 포함되어 있습니다.
          <br />
          마켓플레이스(오픈마켓) 상품의 경우 피앤디는 통신판매중개자로서
          통신판매의 당사자가 아닙니다. 피앤디는 해당 상품의 주문, 품질,
          교환/환불 등 의무와 책임을 부담하지 않습니다.
        </p>
        <em>© P&D CORP. ALL RIGHTS RESERVED</em>
      </div>
    </div>
  );
};

export default BasicFooter;
