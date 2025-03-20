import fashionImg from '../../assets/img/womenFashion.png';
import beautyImg from '../../assets/img/cosmetics.png';
import babyImg from '../../assets/img/baby.png';
import foodImg from '../../assets/img/groceries.png';
import utensilsImg from '../../assets/img/utensils.png';
import livingImg from '../../assets/img/living.png';
import homeInteriorImg from '../../assets/img/homeInterior.png';
import sportsImg from '../../assets/img/sports.png';
import carImg from '../../assets/img/car.png';
import booksImg from '../../assets/img/books.png';
import hobbyImg from '../../assets/img/hobby.png';
import officeImg from '../../assets/img/office.png';
import petImg from '../../assets/img/pet.png';
import healthImg from '../../assets/img/health.png';

const categories = [
  {
    id: 'fashion',
    name: '패션의류/잡화',
    image: fashionImg,
    children: [
      {
        id: 'women-fashion',
        name: '여성패션',
        children: [
          { id: 'women-clothes', name: '의류' },
          { id: 'women-shoes', name: '신발' },
          { id: 'women-bags', name: '가방/잡화' },
        ],
      },
      {
        id: 'men-fashion',
        name: '남성패션',
        children: [
          { id: 'men-clothes', name: '의류' },
          { id: 'men-shoes', name: '신발' },
          { id: 'men-bags', name: '가방/잡화' },
        ],
      },
      {
        id: 'unisex',
        name: '남녀 공용 의류',
        children: [
          { id: 't-shirts', name: '티셔츠' },
          { id: 'man-to-man', name: '맨투맨/후드티' },
          { id: 'shirts', name: '셔츠' },
          { id: 'pants', name: '바지' },
          { id: 'training', name: '트레이닝복' },
          { id: 'zipups', name: '후드집업/집업류' },
          { id: 'knitwears', name: '니트류/조끼' },
          { id: 'outer', name: '아우터' },
          { id: 'theme', name: '테마의류' },
          { id: 'couple', name: '커플룩/패밀리룩' },
          { id: 'bigsized', name: '빅사이즈' },
        ],
      },
      {
        id: 'underwear',
        name: '속옷/잠옷',
        children: [
          { id: 'women-underwear', name: '여성 속옷' },
          { id: 'men-underwear', name: '남성 속옷' },
          { id: 'etc-underwear', name: '기타 속옷 용품' },
          { id: 'pajamas', name: '잠옷/파자마' },
        ],
      },
      {
        id: 'kids-fashion',
        name: '유아동패션',
        children: [
          { id: 'babies', name: '베이비' },
          { id: 'girls', name: '여아' },
          { id: 'boys', name: '남아' },
        ],
      },
    ],
  },
  {
    id: 'beauty',
    name: '뷰티',
    image: beautyImg, // 이미지 추가
    children: [
      {
        id: 'skin-care',
        name: '스킨케어',
        children: [
          { id: 'cleanser', name: '클렌저' },
          { id: 'toner', name: '토너/스킨' },
          { id: 'serum', name: '세럼/에센스' },
          { id: 'cream', name: '크림' },
          { id: 'mask', name: '마스크팩' },
        ],
      },
      {
        id: 'makeup',
        name: '메이크업',
        children: [
          { id: 'base', name: '베이스 메이크업' },
          { id: 'eye', name: '아이 메이크업' },
          { id: 'lip', name: '립 메이크업' },
          { id: 'cheek', name: '치크' },
        ],
      },
      {
        id: 'hair-care',
        name: '헤어케어',
        children: [
          { id: 'shampoo', name: '샴푸' },
          { id: 'conditioner', name: '컨디셔너/린스' },
          { id: 'treatment', name: '트리트먼트' },
          { id: 'hair-essence', name: '헤어 에센스' },
        ],
      },
      {
        id: 'body-care',
        name: '바디케어',
        children: [
          { id: 'body-wash', name: '바디워시' },
          { id: 'body-lotion', name: '바디로션' },
          { id: 'hand-cream', name: '핸드크림' },
        ],
      },
      {
        id: 'perfume',
        name: '향수',
        children: [
          { id: 'women-perfume', name: '여성 향수' },
          { id: 'men-perfume', name: '남성 향수' },
          { id: 'unisex-perfume', name: '유니섹스 향수' },
        ],
      },
    ],
  },
  {
    id: 'baby-kids',
    name: '출산/유아동',
    image: babyImg,
    children: [
      {
        id: 'diapers',
        name: '기저귀',
        children: [
          { id: 'diaper-bands', name: '기저귀 밴드' },
          { id: 'diaper-pants', name: '기저귀 팬티' },
          { id: 'wet-wipes', name: '물티슈' },
        ],
      },
      {
        id: 'baby-food',
        name: '유아식',
        children: [
          { id: 'formula', name: '분유' },
          { id: ' 이유식', name: '이유식' },
          { id: 'snacks', name: '유아 간식' },
        ],
      },
      {
        id: 'baby-care',
        name: '유아 위생/스킨케어',
        children: [
          { id: 'lotion', name: '로션' },
          { id: 'oil', name: '오일' },
          { id: 'powder', name: '파우더' },
        ],
      },
      {
        id: 'toys',
        name: '장난감',
        children: [
          { id: 'wooden-toys', name: '목재 장난감' },
          { id: 'plastic-toys', name: '플라스틱 장난감' },
          { id: 'soft-toys', name: '인형' },
        ],
      },
      {
        id: 'kids-clothing',
        name: '유아동 의류',
        children: [
          { id: 'baby-clothes', name: '베이비 의류' },
          { id: 'kids-clothes', name: '아동 의류' },
          { id: 'accessories', name: '액세서리' },
        ],
      },
    ],
  },
  {
    id: 'food',
    name: '식품',
    image: foodImg,
    children: [
      {
        id: 'fresh-food',
        name: '신선식품',
        children: [
          { id: 'vegetables', name: '채소' },
          { id: 'fruits', name: '과일' },
          { id: 'meat', name: '정육/계란' },
          { id: 'seafood', name: '수산물' },
        ],
      },
      {
        id: 'processed-food',
        name: '가공식품',
        children: [
          { id: 'canned-food', name: '통조림/캔' },
          { id: 'instant-food', name: '즉석/간편식' },
          { id: 'sauce', name: '소스/양념' },
        ],
      },
      {
        id: 'beverages',
        name: '음료',
        children: [
          { id: 'water', name: '생수/탄산수' },
          { id: 'juice', name: '주스/음료' },
          { id: 'tea', name: '차/커피' },
          { id: 'alcohol', name: '주류' },
        ],
      },
      {
        id: 'snacks',
        name: '간식/과자',
        children: [
          { id: 'cookies', name: '쿠키/비스킷' },
          { id: 'candies', name: '사탕/초콜릿' },
          { id: 'chips', name: '스낵/과자' },
          { id: 'nuts', name: '견과류' },
        ],
      },
      {
        id: 'health-food',
        name: '건강식품',
        children: [
          { id: 'vitamins', name: '비타민' },
          { id: 'supplements', name: '영양제' },
          { id: 'diet-food', name: '다이어트 식품' },
          { id: 'sports-nutrition', name: '스포츠 뉴트리션' },
        ],
      },
    ],
  },
  {
    id: 'kitchenware',
    name: '주방용품',
    image: utensilsImg,
    children: [
      {
        id: 'cookware',
        name: '조리도구',
        children: [
          { id: 'pots', name: '냄비/프라이팬' },
          { id: 'kitchen-knives', name: '칼/가위' },
          { id: 'utensils', name: '조리도구' },
        ],
      },
      {
        id: 'tableware',
        name: '식기/테이블웨어',
        children: [
          { id: 'plates', name: '접시/볼' },
          { id: 'cups', name: '컵/잔' },
          { id: 'cutlery', name: '커트러리' },
        ],
      },
      {
        id: 'kitchen-appliances',
        name: '주방가전',
        children: [
          { id: 'microwaves', name: '전자레인지' },
          { id: 'ovens', name: '오븐/토스터' },
          { id: 'blenders', name: '믹서/블렌더' },
          { id: 'coffee-makers', name: '커피메이커' },
        ],
      },
      {
        id: 'storage-containers',
        name: '보관용기',
        children: [
          { id: 'food-storage', name: '식품 보관 용기' },
          { id: 'lunch-boxes', name: '도시락/보온 도시락' },
          { id: 'water-bottles', name: '물병/텀블러' },
        ],
      },
    ],
  },
  {
    id: 'living',
    name: '생활용품',
    image: livingImg,
    children: [
      {
        id: 'cleaning-supplies',
        name: '세제/청소용품',
        children: [
          { id: 'detergents', name: '세탁세제' },
          { id: 'dishwashing-detergent', name: '주방세제' },
          { id: 'cleaners', name: '청소용품' },
        ],
      },
      {
        id: 'home-appliances',
        name: '생활가전',
        children: [
          { id: 'vacuum-cleaners', name: '청소기' },
          { id: 'air-purifiers', name: '공기청정기' },
          { id: 'humidifiers', name: '가습기' },
        ],
      },
      {
        id: 'bathroom-supplies',
        name: '욕실용품',
        children: [
          { id: 'shampoo-conditioner', name: '샴푸/린스' },
          { id: 'body-wash', name: '바디워시' },
          { id: 'soap', name: '비누' },
          { id: 'towels', name: '수건' },
        ],
      },
      {
        id: 'home-decor',
        name: '홈데코',
        children: [
          { id: 'candles', name: '캔들/디퓨저' },
          { id: 'interior-accessories', name: '인테리어 소품' },
          { id: 'wall-decor', name: '벽 장식' },
        ],
      },
      {
        id: 'pet-supplies',
        name: '반려동물용품',
        children: [
          { id: 'dog-supplies', name: '강아지 용품' },
          { id: 'cat-supplies', name: '고양이 용품' },
          { id: 'fish-supplies', name: '어류 용품' },
          { id: 'bird-supplies', name: '조류 용품' },
        ],
      },
    ],
  },
  {
    id: 'home-interior',
    name: '홈인테리어',
    image: homeInteriorImg,
    children: [
      {
        id: 'furniture',
        name: '가구',
        children: [
          { id: 'sofas', name: '소파' },
          { id: 'beds', name: '침대' },
          { id: 'tables', name: '테이블/식탁' },
          { id: 'chairs', name: '의자' },
        ],
      },
      {
        id: 'lighting',
        name: '조명',
        children: [
          { id: 'lamps', name: '램프' },
          { id: 'ceiling-lights', name: '천장등' },
          { id: 'standing-lights', name: '스탠드' },
        ],
      },
      {
        id: 'bedding',
        name: '침구',
        children: [
          { id: 'bed-sheets', name: '침구 세트' },
          { id: 'blankets', name: '이불/담요' },
          { id: 'pillows', name: '베개' },
        ],
      },
      {
        id: 'textiles',
        name: '패브릭',
        children: [
          { id: 'curtains', name: '커튼/블라인드' },
          { id: 'rugs', name: '러그/카펫' },
          { id: 'cushions', name: '쿠션' },
        ],
      },
      {
        id: 'storage',
        name: '수납/정리',
        children: [
          { id: 'storage-boxes', name: '수납 박스/함' },
          { id: 'shelves', name: '선반/책장' },
          { id: 'organizers', name: '정리 용품' },
        ],
      },
    ],
  },
  {
    id: 'sports-leisure',
    name: '스포츠/레저',
    image: sportsImg,
    children: [
      {
        id: 'sports-clothing',
        name: '스포츠의류',
        children: [
          { id: 'sports-tops', name: '상의' },
          { id: 'sports-bottoms', name: '하의' },
          { id: 'sports-outerwear', name: '아우터' },
        ],
      },
      {
        id: 'exercise-equipment',
        name: '운동기구',
        children: [
          { id: 'home-gym', name: '홈짐/헬스' },
          { id: 'yoga-pilates', name: '요가/필라테스' },
          { id: 'outdoor-sports', name: '야외 운동' },
        ],
      },
      {
        id: 'outdoor-activities',
        name: '캠핑/등산',
        children: [
          { id: 'camping-gear', name: '캠핑 용품' },
          { id: 'hiking-gear', name: '등산 용품' },
          { id: 'fishing-gear', name: '낚시 용품' },
        ],
      },
      {
        id: 'sports-accessories',
        name: '스포츠용품',
        children: [
          { id: 'sports-bags', name: '스포츠 가방' },
          { id: 'sports-shoes', name: '스포츠 신발' },
          { id: 'sports-protective-gear', name: '보호 장비' },
        ],
      },
      {
        id: 'bikes',
        name: '자전거',
        children: [
          { id: 'road-bikes', name: '로드 바이크' },
          { id: 'mountain-bikes', name: '산악 자전거' },
          { id: 'city-bikes', name: '생활 자전거' },
        ],
      },
    ],
  },
  {
    id: 'auto-parts',
    name: '자동차용품',
    image: carImg,
    children: [
      {
        id: 'car-accessories',
        name: '차량 액세서리',
        children: [
          { id: 'car-mats', name: '차량 매트' },
          { id: 'car-covers', name: '차량 커버' },
          { id: 'car-organizers', name: '차량 정리 용품' },
        ],
      },
      {
        id: 'car-care',
        name: '차량 관리 용품',
        children: [
          { id: 'car-wash', name: '세차 용품' },
          { id: 'car-wax', name: '왁스/광택제' },
          { id: 'car-air-fresheners', name: '방향제' },
        ],
      },
      {
        id: 'tires-wheels',
        name: '타이어/휠',
        children: [
          { id: 'tires', name: '타이어' },
          { id: 'wheels', name: '휠' },
          { id: 'tire-chains', name: '체인' },
        ],
      },
      {
        id: 'car-electronics',
        name: '차량 전자기기',
        children: [
          { id: 'navigation', name: '내비게이션' },
          { id: 'dash-cams', name: '블랙박스' },
          { id: 'car-audio', name: '카오디오' },
        ],
      },
    ],
  },
  {
    id: 'books-music-dvd',
    name: '도서/음반/DVD',
    image: booksImg,
    children: [
      {
        id: 'books',
        name: '도서',
        children: [
          { id: 'fiction', name: '소설' },
          { id: 'non-fiction', name: '비소설' },
          { id: 'comics', name: '만화' },
        ],
      },
      {
        id: 'music',
        name: '음반',
        children: [
          { id: 'cd', name: 'CD' },
          { id: 'vinyl', name: 'LP' },
          { id: 'streaming-cards', name: '스트리밍 이용권' },
        ],
      },
      {
        id: 'dvd-blueray',
        name: 'DVD/블루레이',
        children: [
          { id: 'movies', name: '영화' },
          { id: 'tv-shows', name: 'TV 프로그램' },
          { id: 'concerts', name: '콘서트' },
        ],
      },
    ],
  },
  {
    id: 'toys-hobby',
    name: '완구/취미',
    image: hobbyImg,
    children: [
      {
        id: 'toys',
        name: '장난감',
        children: [
          { id: 'dolls', name: '인형' },
          { id: 'action-figures', name: '피규어' },
          { id: 'board-games', name: '보드게임' },
        ],
      },
      {
        id: 'hobbies',
        name: '취미용품',
        children: [
          { id: 'art-supplies', name: '미술 용품' },
          { id: 'craft-supplies', name: '공예 용품' },
          { id: 'model-kits', name: '프라모델' },
        ],
      },
      {
        id: 'collectibles',
        name: '수집품',
        children: [
          { id: 'stamps', name: '우표' },
          { id: 'coins', name: '동전' },
          { id: 'trading-cards', name: '트레이딩 카드' },
        ],
      },
      {
        id: 'party-supplies',
        name: '파티용품',
        children: [
          { id: 'balloons', name: '풍선' },
          { id: 'decorations', name: '장식 용품' },
          { id: 'costumes', name: '의상/코스튬' },
        ],
      },
    ],
  },
  {
    id: 'stationery-office',
    name: '문구/오피스',
    image: officeImg,
    children: [
      {
        id: 'office-supplies',
        name: '사무용품',
        children: [
          { id: 'paper', name: '종이' },
          { id: 'folders', name: '파일/폴더' },
          { id: 'pens', name: '필기구' },
        ],
      },
      {
        id: 'writing-instruments',
        name: '필기구',
        children: [
          { id: 'pens', name: '볼펜' },
          { id: 'pencils', name: '연필' },
          { id: 'markers', name: '마커' },
        ],
      },
      {
        id: 'art-supplies',
        name: '미술용품',
        children: [
          { id: 'paints', name: '물감' },
          { id: 'brushes', name: '붓' },
          { id: 'drawing-pads', name: '드로잉 패드' },
        ],
      },
      {
        id: 'school-supplies',
        name: '학용품',
        children: [
          { id: 'notebooks', name: '노트' },
          { id: 'backpacks', name: '가방' },
          { id: 'pencil-cases', name: '필통' },
        ],
      },
    ],
  },
  {
    id: 'pet-supplies',
    name: '반려동물용품',
    image: petImg,
    children: [
      {
        id: 'dog-supplies',
        name: '강아지 용품',
        children: [
          { id: 'dog-food', name: '사료' },
          { id: 'dog-snacks', name: '간식' },
          { id: 'dog-toys', name: '장난감' },
          { id: 'dog-beds', name: '침구/집' },
          { id: 'dog-clothes', name: '의류/액세서리' },
          { id: 'dog-grooming', name: '미용 용품' },
          { id: 'dog-health', name: '건강 관리 용품' },
        ],
      },
      {
        id: 'cat-supplies',
        name: '고양이 용품',
        children: [
          { id: 'cat-food', name: '사료' },
          { id: 'cat-snacks', name: '간식' },
          { id: 'cat-toys', name: '장난감' },
          { id: 'cat-litter', name: '모래/화장실' },
          { id: 'cat-scratchers', name: '스크래쳐' },
          { id: 'cat-grooming', name: '미용 용품' },
        ],
      },
      {
        id: 'fish-supplies',
        name: '어류 용품',
        children: [
          { id: 'aquariums', name: '수조/어항' },
          { id: 'aquarium-filters', name: '여과기/히터' },
          { id: 'fish-food', name: '사료' },
          { id: 'aquarium-decorations', name: '장식 용품' },
        ],
      },
      {
        id: 'bird-supplies',
        name: '조류 용품',
        children: [
          { id: 'bird-cages', name: '새장' },
          { id: 'bird-food', name: '사료' },
          { id: 'bird-toys', name: '장난감' },
          { id: 'bird-accessories', name: '용품' },
        ],
      },
    ],
  },
  {
    id: 'health-food',
    name: '헬스/건강식품',
    image: healthImg,
    children: [
      {
        id: 'vitamins',
        name: '비타민',
        children: [
          { id: 'vitamin-a', name: '비타민 A' },
          { id: 'vitamin-b', name: '비타민 B' },
          { id: 'vitamin-c', name: '비타민 C' },
          { id: 'vitamin-d', name: '비타민 D' },
          { id: 'vitamin-e', name: '비타민 E' },
          { id: 'multivitamins', name: '종합 비타민' },
        ],
      },
      {
        id: 'supplements',
        name: '영양제',
        children: [
          { id: 'probiotics', name: '프로바이오틱스' },
          { id: 'omega-3', name: '오메가-3' },
          { id: 'collagen', name: '콜라겐' },
          { id: 'glucosamine', name: '글루코사민' },
        ],
      },
      {
        id: 'diet-food',
        name: '다이어트 식품',
        children: [
          { id: 'protein-shakes', name: '단백질 쉐이크' },
          { id: 'diet-bars', name: '다이어트 바' },
          { id: 'diet-supplements', name: '다이어트 보조제' },
        ],
      },
      {
        id: 'sports-nutrition',
        name: '스포츠 뉴트리션',
        children: [
          { id: 'protein-powder', name: '단백질 파우더' },
          { id: 'bcaa', name: 'BCAA' },
          { id: 'creatine', name: '크레아틴' },
          { id: 'pre-workout', name: '프리 워크아웃' },
        ],
      },
    ],
  },
];

export default categories;
