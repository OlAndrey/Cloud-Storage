import { FC } from 'react'
import { FieldError, Path, UseFormRegister, ValidationRule } from 'react-hook-form'
import { IFormValues } from '../../types/form'

interface InputProps {
  label: Path<IFormValues>
  type: 'text' | 'email' | 'number'
  disabled?: boolean
  register: UseFormRegister<IFormValues>
  minLength?: ValidationRule<number> | undefined
  maxLength?: ValidationRule<number> | undefined
  placeholder: string
  pattern?: ValidationRule<RegExp> | undefined
  error: FieldError | undefined
  min?: ValidationRule<number | string> | undefined
  required?: boolean
}

const TextInput: FC<InputProps> = ({
  label,
  type,
  disabled,
  register,
  minLength,
  maxLength,
  placeholder,
  pattern,
  error,
  min,
  required,
}) => {
  return (
    <div>
      <input
        type={type}
        disabled={disabled}
        placeholder={placeholder}
        id={label}
        min={0}
        required={true}
        {...register(label, {
          required,
          minLength,
          min,
          maxLength,
          pattern,
        })}
        className={`relative h-11 w-full py-2 pl-2 rounded-lg border-2 bg-zinc-900 duration-100 ${
          error ? 'border-red-400' : 'border-zinc-400'
        }`}
      />
    </div>
  )
}

export default TextInput
