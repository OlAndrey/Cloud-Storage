import { FC, useState } from 'react'
import { FieldError, Path, UseFormRegister, ValidationRule } from 'react-hook-form'
import { IFormValues } from '../../types/form'
import Icon from '../icon/Icon'

interface InputProps {
  label: Path<IFormValues>
  disabled?: boolean
  register: UseFormRegister<IFormValues>
  minLength?: ValidationRule<number> | undefined
  maxLength?: ValidationRule<number> | undefined
  placeholder: string
  pattern?: ValidationRule<RegExp> | undefined
  error: FieldError | undefined
  required?: boolean
}

const PasswordInput: FC<InputProps> = ({
  label,
  disabled,
  register,
  minLength,
  maxLength,
  placeholder,
  pattern,
  error,
  required,
}) => {
  const [showPassword, setShowPassword] = useState(false)
  return (
    <div className='relative flex-1'>
      <input
        type={showPassword ? 'text' : 'password'}
        disabled={disabled}
        placeholder={placeholder}
        min={0}
        required={true}
        id={label}
        {...register(label, {
          required,
          minLength,
          maxLength,
          pattern,
        })}
        className={`h-11 w-full py-2 pl-2 rounded-lg border-2 bg-zinc-900 duration-100 ${
          error ? 'border-red-400' : 'border-zinc-400'
        }`}
      />
      <div
        onClick={() => setShowPassword(!showPassword)}
        onKeyDown={(e) =>
          (e['code'] === 'Space' || e['code'] === 'Enter') && setShowPassword(!showPassword)
        }
        tabIndex={0}
        className='absolute right-4 top-1/2 flex -translate-y-1/2 transform cursor-pointer items-center justify-center'
      >
        {showPassword ? <Icon name='EyeIcon' size={[24, 24]} /> : <Icon name='EyeOffIcon' size={[24, 24]} />}
      </div>
    </div>
  )
}

export default PasswordInput
