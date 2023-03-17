import React, {useState} from 'react'
import styled from 'styled-components'
import {COLORS} from '../../styles/colors'
import {FONTS} from '../../styles/fonts'
import {SPACING} from '../../styles/spacing'
import {validateTel} from '../../utils/validate'
import Button from '../Button'

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: ${SPACING['2X']};
  margin: 0 auto;
  gap: ${SPACING['4X']};
`

const InputGroup = styled.div`
  width: 100%;
  display: flex;
  align-items: start;
  gap: ${SPACING.LG};
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

const TextArea = styled.textarea`
  padding: ${SPACING.SM};
  outline: none;
  border: 1px solid ${COLORS.GRAY_DARK};
  border-radius: ${SPACING.SM};
  font-family: ${FONTS.PRIMARY};
  width: 100%;
  resize: none;
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

const Error = styled.div`
  color: ${COLORS.RED_1};
`

const EditUserInfoForm = ({onSubmit, userInfo}) => {
  const [userData, setUserData] = useState(userInfo)
  const [errors, setErrors] = useState([])
  const [isChange, setIsChange] = useState(false)

  const onChange = (key, value) => {
    if (key === 'tel') {
      value = value.replace(/[^0-9]/g, '')
    }
    setUserData({...userData, [key]: value})
    setErrors(errors.filter((err) => err !== key))
    setIsChange(true)
  }

  const validate = () => {
    let err = []

    if (
      (userData.tel && userData.tel.length < 9 && !validateTel(userData.tel)) ||
      !userData.tel
    ) {
      err.push('tel')
    }

    if (
      (userData.firstname && userData.firstname.length > 50) ||
      !userData.firstname
    ) {
      err.push('firstname')
    }

    if (
      (userData.lastname && userData.lastname.length > 50) ||
      !userData.lastname
    ) {
      err.push('lastname')
    }

    if (
      (userData.address && userData.address.length > 200) ||
      !userData.address
    ) {
      err.push('address')
    }

    if (err.length > 0) {
      setErrors(err)
      return false
    }
    return true
  }

  const submit = (e) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(userData)
      setIsChange(false)
    }
  }

  return (
    <Form>
      <InputGroup>
        <InputControl>
          <label>อีเมล</label>
          <Input
            type="text"
            placeholder="อีเมล"
            disabled
            value={userData?.email}
          ></Input>
        </InputControl>
      </InputGroup>

      <InputGroup>
        <InputControl>
          <label>ชื่อจริง*</label>
          <Input
            type="text"
            placeholder="ชื่อจริง"
            onChange={(data) => onChange('firstname', data.target.value)}
            value={userData?.firstname ?? ''}
          ></Input>
          {errors.indexOf('firstname') !== -1 && (
            <Error>กรุณากรอกชื่อจริงไม่เกิน 50 ตัวอักษร</Error>
          )}
        </InputControl>
        <InputControl>
          <label>นามสกุล*</label>
          <Input
            type="text"
            placeholder="นามสกุล"
            onChange={(data) => onChange('lastname', data.target.value)}
            value={userData?.lastname ?? ''}
          ></Input>
          {errors.indexOf('lastname') !== -1 && (
            <Error>กรุณากรอกนามสกุลไม่เกิน 50 ตัวอักษร</Error>
          )}
        </InputControl>
      </InputGroup>

      <InputControl>
        <label>ที่อยู่สำหรับจัดส่ง*</label>
        <TextArea
          type="text"
          placeholder="ที่อยู่สำหรับจัดส่ง"
          onChange={(data) => onChange('address', data.target.value)}
          value={userData?.address ?? ''}
        ></TextArea>
        {errors.indexOf('address') !== -1 && (
          <Error>กรุณากรอกที่อยู่ไม่เกิน 200 ตัวอักษร</Error>
        )}
      </InputControl>

      <InputControl>
        <label>เบอร์ติดต่อ*</label>
        <Input
          type="text"
          placeholder="เบอร์ติดต่อ"
          onChange={(data) => onChange('tel', data.target.value)}
          value={userData?.tel ?? ''}
          maxLength={10}
        ></Input>
        {errors.indexOf('tel') !== -1 && (
          <Error>กรุณากรอกเบอร์ไม่เกิน 10 ตัวอักษร</Error>
        )}
      </InputControl>
      <ButtonWrapper>
        <Button borderRadius="4px" onClick={submit} isDisabled={!isChange}>
          อัปเดตข้อมูล
        </Button>
      </ButtonWrapper>
    </Form>
  )
}

export default EditUserInfoForm
