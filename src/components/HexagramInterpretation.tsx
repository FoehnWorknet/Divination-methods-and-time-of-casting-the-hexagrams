'use client'

import { motion } from 'framer-motion'
import { getHexagramData, getYaoInterpretation } from '@/data/ichingData'
import { getHexagramKey } from '@/utils/iching'

interface HexagramInterpretationProps {
  upperTrigram?: string
  lowerTrigram?: string
  changingLine?: number
  isChangedHexagram?: boolean
}

export default function HexagramInterpretation({
  upperTrigram,
  lowerTrigram,
  changingLine,
  isChangedHexagram = false
}: HexagramInterpretationProps) {
  if (!upperTrigram || !lowerTrigram) return null

  const hexagramKey = getHexagramKey(upperTrigram, lowerTrigram)
  const hexagramData = getHexagramData(upperTrigram, lowerTrigram)
  
  if (!hexagramData) {
    console.error('No hexagram data found for:', { upperTrigram, lowerTrigram, key: hexagramKey })
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="mt-8 p-4 bg-white rounded-lg shadow-md"
    >
      <h3 className="text-xl font-bold mb-4">
        {hexagramData.name} - {hexagramData.nature}
        {isChangedHexagram && changingLine && (
          <span className="text-yellow-600 text-base ml-2">
            (由第{changingLine}爻变来)
          </span>
        )}
      </h3>
      
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-2">卦辞</h4>
        <p className="text-gray-700">{hexagramData.description}</p>
      </div>

      {changingLine && !isChangedHexagram && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-2">动爻</h4>
          <div className="bg-yellow-50 p-4 rounded">
            <p className="font-medium text-gray-900">
              {getYaoInterpretation(hexagramData, changingLine).original}
            </p>
            <p className="text-gray-600 mt-2">
              {getYaoInterpretation(hexagramData, changingLine).modern}
            </p>
          </div>
        </div>
      )}

      <div>
        <h4 className="text-lg font-semibold mb-2">爻辞</h4>
        <div className="space-y-4">
          {hexagramData.yao.map((yao, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-3 rounded ${
                changingLine === index + 1 ? 'bg-yellow-50' : 'bg-gray-50'
              }`}
            >
              <p className="font-medium text-gray-900">
                {yao.original}
                {changingLine === index + 1 && (
                  <span className="text-yellow-600 ml-2">(动爻)</span>
                )}
              </p>
              <p className="text-gray-600 mt-1">{yao.modern}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}