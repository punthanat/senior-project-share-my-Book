import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {COLORS} from '../styles/colors'
import {SPACING} from '../styles/spacing'

const DividerStyled = styled.div`
  height: 1px;
  background: ${(props) =>
    props.dashLine
      ? `repeating-linear-gradient(
    to right,${props.lineColor ?? COLORS.GRAY_DARK} 0,${
          props.lineColor ?? COLORS.GRAY_DARK
        } ${SPACING.SM},
    transparent ${SPACING.SM},
    transparent ${SPACING.MD}
  )`
      : `${props.lineColor ?? COLORS.GRAY_DARK_1}`};

  ${(props) => props.lineMargin && `margin: ${props.lineMargin};`}
`

const Divider = (props) => {
  return <DividerStyled {...props}></DividerStyled>
}

Divider.propTypes = {
  lineColor: PropTypes.string,
  lineLength: PropTypes.string,
  dashLine: PropTypes.bool,
  spacing: PropTypes.string,
  lineMargin: PropTypes.string,
}

export default Divider
