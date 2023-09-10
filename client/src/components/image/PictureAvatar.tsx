type PictureAvatarPropType = {
  src: string
  diameter: number
  className?: string
}

const PictureAvatar = ({ src, diameter, className = '' }: PictureAvatarPropType) => {
  return (
    <img
      style={{ width: diameter, height: diameter }}
      className={`${className} select-none rounded-full`}
      src={src}
      draggable={false}
    />
  )
}

export default PictureAvatar
