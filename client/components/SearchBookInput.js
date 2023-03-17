import React, {useEffect, useState} from 'react'
import SearchDropdown from './SearchDropdown'
import SelectDropdown from './SelectDropdown'
import styled from 'styled-components'
import IconButton from './IconButton'
import usePublishers from '../api/query/usePublishers'
import useTypes from '../api/query/useTypes'
import {useRouter} from 'next/router'
import {SPACING} from '../styles/spacing'
import {COLORS} from '../styles/colors'
import {FONTS} from '../styles/fonts'
import {ICONS} from '../config/icon'
import {bookSortList} from '../config/sortList'
import PropTypes from 'prop-types'
import {default_param} from '../config/searchQuery'
import Icon from './Icon'

const ToolContainer = styled.section`
  max-width: 95%;
  margin: 0 ${SPACING.MD};
  width: 100%;
  padding: ${SPACING.MD};
`

const ToolItemContainer = styled.div`
  display: flex;
  gap: ${SPACING.LG};

  > button {
    flex-shrink: 0;
  }
`

const FilterContainer = styled.div`
  transition: 0.3s;
  border-radius: ${SPACING.MD};
  background-color: ${COLORS.GRAY_LIGHT_3};
  padding: ${SPACING.MD} ${SPACING.MD} 0;
  margin: ${SPACING.MD} 0 0;
  display: flex;
  flex-direction: column;
  gap: ${SPACING.MD};
  flex-wrap: wrap;

  > * {
    flex: 1;
  }

  @media (min-width: 768px) {
    flex-direction: row;
  }
`

const SearchInputContainer = styled.form`
  height: 40px;
  width: 100%;
  position: relative;

  > button {
    position: absolute;
    top: 3px;
    right: 3px;
    width: 36px;
    height: 36px;
  }
`

const Input = styled.input`
  border-radius: 20px;
  border: 1px solid ${COLORS.GRAY_DARK};
  font-family: ${FONTS.PRIMARY};
  padding: ${SPACING.SM} ${SPACING.LG};
  outline: none;
  font-size: 16px;
  width: 100%;

  &:focus {
    border-color: ${COLORS.PRIMARY};
  }
`

const TypeContainer = styled.section`
  display: flex;
  flex-wrap: wrap;
  gap: ${SPACING.SM};
  flex-basis: 100%;
`

const TypeItem = styled.div`
  display: flex;
  align-items: center;
  width: max-content;
  padding: 4px 12px;
  background-color: ${COLORS.PRIMARY};
  border-radius: 6px;
  color: ${COLORS.WHITE};
  gap: 8px;
  cursor: pointer;
  transition: 200ms;
  user-select: none;

  &:hover {
    opacity: 0.7;
  }
`

const SortWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: ${SPACING.MD};
`

const ClearButton = styled.div`
  background-color: ${COLORS.RED_1};
  color: ${COLORS.WHITE};
  padding: ${SPACING.XS} ${SPACING.SM};
  border-radius: ${SPACING.XS};
  display: flex;
  align-items: center;
  gap: ${SPACING.SM};
  cursor: pointer;
`

const SearchBookInput = ({baseSearchPath}) => {
  const router = useRouter()
  const [queryParam, setQueryParam] = useState(router.query)
  const currentTypes = router?.query?.types && router?.query?.types?.split(',')
  const {data: types} = useTypes()
  const {data: publishers} = usePublishers()

  const handleClickSearch = (e) => {
    e.preventDefault()
    router.push({pathname: baseSearchPath, query: {...queryParam, page: 1}})
  }

  const sortClick = (val) => {
    let param = queryParam
    if (
      JSON.stringify({
        sortBy: router?.query?.sortBy,
        isDescending: router?.query?.isDescending,
      }) === JSON.stringify(val)
    ) {
      param = {...param, ...bookSortList[0].id}
    } else {
      param = {...param, ...val}
    }

    router.push({
      pathname: baseSearchPath,
      query: {
        ...param,
      },
    })
  }

  useEffect(() => {
    setQueryParam(router.query)
  }, [router])

  return (
    <ToolContainer>
      <ToolItemContainer>
        <SearchInputContainer onSubmit={handleClickSearch}>
          <Input
            type="search"
            placeholder="ค้นหาหนังสือ..."
            onChange={(e) => {
              setQueryParam({
                ...queryParam,
                searchText: e.target.value,
              })
            }}
            value={queryParam.searchText || ''}
          />
          <IconButton
            type="submit"
            name={ICONS.faSearch}
            borderRadius="50%"
            btnStyle="secondary"
            onClick={handleClickSearch}
          />
        </SearchInputContainer>
      </ToolItemContainer>

      <FilterContainer>
        <SearchDropdown
          dataList={
            currentTypes
              ? types?.filter((type) => currentTypes.indexOf(type.id) === -1)
              : types
          }
          onClickDropdown={(val) =>
            router.push({
              pathname: baseSearchPath,
              query: {
                ...queryParam,
                types: queryParam.types ? queryParam.types + ',' + val : val,
                page: 1,
              },
            })
          }
          placeHolder="ค้นหาประเภทหนังสือ..."
        />
        <SearchDropdown
          dataList={publishers}
          onClickDropdown={(val) =>
            router.push({
              pathname: baseSearchPath,
              query: {...queryParam, publisher: val, page: 1},
            })
          }
          placeHolder="ค้นหาสำนักพิมพ์..."
          showCurrentData
          value={router.query.publisher}
        />

        <SortWrapper>
          {(router.query.publisher || router.query.types) && (
            <ClearButton
              onClick={() =>
                router.push({
                  pathname: baseSearchPath,
                  query: {
                    ...default_param,
                    searchText: router.query.searchText,
                  },
                })
              }
            >
              <span> ล้างการกรอง</span>
              <Icon name={ICONS.faXmark} />
            </ClearButton>
          )}

          <SelectDropdown
            dropdownList={bookSortList}
            text="เรียงจาก"
            icon={ICONS.faSort}
            onClickDropdown={(val) => sortClick(val)}
            value={{
              sortBy: router?.query?.sortBy,
              isDescending: router?.query?.isDescending,
            }}
          />
        </SortWrapper>

        {currentTypes?.length > 0 && (
          <TypeContainer>
            {currentTypes?.map((type) => (
              <TypeItem
                key={type}
                onClick={() => {
                  router.push({
                    pathname: baseSearchPath,
                    query: {
                      ...queryParam,
                      types: currentTypes
                        .filter((currentType) => currentType !== type)
                        .toString(),
                    },
                  })
                }}
              >
                {types?.find((item) => item.id === type)?.name}
              </TypeItem>
            ))}
          </TypeContainer>
        )}
      </FilterContainer>
    </ToolContainer>
  )
}

SearchBookInput.propTypes = {
  baseSearchPath: PropTypes.string,
}

export default SearchBookInput
