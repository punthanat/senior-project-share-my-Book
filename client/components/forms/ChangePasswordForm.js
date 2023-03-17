import React, {useState} from 'react'
import styled from 'styled-components'
import {COLORS} from '../../styles/colors'
import {FONTS} from '../../styles/fonts'
import {SPACING} from '../../styles/spacing'
import regex from '../../utils/regex'
import Button from '../Button'

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: ${SPACING['2X']};
  margin: 0 auto;
  gap: ${SPACING['4X']};
`

const InputControl = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${SPACING.SM};

  > label {
    flex-shrink: 0;
  }
`

const Input = styled.input`
  padding: ${SPACING.SM};
  outline: none;
  border: 1px solid ${COLORS.GRAY_DARK};
  border-radius: ${SPACING.SM};
  font-family: ${FONTS.PRIMARY};
  width: 100%;
`

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
`

const ErrorMessage = styled.span`
  color: ${COLORS.RED_1};
`

const ChangePasswordForm = ({onSubmit}) => {
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
  })

  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState([])

  const onChange = (key, val) => {
    setPasswordData({...passwordData, [key]: val})
    setErrors((err) => err.filter((currentErr) => currentErr !== key))
  }

  const validate = () => {
    let errArr = []

    Object.keys(passwordData).forEach((password) => {
      if (passwordData[password].length < 1) {
        errArr.push(password)
      }
    })

    if (!regex.passwordRegex.test(passwordData['newPassword'])) {
      errArr.push('newPassword')
    }
    if (
      regex.passwordRegex.test(passwordData['newPassword']) &&
      passwordData['newPassword'] !== confirmPassword
    ) {
      errArr.push('confirmPassword')
    }

    if (errArr.length > 0) {
      setErrors(errArr)
      return false
    }

    setErrors([])
    return true
  }

  const submitHandler = (e) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(passwordData)
    }
  }

  return (
    <Form>
      <InputControl>
        <label>รหัสผ่านปัจจุบัน</label>
        <Input
          type="password"
          placeholder="รหัสผ่านปัจจุบัน"
          onChange={(e) => onChange('oldPassword', e.target.value)}
          current-password
        ></Input>
        {errors.indexOf('oldPassword') !== -1 && (
          <ErrorMessage>
            กรุณากรอกรหัสผ่านปัจจุบันของคุณเพื่อยืนยัน
          </ErrorMessage>
        )}
      </InputControl>

      <InputControl>
        <label>รหัสผ่านใหม่</label>
        <Input
          type="password"
          placeholder="รหัสผ่านใหม่"
          onChange={(e) => onChange('newPassword', e.target.value)}
        ></Input>
        {errors.indexOf('newPassword') !== -1 && (
          <ErrorMessage>
            กรุณากรอกรหัสผ่านที่ประกอบด้วย ตัวพิมพ์ใหญ่ พิมพ์เล็ก ตัวเลข
            และตัวอักษรพิเศษ ความยาว 10 - 30 ตัว
          </ErrorMessage>
        )}
      </InputControl>

      <InputControl>
        <label>ยืนยันรหัสผ่านใหม่</label>
        <Input
          type="password"
          placeholder="ยืนยันรหัสผ่านใหม่"
          onChange={(e) => setConfirmPassword(e.target.value)}
        ></Input>
        {errors.indexOf('confirmPassword') !== -1 && (
          <ErrorMessage>กรุณากรอกรหัสผ่านใหม่ให้ตรงกันเพื่อยืนยัน</ErrorMessage>
        )}
      </InputControl>
      <ButtonWrapper>
        <Button onClick={submitHandler} borderRadius="4px">
          เปลี่ยนรหัสผ่าน
        </Button>
      </ButtonWrapper>
    </Form>
  )
}

export default ChangePasswordForm
