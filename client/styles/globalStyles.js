import {createGlobalStyle} from 'styled-components'
import {config as fontAwesomeConfig} from '@fortawesome/fontawesome-svg-core'
import {fontFaces} from './fontFaces'
import {reset} from './reset'
fontAwesomeConfig.autoAddCss = false

export const getGlobalStyle = () => createGlobalStyle`
  ${reset}
  ${fontFaces}
`
