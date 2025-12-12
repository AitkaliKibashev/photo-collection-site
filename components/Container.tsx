import { FC, ReactNode } from 'react'

interface ContainerProps {
  children: ReactNode
}

const Container: FC<ContainerProps> = ({ children }) => {
  return <div className={'px-4 sm:px-6 lg:px-8'}>{children}</div>
}

export default Container
