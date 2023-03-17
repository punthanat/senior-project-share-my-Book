import React from 'react'
import PropTypes from 'prop-types'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCheck} from '@fortawesome/free-solid-svg-icons'

const Icon = ({name, size, color}) => {
  return <FontAwesomeIcon icon={name ?? faCheck} size={size} color={color} />
}

Icon.propTypes = {
  name: PropTypes.object,
  size: PropTypes.string,
  color: PropTypes.string,
}

export default Icon
