import React from 'react'
import styled from 'styled-components'
import {COLORS} from '../../styles/colors'
import {FONTS} from '../../styles/fonts'
import {SPACING} from '../../styles/spacing'

const StyledInput = styled.input`
  border-radius: 4px;
  border: 1px solid ${COLORS.GRAY_DARK};
  height: 40px;
  font-family: ${FONTS.PRIMARY};
  padding: ${SPACING.SM};
  outline: none;
  font-size: 16px;
  width: 100%;

  &:focus {
    border-color: ${COLORS.PRIMARY};
    ${(props) => props.isError && 'border-color: red'}
  }

  ${(props) => props.isError && 'border-color: red'}
`

const ErrorText = styled.span`
  font-size: ${(props) => (props.errSize ? props.errSize : '12px')};
  color: red;
`

const Input = ({
  type,
  onChange,
  value,
  maxLength,
  placeholder,
  isError,
  errText,
  errSize,
}) => {
  return (
    <>
      <StyledInput
        type={type}
        onChange={onChange}
        value={value}
        maxLength={maxLength}
        placeholder={placeholder}
        isError={isError}
      />
      {isError && <ErrorText errSize={errSize}>{errText}</ErrorText>}
    </>
  )
}

export default Input
