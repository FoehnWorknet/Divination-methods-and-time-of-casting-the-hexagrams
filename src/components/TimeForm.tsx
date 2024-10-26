'use client'

import { useState } from 'react'

interface TimeFormProps {
  onSubmit: (date?: Date) => void
}

export default function TimeForm({ onSubmit }: TimeFormProps) {
  const [year, setYear] = useState('')
  const [month, setMonth] = useState('')
  const [day, setDay] = useState('')
  const [hour, setHour] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (year && month && day && hour) {
      const date = new Date()
      date.setFullYear(parseInt(year))
      date.setMonth(parseInt(month) - 1)
      date.setDate(parseInt(day))
      date.setHours(parseInt(hour))
      onSubmit(date)
    } else {
      onSubmit()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2 justify-center">
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="年"
          className="w-20 px-2 py-1 border rounded text-center"
          min="1"
        />
        <input
          type="number"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          placeholder="月"
          className="w-16 px-2 py-1 border rounded text-center"
          min="1"
        />
        <input
          type="number"
          value={day}
          onChange={(e) => setDay(e.target.value)}
          placeholder="日"
          className="w-16 px-2 py-1 border rounded text-center"
          min="1"
        />
        <input
          type="number"
          value={hour}
          onChange={(e) => setHour(e.target.value)}
          placeholder="时"
          className="w-16 px-2 py-1 border rounded text-center"
          min="0"
        />
      </div>
      <button
        type="submit"
        className="w-32 mx-auto block bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
      >
        开始占卜
      </button>
    </form>
  )
}