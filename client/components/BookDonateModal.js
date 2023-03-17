import React, {useRef} from 'react'
import styled from 'styled-components'
import {useOutsideAlerter} from '../hooks/useOutsideAlerter'
import {COLORS} from '../styles/colors'
import {SPACING} from '../styles/spacing'
import Button from './Button'
import Modal, {ModalContainer} from './Modal'
import Image from 'next/image'
import HappyPeople from '../public/static/images/happy-people.jpg'
import PropTypes from 'prop-types'

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 170px;
  justify-content: space-between;
  padding: 0 ${SPACING.MD} ${SPACING.MD};

  > div {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  > div:last-child {
    gap: ${SPACING.SM};
  }
`

const StatusImage = styled.div`
  width: 100%;
  height: 220px;
  position: relative;
`

const ModalHead = styled.h3`
  color: ${COLORS.GREEN_1};
  font-size: 24px;
  font-weight: 600;
`
const ModalText = styled.p`
  word-break: break-all;
`

const DonateMoreBtn = styled.button`
  all: unset;
  cursor: pointer;
  font-size: 14px;
`

const BookDonateModal = ({onClose, onSubmit}) => {
  const modalRef = useRef()

  const onCloseHandler = (close) => {
    if (!close) {
      onClose()
    }
  }

  useOutsideAlerter(onCloseHandler, modalRef)

  return (
    <Modal>
      <ModalContainer ref={modalRef}>
        <StatusImage>
          <Image
            src={HappyPeople.src}
            alt="modal status"
            layout="fill"
            objectFit="contain"
          />
        </StatusImage>
        <ModalContent>
          <div>
            <ModalHead>ขอบคุณนะ~</ModalHead>
            <ModalText>หนังสือของคุณได้รับการลงทะเบียนเรียบร้อยแล้ว</ModalText>
          </div>
          <div>
            <Button btnSize="sm" onClick={onSubmit}>
              ไปที่หน้ารายละเอียดหนังสือ
            </Button>
            <DonateMoreBtn onClick={() => onClose(false)}>
              บริจาคหนังสือเพิ่ม
            </DonateMoreBtn>
          </div>
        </ModalContent>
      </ModalContainer>
    </Modal>
  )
}

BookDonateModal.propTypes = {
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
}

export default BookDonateModal
