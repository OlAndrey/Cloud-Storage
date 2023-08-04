import { FC } from 'react'
import icons from '../icons'

type IconPropsType = {
  name: string
  size: number[]
  className?: string
  fill?: string
}

const Icon: FC<IconPropsType> = ({ name, size, className = '', fill = '#000000' }) => {
  const [icon, viewBox] = icons[name]

  return (
    <svg
      fill={fill}
      width={size[0]}
      height={size[1]}
      className={className}
      dangerouslySetInnerHTML={{ __html: icon }}
      viewBox={viewBox}
    />
  )
}

export default Icon
