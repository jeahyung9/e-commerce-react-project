import { useEffect, useState } from 'react';
import styles from './ReviewComponent.module.css';
import { changeReview, getReview, getReviewRate } from '../../api/reviewAPI';
import { useLocation, useParams } from 'react-router-dom';
import PageComponent from "../paging/PageComponent";
import { useCustomMove } from '../../hooks/useCustomMove';
import { format } from 'date-fns';
import { ButtonGroup, Button, FormControl, InputLabel, Select, MenuItem, Rating } from '@mui/material';
import { ArrowDropUpRounded, ArrowDropDownRounded, ThumbUpRounded } from '@mui/icons-material';
import classNames from 'classnames';

export const ReviewComponent = ({pno}) => {
    const { rate, page, size, moveToList, component } = useCustomMove();
    const [ reviewList, setReviewList ] = useState([]);
    const [ review, setReview ] = useState("");
    const [ isLike, setIsLike ] = useState(new Array(10).fill(false));
    const [ serverData, setServerData ] = useState([]);
    const location = useLocation();
    const sort = location.state ? location.state.sortBy : "reviewLike";
    const [ isExpanded, setIsExpanded ] = useState([]);

    useEffect(() => {
        moveToList({ page: 1, size: 10})
    },[]);

    useEffect(() => {
        if(!component || component === "review"){
            if(!rate || rate == 0){
                getReview(pno, [page, size, sort]).then(data => {
                    console.log(data);
                    
                    setReviewList(data.dtoList);
                    setServerData(data);
                    setIsLike(new Array(10).fill(false));
                }
                );
            }else{
                getReviewRate(pno, rate, [page, size, sort]).then(data => {
                        setReviewList(data.dtoList);
                        setServerData(data);
                        setIsLike(new Array(10).fill(false));
                    }
                )
            }
        }
    }, [page, sort, rate, component])

    useEffect(() => {
        console.log(rate);
    }, [rate])

    useEffect(() => {
        if(review !== ""){
            changeReview(review);
        }
    }, [review])

    const likeUp = (rno, index) => {
        if(!isLike[index]){
            setReviewList(reviewList.map(i => i.rno === rno ? {...i, reviewLike: i.reviewLike + 1}: i));
            reviewList.map(i =>
                {if(i.rno === rno){
                    setReview({...i, reviewLike: i.reviewLike + 1});
                }}
            )
            setIsLike(isLike.map((i, ind) => ind === index ? true : i));
        }else{
            setReviewList(reviewList.map(i => i.rno === rno ? {...i, reviewLike: i.reviewLike - 1}: i));
            reviewList.map(i =>
                {if(i.rno === rno){
                    setReview({...i, reviewLike: i.reviewLike - 1});
                }}
            )
            setIsLike(isLike.map((i, ind) => ind === index ? false : i));
        }
    }

    const sortClick = (e) => {
        moveToList({page: 1, sort: e.target.value, size: size, rate: rate});
    }

    const handleRateSelect = (e) => {
        moveToList({rate: e.target.value, page: 1, size: size, sort: sort});
    }

    const handleExpand = (index) => {
        setIsExpanded((prevExpanded) => {
            const newExpanded = [...prevExpanded];
            newExpanded[index] = !newExpanded[index];
            return newExpanded;
        });
    }

    const reviewComponent = reviewList.length === 0 ? (
        <div className={styles.noReview}>리뷰가 없습니다.</div>
    ) : (
        reviewList.map((rev, index) => 
            <div className={styles.reviewItemWrap} key={rev.rno}>
                <div className={styles.reviewLeft}>
                    <p className={styles.name}>{rev.m_name}</p>
                    <p className={styles.rating}>
                        <Rating value={rev.rate} readOnly />
                    </p>
                </div>
                <div className={styles.reviewRight}>
                    <p className={styles.productName}>&#91;{rev.businessName}&#93; {rev.od_name}</p>
                    <p className={styles.reviewTitle}>{rev.title}</p>
                    <p
                        className={
                            classNames(
                                styles.reviewContent,
                                {[styles.expanded]: isExpanded[index]},
                            )
                        }
                        ref={(el) => {
                            if (el && !isExpanded[index]) {
                                const spanElements = el.querySelectorAll('span');
                                const totalHeight = Array.from(spanElements).reduce((sum, span) => sum + span.offsetHeight, 0);
                                if (totalHeight <= el.clientHeight) {
                                    el.nextElementSibling.style.display = 'none';
                                }
                            }
                        }}
                    >
                        {rev.content.split('\n').map((line, index) => (
                            <span key={index}>
                                {line}
                                <br />
                            </span>
                        ))}
                    </p>
                    <div className={styles.expandBtnRow}>
                        <Button
                            color="textLightblack"
                            endIcon={isExpanded[index] ? <ArrowDropUpRounded /> : <ArrowDropDownRounded />}
                            onClick={() => handleExpand(index)}
                            className={styles.expandBtn}
                        >
                            {isExpanded[index] ? '접기' : '펼치기'}
                        </Button>
                    </div>
                    <div className={styles.reviewBottomRow}>
                        <p className={styles.reviewDate}>{format((new Date(rev.regDate)), "yyyy.MM.dd")}</p>
                        <Button
                            sx={{fontSize: 12}}
                            color={!isLike[index] ? 'textGray' : 'primary'}
                            variant="outlined"
                            startIcon={
                                <ThumbUpRounded
                                    color={!isLike[index] ? 'textGray' : 'primary'}
                                />
                            }
                            onClick={() => likeUp(rev.rno, index)}
                        >
                            <span>좋아요&nbsp;</span>
                            <span>{rev.reviewLike}</span>
                        </Button>
                    </div>
                </div>
            </div>
        )
    );
    
    return(
        <div className={styles.reviewContainer}>
            <h3 className={styles.title}>상품 리뷰</h3>
            <div className={styles.reviewHeader}>
                <ButtonGroup>
                    <Button
                        value="reviewLike"
                        variant={sort === "reviewLike" ? "contained" : "outlined"}
                        onClick={sortClick}
                        className={styles.sortBtn}
                    >
                        추천순
                    </Button>
                    <Button
                        value="rno"
                        variant={sort === "rno" ? "contained" : "outlined"}
                        onClick={sortClick}
                        className={styles.sortBtn}
                    >
                        최신순
                    </Button>
                </ButtonGroup>
                <div className={styles.rateSelectBox}>
                    <FormControl fullWidth>
                        <InputLabel id="rateSelect">평점 선택</InputLabel>
                        <Select
                            id="rateSelect"
                            label="평점 선택"
                            onChange={handleRateSelect}
                        >
                            <MenuItem value="0" selected="selected">전체 평점 보기</MenuItem>
                            <MenuItem value="5">
                                <Rating value="5" readOnly />
                            </MenuItem>
                            <MenuItem value="4">
                                <Rating value="4" readOnly />
                            </MenuItem>
                            <MenuItem value="3">
                                <Rating value="3" readOnly />
                            </MenuItem>
                            <MenuItem value="2">
                                <Rating value="2" readOnly />
                            </MenuItem>
                            <MenuItem value="1">
                                <Rating value="1" readOnly />
                            </MenuItem>
                        </Select>
                    </FormControl>
                </div>
            </div>
            <div className={styles.reviewWrap}>
                {reviewComponent}
            </div>
            <PageComponent 
                serverData={serverData}
                movePage={moveToList}
                sort={sort}
                rate={rate}
                component={"review"}
            />
        </div>
    )
}