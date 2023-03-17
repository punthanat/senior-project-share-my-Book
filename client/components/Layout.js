import styled from 'styled-components'
import {COLORS} from '../styles/colors'
import {SPACING} from '../styles/spacing'

export const ContentWrapper = styled.section`
  max-width: ${(props) => props.maxWidth ?? '1200px'};
  width: ${(props) => props.width ?? '100%'};
  margin: ${(props) => props.margin ?? '30px auto'};
  display: flex;
  flex-direction: column;
  align-items: ${(props) => props.alignItems ?? 'center'};
  justify-content: ${(props) => props.justifyContent ?? 'center'};
  padding: ${(props) => props.padding ?? SPACING.MD};
  background-color: ${(props) => props.bgColor ?? COLORS.GRAY_LIGHT_3};
  border-radius: ${SPACING.MD};
  box-shadow: 0 5px 20px ${COLORS.GRAY_LIGHT};
  ${(props) => props.gap && `gap: ${props.gap};`}
`

export const BoxLayout = styled.div`
  max-width: ${(props) => props.maxWidth ?? '1200px'};
  width: ${(props) => props.width ?? '100%'};
  padding: ${SPACING.MD} ${SPACING.LG};
`

export const AddBookLayout = styled.section`
  max-width: 768px;
  width: 100%;
  border-radius: 8px;
  padding: 20px;
  background-color: ${COLORS.WHITE};
  box-shadow: 0px 5px 20px ${COLORS.GRAY_DARK_1};
  margin: 20px 0 80px;
`

export const AuthFormWrapper = styled.div`
  background-color: ${COLORS.PURPLE_2};
  width: 100%;
  color: ${COLORS.WHITE};
  padding: ${SPACING.LG};
  position: relative;
  border-radius: ${SPACING.SM};

  @media (min-width: 768px) {
    padding: 50px;
    border-radius: ${(props) =>
      props.allRound ? `${SPACING.SM}` : `${SPACING.SM} ${SPACING.SM} 0`};
  }
`

export const Hidden = styled.div`
  display: none;

  @media (min-width: ${(props) => props.breakPoint ?? '768px'}) {
    display: ${(props) => props.display ?? 'block'};
  }
`
