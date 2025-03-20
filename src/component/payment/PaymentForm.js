import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './PaymentForm.module.css';
import { saveOrder, savePayment } from '../../api/paymentApi';
import { getMember } from '../../api/MemberApi';
import useCustomLogin from '../../hooks/useCustomLogin';
import { addComma } from '../../hooks/useCustomPrice';
import Checkbox from '../../component/checkbox/checkbox';
import classNames from 'classnames';
import { ExpandMoreRounded, ExpandLessRounded } from '@mui/icons-material';
import { ReactComponent as Kakaopay } from '../../assets/icon/kakaopay.svg';
import toss from '../../assets/icon/toss.png';
import { deleteCartItem, getCartItems } from '../../api/cartAPI';
import { useAppContext } from '../../context/Context';

const PaymentForm = () => {
  const { isLogin, loginState } = useCustomLogin();
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [member, setMember] = useState(null);
  const [orderInfo, setOrderInfo] = useState({
    o_totalPrice: '',
    o_address: '',
    o_reciver: '',
    o_reciverPhoNum: '',
    pg: 'kakaopay',
    payMethod: 'card'
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const { setCartCnt } = useAppContext();

  // IMP 초기화
  useEffect(() => {
    if (window.IMP) {
      window.IMP.init('imp44080112');
    }
  }, []);

  // 회원 정보 로드 및 기본값 설정
  useEffect(() => {
    console.log(loginState);
    const email = loginState.email || loginState.m_email;
    const loadMemberInfo = async () => {
      if (isLogin) {
        try {
          const data = await getMember(email);
          setMember(data);
          
          if (data) {
            setOrderInfo(prev => ({
              ...prev,
              o_reciver: data.m_name || '',
              o_address: data.def_addr || '',
              o_reciverPhoNum: data.m_phoNum || ''
            }));
          }
        } catch (error) {
          console.error('회원 정보 로드 실패:', error);
          alert('회원 정보를 불러오는데 실패했습니다.');
        }
      } else {
        alert("로그인이 필요합니다.");
        navigate('/');
      }
    };

    loadMemberInfo();
  }, [isLogin, loginState.email, navigate]);

  // 장바구니 상품 로드
  useEffect(() => {
    if (location.state && location.state.selCartItem) {
      setProducts(location.state.selCartItem);
    } else {
      alert('장바구니에서 상품을 선택해주세요.');
      navigate('/cart');
    }
  }, [location.state, navigate]);

  // 총 가격 계산 (할인 적용)
  useEffect(() => {
    // const totalPrice = products.reduce((sum, product) => {
    //   const discountRate = product.p_salePer ? (100 - product.p_salePer) / 100 : 1;
    //   const discountedPrice = Math.ceil((product.p_price * discountRate) / 10) * 10;
    //   const productTotal = discountedPrice * (product.c_cnt || 1);
    //   return sum + productTotal;
    // }, 0);
    
    let totalPrice = 0;
    let totalDiscountPrice = 0;
    products.map(product => {
      totalPrice += Math.ceil((product.c_cnt * (product.p_price + product.od_price)) / 10) * 10;
      totalDiscountPrice += Math.ceil((product.c_cnt * ((product.p_price * ((100 - product.p_salePer) / 100)) + product.od_price)) / 10) * 10;
    });

    setTotalPayment(totalPrice);
    setTotalDiscount(totalDiscountPrice);
    
    setOrderInfo(prev => ({ ...prev, o_totalPrice: Math.floor(totalPrice).toString() }));
  }, [products]);

  const pgProviders = [
    { id: 'kakaopay', name: '카카오페이', pg: 'kakaopay.TC0ONETIME', icon: <Kakaopay /> },
    { id: 'tosspayments', name: '토스페이먼츠', pg: 'uplus.tlgdacomxpay', icon: <img src={toss} alt="토스"></img> },
    { id: 'inicis', name: 'KG이니시스', pg: 'html5_inicis.INIpayTest', icon: '🟢' },
    { id: 'mobilians', name: '모빌리언스', pg: 'mobilians', icon: '🟣' },
    { id: 'payco', name: '페이코', pg: 'payco', icon: '🔴' },
    { id: 'tosspay', name: '토스페이', pg: 'tosspay', icon: '💙' },
    { id: 'naverpay', name: '네이버페이', pg: 'naverco', icon: '💚' }
  ];

  // const handleQuantityChange = (id, delta) => {
  //   setProducts(prevProducts => {
  //     return prevProducts.map(product => {
  //       if (product.pno === id) {
  //         const newCount = Math.max(1, (product.c_cnt || 1) + delta);
  //         return { ...product, c_cnt: newCount };
  //       }
  //       return product;
  //     });
  //   });
  // };

  const toggleExpand = () => {
    setIsExpanded(prev => !prev);
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const onClickPayment = async () => {
    if (onClickPayment.isProcessing) return;
    onClickPayment.isProcessing = true;

    try {
      // Validation checks
      if (!orderInfo.o_reciver.trim()) {
        alert('수령인을 입력해주세요.');
        return;
      }
      if (!orderInfo.o_address.trim()) {
        alert('배송지를 입력해주세요.');
        return;
      }
      if (!orderInfo.o_reciverPhoNum) {
        alert('연락처를 입력해주세요.');
        return;
      }
      if (!orderInfo.o_totalPrice || parseInt(orderInfo.o_totalPrice) <= 0) {
        alert('결제 금액을 입력해주세요.');
        return;
      }
      if (!member?.mno) {
        alert('회원 정보를 불러오지 못했습니다. 다시 시도해주세요.');
        return;
      }

      const orderDetails = products.map(product => {
        if (!product.odno) {
          throw new Error(`상품 ${product.p_name}의 옵션 정보가 없습니다.`);
        }
        
        // 할인된 가격 계산
        const discountRate = product.p_salePer ? (100 - product.p_salePer) / 100 : 1;
        const discountedPrice = Math.ceil((product.p_price * discountRate) / 10) * 10;
        
        return {
          or_price: discountedPrice,
          or_count: product.c_cnt || 1,
          odno: product.odno,
          rno: null,
          review_flag: false
        };
      });

      const orderData = {
        o_totalPrice: Number(orderInfo.o_totalPrice),
        o_address: orderInfo.o_address,
        o_reciver: orderInfo.o_reciver,
        o_reciverPhoNum: orderInfo.o_reciverPhoNum,
        status: 'ORDER_COMPLETE',
        orderDate: new Date().toISOString(),
        mno: member.mno,
        orderDetails: orderDetails
      };

      const selectedPg = pgProviders.find(pg => pg.id === orderInfo.pg);
      const merchantUid = `mid_${new Date().getTime()}`;

      // 기존 결제창 제거
      const existingIframe = document.querySelector('iframe[name^="iamport"]');
      if (existingIframe) {
        existingIframe.remove();
      }
      const existingDimmed = document.querySelector('.imp-dialog-dimmed');
      if (existingDimmed) {
        existingDimmed.remove();
      }

      const paymentData = {
        pg: selectedPg.pg,
        pay_method: 'card',
        merchant_uid: merchantUid,
        amount: parseInt(orderInfo.o_totalPrice),
        name: products.length === 1 
          ? products[0].p_name 
          : `${products[0].p_name} 외 ${products.length - 1}건`,
        buyer_name: orderInfo.o_reciver,
        buyer_tel: orderInfo.o_reciverPhoNum,
        buyer_addr: orderInfo.o_address,
        buyer_postcode: '123-456',
        display: {
          card_quota: [0],
          popup: true,
        },
        m_redirect_url: window.location.origin + '/payment/complete',
        app_scheme: 'yourappscheme',
      };

      if (!window.IMP) {
        alert('결제 모듈이 로드되지 않았습니다. 페이지를 새로고침 해주세요.');
        return;
      }

      const IMP = window.IMP;
      IMP.request_pay(paymentData, async response => {
        if (response.success) {
          try {
            const orderResponse = await saveOrder(orderData);

            if (!orderResponse || !orderResponse.ono) {
              throw new Error('주문 번호를 가져올 수 없습니다.');
            }

            const ono = orderResponse.ono;

            const paymentResponse = await fetch('http://localhost:8080/api/payments', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                imp_uid: response.imp_uid,
                merchant_uid: response.merchant_uid,
                amount: response.paid_amount,
                pm_method: response.pay_method,
                ono: ono
              }),
            });

            if (!paymentResponse.ok) {
              throw new Error('서버 응답 오류');
            }

            const paymentResult = await paymentResponse.json();

            if (paymentResult && paymentResult.success) {
              const pmno = paymentResult.pmno;

              if (!pmno) {
                throw new Error('pmno가 서버 응답에 포함되어 있지 않습니다.');
              }

              const verifyResponse = await fetch(
                `http://localhost:8080/api/payments/verify/${response.imp_uid}/${pmno}`,
                { method: 'POST' }
              );

              if (!verifyResponse.ok) {
                throw new Error('검증 요청 실패');
              }

              const verifyResult = await verifyResponse.json();

              if (verifyResult) {
                Promise.all(products.map(item => {
                  deleteCartItem(item.cino, member.mno);
                })).then(
                  getCartItems(member.mno).then(data => {
                    setCartCnt(data.length);
                  })
                );
                navigate(`/payment/complete/${ono}`, {
                  state: { orderInfo: orderData, mno: member.mno }
                });
              } else {
                alert('결제 검증 실패');
                navigate('/payment/fail', { state: { errorMessage: '결제 검증 실패' } });
              }
            } else {
              const errorMessage = paymentResult.errorMessage || '결제 실패: 알 수 없는 오류';
              alert(errorMessage);
              navigate('/payment/fail', { state: { errorMessage } });
            }
          } catch (error) {
            alert('결제 처리 중 오류가 발생했습니다.');
          }
        } else {
          alert(`결제 실패: ${response.error_msg}`);
        }
      });
    } catch (error) {
      alert('결제 처리 중 오류가 발생했습니다.');
    } finally {
      onClickPayment.isProcessing = false;
    }
  };
  onClickPayment.isProcessing = false;

  return (
    <div className={styles.wrap}>
      <div className={styles.paymentWrap}>
        <h1 className={styles.title}>주문</h1>
        <div className={styles.sectionContainer}>
          <section className={styles.productList}>
            <div className={styles.tab}>
              <h2 onClick={toggleExpand} className={styles.tabTitle}>
                <span>주문상품</span>
                {isExpanded ? <ExpandLessRounded /> : <ExpandMoreRounded />}
              </h2>
              <div className={classNames(styles.productWrap, {[styles.expanded]: isExpanded})}>
                {products.map(product => {
                  const discountRate = product.p_salePer ? (100 - product.p_salePer) / 100 : 1;
                  const discountedPrice = Math.ceil((product.p_price * discountRate) / 10) * 10;
                  const totalPrice = discountedPrice * (product.c_cnt || 1);

                  return (
                    <div key={product.pno} className={styles.productItem}>
                      <div className={styles.productImage}>
                        <img src={product.pi_name} alt={product.p_name} />
                      </div>
                      <div className={styles.productDetails}>
                        <div className={styles.detailsLeft}>
                          <p className={styles.seller}>{product.businessName}</p>
                          <p className={styles.pOpt}>{product.od_name}</p>
                          <p className={styles.pName}>{product.p_name}</p>
                        </div>
                        <div className={styles.detailsRight}>
                          <p className={styles.tPrice}>{addComma(Math.ceil((product.c_cnt * ((product.p_price * ((100 - product.p_salePer) / 100)) + product.od_price)) / 10) * 10)}원</p>
                          {/* {product.p_salePer > 0 ? (
                            <div className={styles.priceInfo}>
                              <p className={styles.originalPrice}>
                                {addComma(product.p_price * (product.c_cnt || 1))}원
                              </p>
                              <p className={styles.discountedPrice}>
                                {addComma(totalPrice)}원
                                <span className={styles.discountRate}>({product.p_salePer}% 할인)</span>
                              </p>
                            </div>
                          ) : (
                            <p>{addComma(totalPrice)}원</p>
                          )} */}
                          <p className={styles.quantity}>{product.c_cnt || 1}개</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className={classNames(styles.paymentForm, styles.tab)}>
              <div className={styles.formGroup}>
                <label htmlFor="o_reciver">수령인</label>
                <input
                  type="text"
                  id="o_reciver"
                  name="o_reciver"
                  value={orderInfo.o_reciver}
                  onChange={handleInputChange}
                  placeholder="수령인 이름을 입력하세요"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="o_address">배송지</label>
                <input
                  type="text"
                  id="o_address"
                  name="o_address"
                  value={orderInfo.o_address}
                  onChange={handleInputChange}
                  placeholder="배송받을 주소를 입력하세요"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="o_reciverPhoNum">연락처</label>
                <input
                  type="text"
                  id="o_reciverPhoNum"
                  name="o_reciverPhoNum"
                  value={orderInfo.o_reciverPhoNum}
                  onChange={handleInputChange}
                  placeholder="'-' 없이 숫자만 입력하세요"
                  maxLength="11"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="o_totalPrice">결제 금액</label>
                <div className={styles.amountInputWrapper}>
                  <input
                    type="text"
                    id="o_totalPrice"
                    name="o_totalPrice"
                    value={addComma(totalDiscount)}
                    readOnly
                  />
                  <span className={styles.currency}>원</span>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>결제 수단 선택</label>
                <div className={styles.pgProviders}>
                  {pgProviders.map(provider => (
                    <div 
                      key={provider.id}
                      className={classNames(styles.pgProviderItem, { [styles.selected]: orderInfo.pg === provider.id })}
                      onClick={() => setOrderInfo(prev => ({ ...prev, pg: provider.id, payMethod: 'card' }))}
                    >
                      <div className={styles.pgIcon}>{provider.icon}</div>
                      <p className={styles.pgName}>{provider.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
          <section className={styles.paymentSummary}>
            <div className={styles.stickyObj}>
              <div className={classNames(styles.tab, styles.priceTab)}>
                <h3 className={styles.tabTitle}>결제금액</h3>
                <div className={styles.priceRow}>
                  <span>상품금액</span>
                  <span className={styles.price}>{addComma(totalPayment)}원</span>
                </div>
                <div className={styles.priceRow}>
                  <span>상품할인금액</span>
                  <span className={classNames(styles.price, styles.discount)}>-{addComma(totalPayment - totalDiscount)}원</span>
                </div>
                <div className={styles.priceRow}>
                  <span>배송비</span>
                  <span className={styles.price}>{0}원</span>
                </div>
                <div className={styles.horLine}></div>
                <div className={styles.priceRow}>
                  <span>결제예정금액</span>
                  <span className={styles.price}>{addComma(totalDiscount)}원</span>
                </div>
              </div>
              <div className={classNames(styles.tab, styles.termsTab)}>
                <div className={styles.checkboxWrap}>
                  <Checkbox label="결제 약관 동의" checked={agreed} onChange={() => setAgreed(!agreed)} />
                </div>
              </div>
              <button
                disabled={
                  !orderInfo.o_reciver ||
                  !orderInfo.o_address ||
                  !orderInfo.o_reciverPhoNum ||
                  !orderInfo.o_totalPrice ||
                  parseInt(orderInfo.o_totalPrice) <= 0 ||
                  !agreed
                }
                onClick={onClickPayment}
                className={styles.paymentBtn}
              >
                {addComma(totalDiscount)}원 결제하기
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;