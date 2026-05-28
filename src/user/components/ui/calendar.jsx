import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { Button } from '@user/components/ui/button'

function Calendar({ selected, onSelect }) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [currentDate, setCurrentDate] = useState(() => {
    const baseDate = selected || today
    return new Date(baseDate.getFullYear(), baseDate.getMonth(), 1)
  })

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const previousMonth = () => {
    const previous = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    if (previous >= currentMonth) {
      setCurrentDate(previous)
    }
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const handleDayClick = (day) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    newDate.setHours(0, 0, 0, 0)
    if (newDate >= today) {
      onSelect(newDate)
    }
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const days = []

  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day)
  }

  const monthName = currentDate.toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  })
  const isCurrentMonth =
    currentDate.getFullYear() === today.getFullYear() &&
    currentDate.getMonth() === today.getMonth()

  return (
    <div className="w-full bg-card rounded-lg bg-white text-[#2b241f]">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-playfair text-sm font-medium text-[#2b241f]">{monthName}</h2>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={previousMonth}
              disabled={isCurrentMonth}
              className="size-8 rounded-full text-[#3a3129] hover:bg-[#f4eee7] disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextMonth}
              className="size-8 rounded-full text-[#3a3129] hover:bg-[#f4eee7]"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
            <div key={day} className="text-center text-[0.78rem] font-semibold text-[#2f2924]">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {days.map((day, index) => {
            const date = day ? new Date(currentDate.getFullYear(), currentDate.getMonth(), day) : null
            date?.setHours(0, 0, 0, 0)
            const isPast = Boolean(date && date < today)
            const isSelected =
              selected &&
              selected.getFullYear() === currentDate.getFullYear() &&
              selected.getMonth() === currentDate.getMonth() &&
              selected.getDate() === day
            const isToday =
              day &&
              today.getFullYear() === currentDate.getFullYear() &&
              today.getMonth() === currentDate.getMonth() &&
              today.getDate() === day

            return (
              <button
                key={index}
                onClick={() => day && handleDayClick(day)}
                className={cn(
                  'grid aspect-square place-items-center rounded-lg border border-transparent text-sm font-medium leading-none transition-colors',
                  day === null && 'invisible cursor-default',
                  isPast
                    ? 'cursor-not-allowed text-[#bdb2a8] opacity-60'
                    : isSelected || (!selected && isToday)
                      ? 'border-[#7d6a4d] bg-[#d2a45a] text-[#241f1a] shadow-sm'
                      : isToday
                        ? 'border-[#d2a45a] bg-[#f6ead8] text-[#241f1a]'
                        : 'text-[#2c251f] hover:bg-[#f4eee7]'
                )}
                disabled={!day || isPast}
                title={isPast ? 'Past dates are not available' : undefined}
              >
                {day}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export { Calendar }
