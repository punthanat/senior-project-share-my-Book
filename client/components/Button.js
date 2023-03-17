import React from 'react'
import PropTypes from 'prop-types'
import styled, {css} from 'styled-components'
import {COLORS} from '../styles/colors'
import {FONTS, FONT_SIZE} from '../styles/fonts'
import Icon from './Icon'
import {ICONS} from '../config/icon'

const size = {
  sm: '38px',
  md: '48px',
  lg: '52px',
}

const iconSizes = {
  sm: {
    item: '22px',
    outer1: '26px',
    outer2: '30px',
  },
  md: {
    item: '30px',
    outer1: '38px',
    outer2: '44px',
  },
  lg: {
    item: '34px',
    outer1: '42px',
    outer2: '48px',
  },
}

const iconSizeStyled = (size) => css`
  width: ${iconSizes[size].outer2};

  > div {
    width: ${iconSizes[size].item};
    height: ${iconSizes[size].item};
  }

  &:before {
    width: ${iconSizes[size].outer1};
    height: ${iconSizes[size].outer1};
  }

  &:after {
    width: ${iconSizes[size].outer2};
    height: ${iconSizes[size].outer2};
  }
`

const primaryStyled = css`
  background-color: ${COLORS.PRIMARY};
  color: ${COLORS.WHITE};
  border: none;

  &:hover {
    box-shadow: 0 5px 5px -5px rgba(4, 6, 44, 0.15),
      0 10px 10px -5px rgba(4, 6, 44, 0.15),
      0 15px 15px -5px rgba(4, 6, 44, 0.15),
      0 20px 20px -5px rgba(4, 6, 44, 0.15);
  }
`

const secondaryStyled = css`
  background-color: ${COLORS.GREEN};
  color: ${COLORS.PRIMARY};
  border: none;

  &:hover {
    box-shadow: 0 5px 5px -5px rgb(153 233 165 / 15%),
      0 10px 10px -5px rgba(153, 233, 165, 0.15),
      0 15px 15px -5px rgba(153, 233, 165, 0.15),
      0 20px 20px -5px rgba(153, 233, 165, 0.15);
  }
`

const whiteBorderStyled = css`
  background-color: ${COLORS.WHITE};
  color: ${COLORS.PRIMARY};
  border: 1px solid ${COLORS.PRIMARY};

  &:hover {
    background: ${COLORS.PRIMARY};
    color: ${COLORS.WHITE};
    box-shadow: 0 5px 5px -5px rgba(4, 6, 44, 0.15),
      0 10px 10px -5px rgba(4, 6, 44, 0.15),
      0 15px 15px -5px rgba(4, 6, 44, 0.15),
      0 20px 20px -5px rgba(4, 6, 44, 0.15);
  }
`

const orangeGradientStyled = css`
  background: linear-gradient(${COLORS.PINK}, ${COLORS.ORANGE});
  color: ${COLORS.WHITE};
  border: none;
`
const smSize = css`
  border-radius: 24px;
  border-radius: 8px;
  min-height: 32px;
  min-width: 100px;
  padding: 2px 10px;
  font-size: ${FONT_SIZE.MD};
  ${(props) => props.withIcon && `padding:4px ${size.sm} 4px 10px;`}
`

const mdSize = css`
  border-radius: 24px;
  border-radius: 8px;
  min-height: 48px;
  min-width: 200px;
  padding: 10px 20px;
  font-size: ${FONT_SIZE.LG};
  ${(props) => props.withIcon && `padding:10px ${size.md} 10px 20px;`}
`

const lgSize = css`
  border-radius: 40px;
  border-radius: 8px;
  min-height: 52px;
  min-width: 220px;
  padding: 10px 20px;
  font-size: ${FONT_SIZE.XL};
  ${(props) => props.withIcon && `padding:10px ${size.lg} 10px 20px;`}
`

const IconContainer = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;

  > div {
    border-radius: 50%;
    background: ${COLORS.WHITE};
    color: ${COLORS.PRIMARY};
    z-index: 2;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    > svg {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 10px;
    }
  }

  &:before,
  &:after {
    display: block;
    content: '';
    border-radius: 50%;
    transition: background 0.22s ease-in-out;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(153, 233, 165, 0.2);
  }

  &:before {
    z-index: 1;
  }

  ${(props) => props.btnSize && iconSizeStyled(props.btnSize)};
`

const ButtonStyled = styled.button`
  position: relative;
  font-family: ${FONTS.PRIMARY};
  transition: background 0.22s ease-out, color 0.22s ease-out,
    box-shadow 0.22s ease-out, transform 0.22s ease-out;

  ${(props) => props.btnSize.toLowerCase() === 'sm' && smSize}
  ${(props) => props.btnSize.toLowerCase() === 'md' && mdSize}
  ${(props) => props.btnSize.toLowerCase() === 'lg' && lgSize}
  ${(props) => props.btnType.toLowerCase() === 'primary' && primaryStyled}
  ${(props) => props.btnType.toLowerCase() === 'secondary' && secondaryStyled}
    ${(props) => props.btnType === 'whiteBorder' && whiteBorderStyled}
    ${(props) => props.btnType === 'orangeGradient' && orangeGradientStyled};
  ${(props) => props.fullWidth && 'width: 100%;'}
  ${(props) => props.bgColor && `background-color: ${props.bgColor};`}
  ${(props) => props.txtColor && `color:${props.txtColor};`}

  ${(props) => props.padding && `padding:${props.padding};`}
  ${(props) => props.borderRadius && `border-radius:${props.borderRadius};`}

  ${(props) => props.isDisabled && 'opacity:0.5;pointer-events: none;'}

  &:hover > span:last-child:before,
  &:hover > span:last-child:after {
    ${(props) => props.withIcon && 'background: rgba(153, 233, 165, 0.7);'}
  }
`

const Button = ({
  btnType,
  btnSize,
  onClick,
  children,
  withIcon,
  iconName,
  fullWidth,
  isDisabled,
  bgColor,
  txtColor,
  type,
  padding,
  borderRadius,
}) => {
  return (
    <ButtonStyled
      type={type}
      btnType={btnType}
      btnSize={btnSize}
      onClick={(e) => {
        if (isDisabled) {
          return e.preventDefault()
        }

        if (type !== 'submit' && !isDisabled) {
          return onClick(e)
        }
      }}
      withIcon={withIcon}
      fullWidth={fullWidth}
      bgColor={bgColor}
      txtColor={txtColor}
      padding={padding}
      borderRadius={borderRadius}
      isDisabled={isDisabled}
    >
      {children ?? 'click me'}
      {withIcon && (
        <IconContainer btnSize={btnSize}>
          <div>
            <Icon name={iconName} />
          </div>
        </IconContainer>
      )}
    </ButtonStyled>
  )
}

Button.propTypes = {
  btnType: PropTypes.oneOf([
    'primary',
    'secondary',
    'whiteBorder',
    'orangeGradient',
  ]),
  btnSize: PropTypes.oneOf(['sm', 'md', 'lg']),
  withIcon: PropTypes.bool,
  fullWidth: PropTypes.bool,
  iconName: PropTypes.object,
  onClick: PropTypes.func,
  children: PropTypes.node,
  bgColor: PropTypes.string,
  txtColor: PropTypes.string,
  padding: PropTypes.string,
  borderRadius: PropTypes.string,
}

Button.defaultProps = {
  btnType: 'primary',
  btnSize: 'md',
  withIcon: false,
  iconName: ICONS.faCheck,
}

export default Button
