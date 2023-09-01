import dayjs from 'dayjs'
import Calendar from 'dayjs/plugin/calendar'
import { FC } from 'react'

dayjs.extend(Calendar)

type TitlePropType = {
  date: string
}

const Title: FC<TitlePropType> = ({ date }) => (
  <div className='py-4 text-center'>
    {dayjs(date).calendar(null, {
      sameDay: '[Today]',
      lastDay: '[Yesterday]',
      lastWeek: 'DD MMMM',
      sameElse: 'DD MMMM YYYY',
    })}
  </div>
)

export default Title
