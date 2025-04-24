import { Link } from 'react-router';
import deliveryImg from '../../assets/img/dawnDelivery.jpg';
import './SideBar.css';

const BasicSideBar = () => {
  return (
    <div className="sideBarContainer">
      <Link className="deliveryAd">
        <span>새벽 배송 안내</span>
        <img src={deliveryImg} alt="새벽 배송 안내"></img>
        <div className="bg"></div>
      </Link>
      <ul className="sideMenu">
        <li>
          <Link>피앤디 고객 제도</Link>
        </li>
        <li>
          <Link>피앤디 큐레이터</Link>
        </li>
        <li>
          <Link>코디 가이드</Link>
        </li>
      </ul>
    </div>
  );
};

export default BasicSideBar;
