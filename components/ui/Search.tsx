'use client'

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { SearchIcon, X } from 'lucide-react'
import { useState, useEffect } from 'react'

interface SearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const Search = ({
  value,
  onChange,
  placeholder = 'Search...',
}: SearchProps) => {
  const [localValue, setLocalValue] = useState(value)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setLocalValue(newValue)
    onChange(newValue)
  }

  const handleClear = () => {
    setLocalValue('')
    onChange('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur()
    }
  }

  return (
    <InputGroup className={'w-full rounded-2xl bg-white'}>
      <InputGroupAddon>
        <SearchIcon className="h-4 w-4" />
      </InputGroupAddon>
      <InputGroupInput
        type="text"
        value={localValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />
      {localValue && (
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            type="button"
            onClick={handleClear}
            className="hover:bg-transparent"
          >
            <X className="h-4 w-4" />
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  )
}

export default Search
