import React, {useState, useRef} from 'react'
import Button from './Button'
import PropTypes from 'prop-types'
import styled, {css} from 'styled-components'
import {COLORS} from '../styles/colors'
import {SPACING} from '../styles/spacing'
import Icon from './Icon'
import {useOutsideAlerter} from '../hooks/useOutsideAlerter'

const SelectContainer = styled.div`
  position: relative;
`

const Dropdown = styled.div`
  position: absolute;
  box-shadow: 0 5px 20px ${COLORS.GRAY_LIGHT};
  border-radius: ${SPACING.MD};
  z-index: 1000;
  right: 0;
  overflow: hidden;
  margin-top: ${SPACING.XS};
`

const ActiveStyled = css`
  color: ${COLORS.WHITE};
  background-color: ${COLORS.PRIMARY};
  font-weight: 600;
`

const Option = styled.div`
  padding: ${SPACING.SM};
  cursor: pointer;
  min-width: 240px;
  background-color: ${COLORS.WHITE};
  color: ${COLORS.PRIMARY};
  transition: 0.2s;
  font-size: 14px;

  &:hover {
    ${ActiveStyled}
  }
  ${(props) => props.isActive && ActiveStyled}
`

const SelectDropdown = ({text, dropdownList, value, icon, onClickDropdown}) => {
  const [isToggle, setIsToggle] = useState(false)
  const selectRef = useRef()

  const toggleHandler = (toggle) => {
    if (!toggle) {
      setIsToggle(toggle)
    }
  }

  useOutsideAlerter(toggleHandler, selectRef)

  return (
    <SelectContainer ref={selectRef}>
      <Button
        btnSize="sm"
        onClick={() => setIsToggle((isShow) => !isShow)}
        borderRadius="4px"
        btnType="whiteBorder"
      >
        <Icon name={icon}></Icon> {text}
      </Button>
      {isToggle && (
        <Dropdown>
          {dropdownList?.map((item) => (
            <Option
              key={item.name}
              onClick={() => {
                setIsToggle(false)
                onClickDropdown(item.id)
              }}
              isActive={JSON.stringify(item.id) === JSON.stringify(value)}
            >
              {item.name}
            </Option>
          ))}
        </Dropdown>
      )}
    </SelectContainer>
  )
}

SelectDropdown.propTypes = {
  text: PropTypes.string,
  dropdownList: PropTypes.array,
  value: PropTypes.any,
  icon: PropTypes.object,
  onClick: PropTypes.func,
}

export default SelectDropdown
