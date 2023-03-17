import React, {useRef} from 'react'
import {useOutsideAlerter} from '../hooks/useOutsideAlerter'
import {ModalBackground, ModalContainer} from './Modal'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {SPACING} from '../styles/spacing'
import Icon from './Icon'
import {ICONS} from '../config/icon'
import {COLORS} from '../styles/colors'
import {useTransition, animated} from 'react-spring'

const ModalLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const ModalContent = styled.div`
  width: 100%;
  background-color: ${COLORS.GRAY_LIGHT_2};
  padding: ${SPACING['2X']};
  display: flex;
  flex-direction: column;
  gap: ${SPACING.LG};
  align-items: center;
`

const ModalHead = styled.h4`
  font-size: 20px;
  font-weight: 600;
`

const CircleIcon = styled.div`
  background-color: ${(props) => props.iconBg ?? COLORS.PRIMARY};
  border-radius: 50%;
  width: 120px;
  height: 120px;
  color: ${COLORS.WHITE};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: ${SPACING['2X']};
`

const ConfirmModal = ({onShow, onClose, header, children, icon, iconBg}) => {
  const modalRef = useRef()

  const slideModal = useTransition(onShow, {
    from: {opacity: 0, y: 400},
    enter: {opacity: 1, y: 425},
    leave: {opacity: 0, y: 400},
  })

  const onCloseHandler = (close) => {
    if (!close) {
      onClose()
    }
  }

  useOutsideAlerter(onCloseHandler, modalRef)

  return (
    <>
      {slideModal(
        (style, item, key) =>
          item && (
            <ModalBackground>
              <animated.div style={style}>
                <ModalContainer
                  maxWidth="500px"
                  maxHeight="max-content"
                  ref={modalRef}
                >
                  <ModalLayout>
                    <CircleIcon iconBg={iconBg}>
                      <Icon size="4x" name={icon ?? ICONS.faQuestion}></Icon>
                    </CircleIcon>
                    <ModalContent>
                      <ModalHead>{header}</ModalHead>
                      {children}
                    </ModalContent>
                  </ModalLayout>
                </ModalContainer>
              </animated.div>
            </ModalBackground>
          )
      )}
    </>
  )
}

ConfirmModal.propTypes = {
  onShow: PropTypes.bool,
  onClose: PropTypes.func,
  children: PropTypes.node,
}

export default ConfirmModal
