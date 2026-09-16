import { FormEventHandler, ReactNode } from 'react'

import {
  Actions,
  Fields,
  Footer,
  FormNoticeWrap,
  Panel,
  PanelTitle,
  StyledForm,
} from './styles'

type FormProps = {
  actions: ReactNode
  children: ReactNode
  notice?: ReactNode
  onSubmit: FormEventHandler<HTMLFormElement>
  title: string
}

export const Form = ({
  actions,
  children,
  notice,
  onSubmit,
  title,
}: FormProps) => (
  <Panel>
    <PanelTitle>{title}</PanelTitle>

    <StyledForm onSubmit={onSubmit} noValidate>
      <Fields>{children}</Fields>
      <Footer>
        {notice && <FormNoticeWrap>{notice}</FormNoticeWrap>}
        <Actions>{actions}</Actions>
      </Footer>
    </StyledForm>
  </Panel>
)
