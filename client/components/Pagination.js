import React from 'react'
import styled, {css} from 'styled-components'
import {ICONS} from '../config/icon'
import {DOTS, usePagination} from '../hooks/usePagination'
import {COLORS} from '../styles/colors'
import {SPACING} from '../styles/spacing'
import Icon from './Icon'

const ActiveStyle = css`
  cursor: pointer;
  color: ${COLORS.WHITE};
  background-color: ${COLORS.PRIMARY};
  font-weight: 600;
`

const PaginationContainer = styled.ul`
  display: flex;
  gap: ${SPACING.XS};
  flex-wrap: wrap;
`

const PageItem = styled.li`
  height: 30px;
  width: 30px;
  color: ${COLORS.PRIMARY};
  border-radius: 50%;
  border: 1px solid ${COLORS.PRIMARY};
  font-size: 16px;
  line-height: 28px;
  text-align: center;
  user-select: none;
  transition: 0.2s;

  &:hover,
  &.-active {
    ${(props) => !props.disabled && ActiveStyle}
  }
`

const Pagination = ({currentPage, onPageChange, totalPage, siblingCount}) => {
  const paginationRange = usePagination({totalPage, siblingCount, currentPage})

  return (
    <PaginationContainer>
      <PageItem
        disabled={currentPage === 1}
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
      >
        <Icon name={ICONS.faChevronLeft} />
      </PageItem>
      {paginationRange.map((page, i) => {
        if (page === DOTS) {
          return (
            <PageItem key={`dot-${i}`} disabled={true}>
              {DOTS}
            </PageItem>
          )
        } else {
          return (
            <PageItem
              key={`pageNo-${page}`}
              onClick={() => onPageChange(page)}
              className={currentPage === page && '-active'}
            >
              {page}
            </PageItem>
          )
        }
      })}
      <PageItem
        disabled={currentPage === totalPage}
        onClick={() => currentPage < totalPage && onPageChange(currentPage + 1)}
      >
        <Icon name={ICONS.faChevronRight} />
      </PageItem>
    </PaginationContainer>
  )
}

export default Pagination
