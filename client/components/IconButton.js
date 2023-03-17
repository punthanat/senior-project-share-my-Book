import React from 'react'
import Icon from './Icon'
import styled, {css} from 'styled-components'
import PropTypes from 'prop-types'
import {COLORS} from '../styles/colors'

const DisabledStyled = css`
  color: ${COLORS.WHITE};
  background-color: ${COLORS.GRAY_LIGHT};
`

const secondaryStyled = css`
  color: ${COLORS.PRIMARY};
  background-color: ${COLORS.GRAY_LIGHT_1};
  box-shadow: 0 5px 20px ${COLORS.GRAY_LIGHT};
`

const secondaryActiveStyled = css`
  transition: 0.3s;
  color: ${COLORS.WHITE};
  background-color: ${COLORS.PRIMARY};
`

const IconButtonStyled = styled.button`
  all: unset;
  border: none;
  ${(props) => props.padding && `padding: ${props.padding};`}
  ${(props) => props.borderRadius && `border-radius:${props.borderRadius};`}
  ${(props) => props.btnStyle.toLowerCase() === 'secondary' && secondaryStyled}
  ${(props) => props.isActive && secondaryActiveStyled}
   ${(props) => props.isDisabled && DisabledStyled}
  ${(props) => props.btnWidth && `width: ${props.btnWidth};`}
  ${(props) => props.btnHeight && `height: ${props.btnHeight};`}
  text-align: center;

  &:hover {
    cursor: pointer;
    ${(props) =>
      !props.isDisabled &&
      props.btnStyle.toLowerCase() === 'secondary' &&
      secondaryActiveStyled}
  }
`

const IconButton = ({
  name,
  onClick,
  borderRadius,
  isActive,
  isDisabled,
  type,
  iconSize,
  btnStyle,
  btnWidth,
  btnHeight,
  padding,
  children,
}) => {
  return (
    <IconButtonStyled
      onClick={() => !isDisabled && type !== 'submit' && onClick()}
      borderRadius={borderRadius}
      isActive={isActive}
      isDisabled={isDisabled}
      btnWidth={btnWidth}
      btnHeight={btnHeight}
      type={type}
      btnStyle={btnStyle}
      padding={padding}
    >
      <Icon name={name} size={iconSize} />
      {children}
    </IconButtonStyled>
  )
}

IconButton.propTypes = {
  name: PropTypes.object,
  onClick: PropTypes.func.isRequired,
  borderRadius: PropTypes.string,
  isActive: PropTypes.bool,
  isDisabled: PropTypes.bool,
  btnWidth: PropTypes.string,
  btnHeight: PropTypes.string,
  type: PropTypes.string,
  iconSize: PropTypes.string,
  btnStyle: PropTypes.oneOf(['primary', 'secondary']),
  padding: PropTypes.string,
  children: PropTypes.node,
}

IconButton.defaultProps = {
  btnStyle: 'primary',
}

export default IconButton
