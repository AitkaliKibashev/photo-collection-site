import React from 'react'
import { Tag } from '@/types/Tag'
import { Button } from './ui/button'
import { motion } from 'framer-motion'

interface FilterBadgeProps {
  name: string
  isSelected: boolean
  onClick: () => void
}

const TAILWIND_COLOR_MAP: { [key: string]: string } = {
  purple: 'bg-purple-200',
  green: 'bg-green-200',
  blue: 'bg-blue-200',
  amber: 'bg-amber-200',
  fuchsia: 'bg-fuchsia-200',
  slate: 'bg-slate-200',
  emerald: 'bg-emerald-200',
  teal: 'bg-teal-200',
  indigo: 'bg-indigo-200',
  red: 'bg-red-200',
  orange: 'bg-orange-200',
}

const COLOR_NAMES: string[] = Object.keys(TAILWIND_COLOR_MAP)
const TEXT_CLASS: string = 'text-gray-600'

const getRandomBgClass = (tag: string): string => {
  // Используем хеш тега для стабильного цвета
  let hash = 0
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % COLOR_NAMES.length
  const colorName: string = COLOR_NAMES[index]

  return TAILWIND_COLOR_MAP[colorName]
}

const FilterBadge: React.FC<FilterBadgeProps> = ({
  name,
  isSelected,
  onClick,
}) => {
  const backgroundClass: string = getRandomBgClass(name)

  const colorClasses: string = isSelected
    ? 'bg-blue-600 text-white'
    : `${backgroundClass} ${TEXT_CLASS}`

  const baseClasses: string =
    'inline-block px-3 py-1 sm:px-4 m-0.5 sm:m-1 rounded-full font-medium text-xs sm:text-sm cursor-pointer transition-colors duration-150 ease-in-out hover:shadow-lg hover:opacity-90 whitespace-nowrap'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{
        layout: { duration: 0.3, ease: 'easeInOut' },
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 },
      }}
      className={`${baseClasses} ${colorClasses}`}
      onClick={onClick}
    >
      {name}
    </motion.div>
  )
}

interface FiltersProps {
  values: Tag[]
  setValues: (values: Tag[]) => void
}

const Filters: React.FC<FiltersProps> = ({ values, setValues }) => {
  const filterNames: Tag[] = Object.values(Tag)

  // Сортируем теги: активные первыми
  const sortedTags = [...filterNames].sort((a, b) => {
    const aSelected = values.includes(a)
    const bSelected = values.includes(b)
    if (aSelected && !bSelected) return -1
    if (!aSelected && bSelected) return 1
    return 0
  })

  const toggleTag = (tag: Tag) => {
    setValues(
      values.includes(tag) ? values.filter((t) => t !== tag) : [...values, tag],
    )
  }

  return (
    <div className="rounded-xl bg-white p-3 shadow sm:p-4">
      <h3 className="mb-3 border-b pb-2 text-xl font-bold text-gray-800 sm:mb-4 sm:text-2xl">
        Tags
      </h3>
      <motion.div
        layout
        className="flex flex-wrap gap-2 sm:gap-3"
        transition={{ layout: { duration: 0.3, ease: 'easeInOut' } }}
      >
        {sortedTags.map((tag) => (
          <FilterBadge
            key={tag}
            name={tag}
            isSelected={values.includes(tag)}
            onClick={() => toggleTag(tag)}
          />
        ))}
      </motion.div>
      {values.length > 0 && (
        <Button
          className="mt-1 p-0 text-sm text-blue-600 underline hover:text-blue-800"
          onClick={() => setValues([])}
          variant="link"
        >
          Clear all filters
        </Button>
      )}
    </div>
  )
}

export default Filters
