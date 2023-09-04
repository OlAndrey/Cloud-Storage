import { FC } from 'react'
import Icon from '../icon/Icon'

type ButtonPropTypes = {
  className?: string
  iconName: string
  size?: number[]
  handler: () => void
}

const ButtonWithIcon: FC<ButtonPropTypes> = ({ className, iconName, size = [24, 24], handler }) => {
  return (
    <button
      className={className ? className : 'pl-3 transition duration-150 ease-in-out'}
      onClick={handler}
    >
      <Icon name={iconName} fill='#ffffff' size={size} />
    </button>
  )
}

export default ButtonWithIcon
