import React from 'react'
import styled from 'styled-components'
import {COLORS} from '../styles/colors'
import {SPACING} from '../styles/spacing'
import PropTypes from 'prop-types'

export const ModalBackground = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 1000;
  top: 0;
  left: 0;
  overflow-y: auto;
`

export const ModalContainer = styled.div`
  max-width: ${(props) => props.maxWidth ?? '300px'};
  max-height: ${(props) => props.maxHeight ?? '400px'};
  width: 100%;
  height: max-content;
  padding: ${(props) => props.padding && props.padding};
  color: ${COLORS.PRIMARY};
  background-color: ${COLORS.WHITE};
  border-radius: ${SPACING.SM};
  box-shadow: 0 5px 10px ${COLORS.GRAY_DARK};
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: ${(props) => props.flexDirection ?? 'column'};
  gap: ${(props) => props.gap && props.gap};
  overflow: hidden;
`

const Modal = ({children}) => {
  return <ModalBackground>{children}</ModalBackground>
}

Modal.propTypes = {
  children: PropTypes.node,
}

export default Modal
