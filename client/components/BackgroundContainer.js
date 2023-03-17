import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const Body = styled.section`
  background: transparent url(${(props) => props.link ?? ''}) no-repeat;
  background-size: cover;
  min-height: 100vh;
  display: flex;
  align-items: center;
  image-rendering: -webkit-optimize-contrast;
  margin-top: 60px;
  flex-direction: column;
`

const BackgroundContainer = ({link, children}) => {
  return <Body link={link}>{children}</Body>
}

BackgroundContainer.propTypes = {
  link: PropTypes.string,
  children: PropTypes.node,
}

export default BackgroundContainer
