import React, {useState} from 'react'
import {useEffect} from 'react'
import styled, {css} from 'styled-components'
import {ICONS} from '../../config/icon'
import {COLORS} from '../../styles/colors'
import {FONTS} from '../../styles/fonts'
import {SPACING} from '../../styles/spacing'
import Icon from '../Icon'

const InputControl = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: ${SPACING.SM};
  width: 100%;
  color: ${COLORS.WHITE};

  &:not(:first-of-type) {
    margin-top: 20px;
  }
`

const InputWrapper = styled.div`
  display: flex;
  height: 36px;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  position: relative;

  ${(props) => props.isTextArea && 'min-height: 36px;height: auto;'}
`

const InputIcon = styled.div`
  width: 36px;
  background-color: ${COLORS.PURPLE_3};
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`

const passwordStyled = css`
  padding-right: 36px;

  ::-ms-reveal,
  ::-ms-clear {
    display: none;
  }
`

const Input = styled.input`
  flex-grow: 1;
  background-color: ${COLORS.PURPLE_3};
  color: ${COLORS.WHITE};
  border: none;
  padding: 6px 12px;
  font-family: ${FONTS.PRIMARY};
  outline: none;
  overflow: auto;

  ::placeholder {
    color: ${COLORS.GRAY_DARK};
  }

  ${(props) => props.inputType === 'password' && passwordStyled}
`

const TextArea = styled.textarea`
  flex-grow: 1;
  background-color: ${COLORS.PURPLE_3};
  color: ${COLORS.WHITE};
  border: none;
  padding: 6px 12px;
  font-family: ${FONTS.PRIMARY};
  outline: none;
  resize: none;

  ::placeholder {
    color: ${COLORS.GRAY_DARK};
  }
`

const LabelWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0 ${SPACING.MD};
`

const ErrMessage = styled.span`
  background-color: ${COLORS.RED_2};
  color: ${COLORS.WHITE};
  padding: 2px ${SPACING.MD};
  border-radius: ${SPACING.MD};
  margin: ${SPACING.SM} 0;
  font-size: 14px;
  font-weight: 600;
`

const NormalInputControl = styled.div`
  display: flex;
  width: 100%;
`

const VisibleIcon = styled.div`
  position: absolute;
  right: ${SPACING.XS};
  top: 50%;
  cursor: pointer;
  padding: ${SPACING.XS};
  background-color: ${COLORS.PURPLE_3};
  border-radius: ${SPACING.SM};
  transform: translateY(-50%);
`

const InputWithIcon = ({
  label,
  iconName,
  inputType,
  onChange,
  placeholder,
  maxLength,
  error,
  errorMessage,
  value,
}) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (inputType === 'password') {
      setIsVisible(false)
    }
  }, [inputType])

  const passwordVisible = () => {
    setIsVisible((prev) => !prev)
  }

  return (
    <InputControl>
      <LabelWrapper>
        <label>{label}</label>
      </LabelWrapper>
      <InputWrapper isTextArea={inputType === 'textarea'}>
        <InputIcon>
          <Icon name={iconName} />
        </InputIcon>

        {inputType === 'textarea' ? (
          <TextArea
            rows="3"
            cols="25"
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
          />
        ) : (
          <Input
            type={
              inputType === 'password' && !isVisible
                ? 'password'
                : inputType === 'password' && isVisible
                ? 'text'
                : inputType
            }
            onChange={(e) => {
              if (inputType === 'number' && /[a-zA-Z]/.test(e.target.value)) {
                return
              } else {
                onChange(e.target.value)
              }
            }}
            placeholder={placeholder}
            maxLength={maxLength}
            value={value}
            inputType={inputType}
          />
        )}

        {inputType === 'password' && (
          <VisibleIcon onClick={passwordVisible}>
            <Icon name={isVisible ? ICONS.faEyeSlash : ICONS.faEye} />
          </VisibleIcon>
        )}
      </InputWrapper>

      {error && <ErrMessage>{errorMessage}</ErrMessage>}
    </InputControl>
  )
}

export default InputWithIcon
