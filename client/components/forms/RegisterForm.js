import React, {useState} from 'react'
import userService from '../../api/request/userService'
import {ICONS} from '../../config/icon'
import {COLORS} from '../../styles/colors'
import Button from '../Button'
import {AuthFormWrapper} from '../Layout'
import InputWithIcon from './InputWithIcon'
import styled from 'styled-components'
import {SPACING} from '../../styles/spacing'
import Icon from '../Icon'
import {
  validateEmail,
  validatePassword,
  validateTel,
} from '../../utils/validate'
import toast from 'react-hot-toast'
import {useDispatch} from 'react-redux'
import {updateUser} from '../../redux/feature/UserSlice'
import adminService from '../../api/request/adminService'

const ButtonWrapper = styled.div`
  margin-top: ${SPACING.LG};
`

const NavWrap = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${SPACING.MD};

  > div {
    display: flex;
    align-items: center;
    gap: ${SPACING.MD};
    cursor: pointer;
  }
`

const ErrMessage = styled.div`
  background-color: ${COLORS.RED_2};
  color: ${COLORS.WHITE};
  padding: 2px ${SPACING.MD};
  border-radius: ${SPACING.MD};
  width: max-content;
  margin: ${SPACING.LG} 0;
  font-size: 14px;
  font-weight: 600;
`

const RegisterForm = ({
  onShowRegister,
  onShow,
  onSuccess,
  allRound,
  adminForm,
}) => {
  const defaultUserData = {
    email: '',
    password: '',
    // username: '',
  }
  const [userData, setUserData] = useState(defaultUserData)
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [errors, setErrors] = useState([])
  const dispatch = useDispatch()

  const validate = () => {
    let errorArr = []

    Object.keys(userData).map((key) => {
      if (
        userData[key].length < 1 ||
        (key === 'email' && !validateEmail(userData.email)) ||
        (key === 'tel' && !validateTel(userData.tel)) ||
        (key === 'password' && !validatePassword(userData.password))
      ) {
        errorArr.push(key)
      }
    })

    if (passwordConfirm !== userData['password']) {
      errorArr.push('confirmPassword')
    }

    if (errorArr.length > 0) {
      setErrors(errorArr)
      return false
    } else {
      return true
    }
  }

  const newAdminHandle = (e) => {
    e.preventDefault()
    toast.promise(adminService.addAdmin(userData), {
      loading: 'กำลังเพิ่มข้อมูล...',
      success: () => {
        setUserData(defaultUserData)
        setPasswordConfirm('')
        return 'เพิ่ม admin ใหม่สำเร็จ'
      },
      error: (err) => () => {
        getBorrowing()
        getMyRequest()
        setIsLoading(false)
        return `${err.toString()}`
      },
    })
  }

  const registerHandle = (e) => {
    e.preventDefault()
    if (validate()) {
      return userService
        .register(userData)
        .then(() => {
          userService.login(userData.email, userData.password).then((res) => {
            dispatch(updateUser(res.data?.user))
            toast.success('สมัครสมาชิกสำเร็จแล้ว')
            onShowRegister(false)
            onSuccess()
          })
        })
        .catch((err) => {
          let errorArr = []
          errorArr.push('existEmail')
          setErrors(errorArr)
        })
    }
  }

  const onChange = (key, value) => {
    setUserData({...userData, [key]: value.trim()})
    setErrors(errors.filter((err) => err !== key))

    if (key === 'email') {
      setErrors(errors.filter((err) => err !== 'existEmail'))
    }
  }

  return (
    <AuthFormWrapper allRound={allRound}>
      {!adminForm && (
        <NavWrap>
          <div onClick={() => onShowRegister(false)}>
            <Icon name={ICONS.faChevronLeft}></Icon>
            <span>เข้าสู่ระบบ</span>
          </div>
          <div onClick={() => onShow(false)}>
            <span>ปิด</span>
            <Icon name={ICONS.faXmark}></Icon>
          </div>
        </NavWrap>
      )}

      <form onSubmit={adminForm ? newAdminHandle : registerHandle}>
        {errors.indexOf('existEmail') !== -1 && (
          <ErrMessage>อีเมลหรือชื่อผู้ใช้ถูกใช้ไปแล้ว</ErrMessage>
        )}

        <InputWithIcon
          label="อีเมล*"
          type="text"
          iconName={ICONS.faEnvelope}
          onChange={(data) => onChange('email', data)}
          maxLength={60}
          placeholder="กรอกอีเมล"
          error={errors.indexOf('email') !== -1}
          errorMessage="กรุณากรอกอีเมลให้ถูกต้อง"
          value={userData.email}
        />

        {/* <InputWithIcon
          label="ชื่อผู้ใช้*"
          type="text"
          iconName={ICONS.faUser}
          onChange={(data) => onChange('username', data)}
          maxLength={20}
          placeholder="กรอกชื่อผู้ใช้"
          error={errors.indexOf('username') !== -1}
          errorMessage="คุณยังไม่ได้กรอกชื่อผู้ใช้"
          value={userData.username}
        /> */}

        <InputWithIcon
          label="รหัสผ่าน*"
          iconName={ICONS.faLock}
          inputType="password"
          maxLength={30}
          onChange={(data) => onChange('password', data)}
          placeholder="กรอกรหัสผ่าน"
          error={errors.indexOf('password') !== -1}
          errorMessage="กรุณากรอกรหัสผ่านที่ประกอบด้วย ตัวพิมพ์ใหญ่ พิมพ์เล็ก ตัวเลข และตัวอักษรพิเศษ ความยาว 10 - 30 ตัว"
          value={userData.password}
        />

        <InputWithIcon
          label="กรอกรหัสผ่านอีกครั้ง*"
          iconName={ICONS.faLock}
          inputType="password"
          maxLength={30}
          onChange={(data) => setPasswordConfirm(data)}
          placeholder="กรอกรหัสผ่านอีกครั้ง"
          error={errors.indexOf('confirmPassword') !== -1}
          errorMessage="กรุณากรอกรหัสผ่านอีกครั้ง"
          value={passwordConfirm}
        />

        <ButtonWrapper>
          <Button fullWidth btnSize="sm" bgColor={COLORS.RED_2} type="submit">
            {adminForm ? 'เพิ่ม admin' : 'สมัครสมาชิก'}
          </Button>
        </ButtonWrapper>
      </form>
    </AuthFormWrapper>
  )
}

export default RegisterForm
