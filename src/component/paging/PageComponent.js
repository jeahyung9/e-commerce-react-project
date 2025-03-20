import { Button } from '@mui/material';
import { KeyboardArrowLeftRounded, KeyboardArrowRightRounded } from '@mui/icons-material';
import classNames from 'classnames';
import styles from './PageComponent.module.css';

//페이지 처리를 담당할 컴포넌트. 공통으로 제작하면, 타 컴포넌트에서 가져다 사용할 수 있음.

//const PageComponent = ({ serverData, movePage}) => {
const PageComponent = ({ serverData, movePage, sort, rate, mno, menu, component }) => {
    //페이징 처리는 ListComponent에 있으므로, 그 데이터를 사용함

    return (
        <>
          <div className={styles.paginationContainer}>
            <Button
              color="textBlack"
              disabled={!serverData.prev}
              onClick={() => movePage({ page: serverData.prevPage, size: serverData.pageRequestDTO.size, sort: sort, rate: rate, mno: mno, menu: menu, component: component })}
              className={styles.prev}
            >
              <KeyboardArrowLeftRounded />
            </Button>
            {Array.isArray(serverData.pageNumList) && serverData.pageNumList.map((pageNum) => (
              <Button
                key={pageNum}
                color="textBlack"
                className={classNames(styles.pageNum, {[styles.active]: serverData.current === pageNum})}
                onClick={() => movePage({ page: pageNum, size: serverData.pageRequestDTO.size, sort: sort, rate: rate, mno: mno, menu: menu, component: component })}
              >
                {pageNum}
              </Button>
            ))}
            <Button
              color="textBlack"
              disabled={!serverData.next}
              onClick={() => movePage({ page: serverData.nextPage, size: serverData.pageRequestDTO.size, sort: sort, rate: rate, mno: mno, menu: menu, component: component })}
              className={styles.next}
            >
              <KeyboardArrowRightRounded />
            </Button>
          </div>
        </>
    );
}

export default PageComponent;
