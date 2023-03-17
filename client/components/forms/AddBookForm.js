import React, {useState, useEffect, useCallback} from 'react'
import PropTypes from 'prop-types'
import styled, {css} from 'styled-components'
import Button from '../Button'
import {COLORS} from '../../styles/colors'
import {FONTS} from '../../styles/fonts'
import {SPACING} from '../../styles/spacing'
import {YEAR} from '../../config/currentTime'
import Icon from '../Icon'
import {ICONS, ICON_SIZE} from '../../config/icon'
import {useDropzone} from 'react-dropzone'
import SearchDropdown from '../SearchDropdown'
import shelfService from '../../api/request/shelfService'
import useTypes from '../../api/query/useTypes'
import usePublishers from '../../api/query/usePublishers'
import Input from './Input'

const Form = styled.form`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 8px;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`

const Title = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: ${SPACING.SM};
`

const UploadContainer = styled.section`
  width: 100%;
  background-color: ${COLORS.GRAY_LIGHT_3};
  min-height: 200px;
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='8' ry='8' stroke='%23A199a1aa' stroke-width='6' stroke-dasharray='10' stroke-dashoffset='82' stroke-linecap='square'/%3e%3c/svg%3e");
  border-radius: ${SPACING.SM};
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: ${COLORS.GRAY_DARK_1};

  > span {
    margin-bottom: ${SPACING.SM};
  }
`

const UploadButtonSmSize = css`
  width: 120px;
  height: 40px;
  font-size: 14px;
`

const UploadButton = styled.label`
  background: ${COLORS.SECONDARY};
  color: ${COLORS.WHITE};
  height: 50px;
  width: 150px;
  border-radius: ${SPACING.SM};
  display: flex;
  align-items: center;
  justify-content: center;

  > svg {
    margin-right: ${SPACING.SM};
  }

  &:hover {
    cursor: pointer;
    opacity: 0.7;
    transition: 200ms;
  }

  ${(props) => props.size === 'sm' && UploadButtonSmSize}
`

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
`

const ImagePreview = styled.img`
  max-height: 400px;
  margin: 0 auto ${SPACING.MD};
  border-radius: ${SPACING.SM};
`

const SuggestInputContainer = styled.div`
  position: relative;
`

const SuggestContainer = styled.div`
  position: absolute;
  width: 100%;
  z-index: 100;
  overflow-y: auto;
  max-height: 200px;
  background: ${COLORS.GRAY_LIGHT_1};
  box-shadow: 0 5px 20px ${COLORS.GRAY_LIGHT};
  border-radius: 8px;
`

const SuggestItem = styled.div`
  padding: 12px 8px;
  transition: 0.3s;
  cursor: pointer;
  user-select: none;
  border-bottom: 1px solid ${COLORS.GRAY_LIGHT_2};
  outline: none;

  &:hover {
    color: ${COLORS.WHITE};
    background-color: ${COLORS.PRIMARY};
  }
`

const InputControl = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: ${SPACING.SM};
  width: 100%;
  position: relative;

  @media (min-width: 768px) {
    ${(props) => props.width && `width: ${props.width}`}
  }
`

const Label = styled.label`
  color: ${COLORS.PRIMARY};
  margin-top: ${SPACING.SM};
  font-weight: 600;

  > span {
    font-size: 12px;
    color: ${COLORS.RED_1};
    font-weight: 600;
  }
`

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${SPACING['4X']};

  > button:first-child {
    margin-right: ${SPACING.SM};
  }
`
const ErrorText = styled.span`
  font-size: 12px;
  color: red;
`

const TypeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
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

  &:hover {
    opacity: 0.7;
  }

  ${(props) => props.disabled && 'opacity: 0.6;'}
