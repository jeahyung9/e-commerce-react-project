import { useEffect, useRef, useState } from 'react';
import './visualSlide.css';
import { ReactComponent as CaretRight } from '../../assets/icon/caretRight.svg';

const VisualSlide = ({ images }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const sliderRef = useRef(null);
  const timerRef = useRef(null);
  const transitionDuration = 500;

  useEffect(() => {
    const startSlider = () => {
      timerRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % images.length);
      }, 5000);
    };

    startSlider(); // 초기 슬라이드 시작

    return () => clearInterval(timerRef.current); // 컴포넌트 언마운트 시 타이머 정리
  }, [images, timerRef]);

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
  }, [currentSlide]);

  const handleMouseEnter = () => {
    clearInterval(timerRef.current);
  };

  const handleMouseLeave = () => {
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000);
  };

  const goToPrevSlide = () => {
    if (isSliding) return;

    setIsSliding(true);
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
    setTimeout(() => setIsSliding(false), transitionDuration);
  };

  const goToNextSlide = () => {
    if (isSliding) return;

    setIsSliding(true);
    setCurrentSlide((prev) => (prev + 1) % images.length);
    setTimeout(() => setIsSliding(false), transitionDuration);
  };

  return (
    <>
      <div className="sliderWrap">
        <div
          className="sliderContainer"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="slider" ref={sliderRef}>
            {images.map((image, index) => (
              <div className="sliderImg" key={index}>
                <img src={image} alt={`Slide ${index + 1}`} />
              </div>
            ))}
          </div>
          <button className="prevBtn" onClick={goToPrevSlide}>
            <CaretRight />
          </button>
          <button className="nextBtn" onClick={goToNextSlide}>
            <CaretRight />
          </button>
        </div>
      </div>
      <div className="relPos">
        <div className="pageNum">
          {currentSlide + 1} / {images.length}
        </div>
      </div>
    </>
  );
};

export default VisualSlide;