`

const AddBookForm = ({
  onPrevious,
  onStepChange,
  onSubmit,
  isbnBookToEdit,
  clearForm,
  setClearForm,
}) => {
  const defaultBookData = {
    ISBN: '',
    bookName: '',
    author: '',
    types: [],
    publisherId: '',
  }
  const [bookData, setBookData] = useState(defaultBookData)
  const [imageFile, setImageFile] = useState([])
  const [errors, setErrors] = useState([])
  const [disabledAll, setDisabledAll] = useState(false)
  const {data: types, isLoading: loadingTypes} = useTypes()
  const {data: publishers, isLoading: loadingPublishers} = usePublishers()
  const {getRootProps} = useDropzone({
    disabled: disabledAll,
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      setImageFile(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      )
    },
  })

  useEffect(() => {
    if (clearForm) {
      setBookData(defaultBookData)
      setImageFile([])
      setClearForm(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearForm])

  useEffect(() => {
    if (imageFile.length > 0) {
      setErrors((errs) => errs?.filter((err) => err !== 'image'))
    }
    return () => {
      setErrors((err) => [])
    }
  }, [imageFile])

  const getDataFromISBN = useCallback(
    (ISBN) => {
      shelfService.getShelfByIsbn(ISBN).then((res) => {
        if (res?.data?.length > 0) {
          res.data[0].types = res.data[0].types.map((type) => type._id)
          res.data[0].publisher = res.data[0].publisherId._id
          setImageFile([
            {
              preview: `${process.env.NEXT_PUBLIC_API_URL}/bookShelf/bsImage/${res.data[0].imageCover}`,
            },
          ])

          Object.keys(res.data[0]).forEach(
            (k) =>
              (!res.data[0][k] || res.data[0][k].length === 0) &&
              delete res.data[0][k]
          )

          setBookData(res.data[0])
          if (!isbnBookToEdit) {
            setDisabledAll(true)
          }
          setErrors([])
        }
      })
      setErrors(errors.filter((err) => err !== 'ISBN'))
    },
    [errors, isbnBookToEdit]
  )

  useEffect(() => {
    if (isbnBookToEdit) {
      getDataFromISBN(isbnBookToEdit)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isbnBookToEdit])

  const validate = () => {
    let errArr = [...errors]
    Object.keys(bookData).map((key) => {
      if (
        (key === 'ISBN' && bookData[key].length < 13) ||
        (typeof bookData[key] !== 'number' && !bookData[key]) ||
        (Array.isArray(bookData[key]) &&
          bookData[key].length < 1 &&
          key === 'types')
      ) {
        errArr.push(key)
      } else {
        errArr = errArr.filter((err) => err !== key)
      }
    })

    if (imageFile.length < 1) {
      errArr.push('image')
    }

    if (errArr.length > 0) {
      setErrors(errArr)
      return 0
    } else {
      return 1
    }
  }

  const submitForm = () => {
    if (validate()) {
      onSubmit(bookData, imageFile)
    }
  }

  const onChange = (key, value) => {
    setBookData({...bookData, [key]: value})
    setErrors(errors.filter((err) => err !== key))
  }

  const onChangeIsbn = (ISBN) => {
    if (
      (!(ISBN.match(/^\d+$/) ? true : false) && ISBN.length > 0) ||
      (/[a-zA-Z]/.test(ISBN) && ISBN.length > 0) ||
      ISBN.length > 13
    ) {
      return
    }
    setBookData({...bookData, ISBN})

    if (ISBN.length === 13 && !isbnBookToEdit) {
      getDataFromISBN(ISBN)
    }
  }

  const onClickType = (type) => {
    if (bookData.types.indexOf(type) !== -1) {
      return setBookData({
        ...bookData,
        types: [...bookData.types.filter((item) => item !== type)],
      })
    }
    setErrors(errors.filter((err) => err !== 'types'))
    setBookData({...bookData, types: [...bookData.types, type]})
  }

  const removeType = (type) => {
    setBookData({
      ...bookData,
      types: [...bookData.types.filter((item) => item !== type)],
    })
  }

  const onClickPublisher = (pubId) => {
    setErrors(errors.filter((err) => err !== 'publisherId'))
    setBookData({...bookData, publisherId: pubId})
  }

  useEffect(() => {
    if (bookData?.ISBN.length < 13) {
      setDisabledAll(false)
    }
  }, [bookData])

  return (
    <>
      <Title>กรอกข้อมูลหนังสือของคุณ</Title>
      {(bookData?.imageCover || imageFile.length > 0) && (
        <>
          <label {...getRootProps()}>
            <ImageContainer>
              <ImagePreview src={imageFile[0]?.preview} />
            </ImageContainer>
          </label>
          {!disabledAll && (
            <UploadButton {...getRootProps()} size="sm">
              <Icon name={ICONS.faDownload} size={ICON_SIZE['lg']} />
              <span>เปลี่ยนภาพ</span>
            </UploadButton>
          )}
        </>
      )}

      <Form>
        <InputControl>
          <Label>
            ISBN*{' '}
            <span>
              ( หากในระบบมีข้อมูลหนังสือที่ตรงกับ ISBN นี้แล้ว
              ระบบจะเติมข้อมูลส่วนที่เหลือให้ )
            </span>
          </Label>
          <SuggestInputContainer>
            <Input
              type="text"
              onChange={(e) => onChangeIsbn(e.target.value)}
              value={bookData?.ISBN}
              maxLength="17"
              placeholder="ISBN"
              isError={errors?.indexOf('ISBN') !== -1}
              errText="กรุณากรอก ISBN เป็นตัวเลขจำนวน 13 หลัก (XXX-XX-XXXXX-XX-X)"
            ></Input>
          </SuggestInputContainer>
        </InputControl>
        <InputControl>
          <Label>ชื่อหนังสือ*</Label>
          <Input
            type="text"
            onChange={(e) => onChange('bookName', e.target.value)}
            value={bookData?.bookName}
            placeholder="กรอกชื่อหนังสือ"
            isError={errors?.indexOf('bookName') !== -1}
            disabled={disabledAll}
            errText="กรุณากรอกชื่อหนังสือ"
          ></Input>
        </InputControl>

        <InputControl width="100%">
          <Label>ชื่อผู้แต่ง*</Label>
          <Input
            type="text"
            onChange={(e) => onChange('author', e.target.value)}
            value={bookData?.author}
            placeholder="กรอกชื่อผู้แต่ง"
            isError={errors?.indexOf('author') !== -1}
            disabled={disabledAll}
            errText="กรุณากรอกชื่อผู้แต่ง"
          ></Input>
        </InputControl>
        {!loadingPublishers && (
          <InputControl width="50%">
            <Label>สำนักพิมพ์*</Label>
            <SearchDropdown
              dataList={publishers}
              onClickDropdown={onClickPublisher}
              isError={errors?.indexOf('publisherId') !== -1}
              showCurrentData
              value={bookData?.publisher}
              placeHolder="ค้นหาสำนักพิมพ์..."
              isDisabled={disabledAll}
            />
            {errors?.indexOf('publisherId') !== -1 && (
              <ErrorText>กรุณาเลือกสำนักพิมพ์</ErrorText>
            )}
          </InputControl>
        )}

        <InputControl>
          <Label>
            ประเภทหนังสือ* <span>( สามารถเลือกประเภทได้สูงสุด 4 ประเภท )</span>
          </Label>

          {bookData?.types.length > 0 && (
            <TypeContainer>
              {bookData?.types.map((type) => (
                <TypeItem
                  key={`type-select-${type}`}
                  onClick={() => {
                    if (!disabledAll) removeType(type)
                  }}
                  disabled={disabledAll}
                >
                  <span>{types?.find((item) => item.id == type).name}</span>
                  <Icon name={ICONS.faXmark} />
                </TypeItem>
              ))}
            </TypeContainer>
          )}

          {!loadingTypes && (
            <SearchDropdown
              dataList={types?.filter(
                (type) => bookData.types.indexOf(type.id) === -1 && type
              )}
              onClickDropdown={onClickType}
              isError={errors?.indexOf('types') !== -1}
              isDisabled={disabledAll || bookData.types?.length > 3}
            />
          )}

          {errors?.indexOf('types') !== -1 && (
            <ErrorText>กรุณาเลือกประเภทหนังสืออย่างน้อย 1 ประเภท</ErrorText>
          )}
        </InputControl>

        {!bookData?.image && imageFile.length < 1 && (
          <UploadContainer {...getRootProps()}>
            <span>ลากและวางไฟล์รูปภาพหนังสือที่นี่</span>

            <UploadButton>
              <Icon name={ICONS.faDownload} size={ICON_SIZE['lg']} />
              <span>อัปโหลดไฟล์*</span>
            </UploadButton>
          </UploadContainer>
        )}
        {errors?.indexOf('image') !== -1 && (
          <ErrorText>กรุณาใส่รูปภาพของหนังสือ</ErrorText>
        )}
      </Form>

      <ButtonWrapper>
        <Button onClick={onPrevious} btnType="whiteBorder" btnSize="sm">
          ย้อนกลับ
        </Button>
        <Button btnSize="sm" onClick={() => submitForm()}>
          ยืนยัน
        </Button>
      </ButtonWrapper>
    </>
  )
}

AddBookForm.propTypes = {
  onStepChange: PropTypes.func,
}

export default AddBookForm
