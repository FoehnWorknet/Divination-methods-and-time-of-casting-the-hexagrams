'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import TimeForm from '@/components/TimeForm'
import Hexagram from '@/components/Hexagram'
import CalculationTabs from '@/components/CalculationTabs'
import HexagramInterpretation from '@/components/HexagramInterpretation'
import { 
  generateYao, 
  calculateTrigram, 
  calculateChangingLine,
  getHexagramFromTrigrams,
  getChangedHexagram,
  getHexagramName,
  getYaoName,
  getTrigramsFromHexagram
} from '@/utils/iching'

export default function Home() {
  const [coinHexagram, setCoinHexagram] = useState<number[]>([])
  const [timeHexagram, setTimeHexagram] = useState<number>()
  const [changedHexagram, setChangedHexagram] = useState<number>()
  const [upperTrigram, setUpperTrigram] = useState<string>()
  const [lowerTrigram, setLowerTrigram] = useState<string>()
  const [changingLine, setChangingLine] = useState<number>()
  const [calculationSteps, setCalculationSteps] = useState<any[]>([])
  const [coinUpperTrigram, setCoinUpperTrigram] = useState<string>()
  const [coinLowerTrigram, setCoinLowerTrigram] = useState<string>()

  const handleDivination = (date?: Date) => {
    // Reset previous results
    setCoinHexagram([])
    setTimeHexagram(undefined)
    setChangedHexagram(undefined)
    setUpperTrigram(undefined)
    setLowerTrigram(undefined)
    setChangingLine(undefined)
    setCalculationSteps([])
    setCoinUpperTrigram(undefined)
    setCoinLowerTrigram(undefined)

    // Generate coin hexagram
    const newHexagram: number[] = []
    const allSteps: any[] = []

    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        const { yao, steps } = generateYao()
        newHexagram.push(yao)
        allSteps.push({
          title: `大衍筮法第${i + 1}爻的计算过程`,
          steps: steps
        })
        setCoinHexagram([...newHexagram])
        setCalculationSteps([...allSteps])

        // 当生成完整的六爻后，计算上下卦
        if (newHexagram.length === 6) {
          const value = newHexagram.reduce((acc, curr, idx) => {
            return acc | ((curr % 2 === 1 ? 1 : 0) << idx)
          }, 0)
          const trigrams = getTrigramsFromHexagram(value)
          if (trigrams) {
            setCoinUpperTrigram(trigrams.upper)
            setCoinLowerTrigram(trigrams.lower)
          }
        }
      }, i * 1000)
    }

    // Generate time hexagram if date is provided
    if (date) {
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const hour = date.getHours()

      const timeSteps = []
      
      const upperSum = year + month + day
      timeSteps.push({
        description: '计算上卦数值',
        value: `${year} + ${month} + ${day} = ${upperSum}`
      })
      
      const upper = calculateTrigram(upperSum)
      timeSteps.push({
        description: '确定上卦',
        value: upper
      })
      
      const lowerSum = upperSum + hour
      timeSteps.push({
        description: '计算下卦数值',
        value: `${upperSum} + ${hour} = ${lowerSum}`
      })
      
      const lower = calculateTrigram(lowerSum)
      timeSteps.push({
        description: '确定下卦',
        value: lower
      })
      
      const changing = calculateChangingLine(lowerSum)
      timeSteps.push({
        description: '计算动爻',
        value: changing
      })

      setUpperTrigram(upper)
      setLowerTrigram(lower)
      setChangingLine(changing)

      const hexagram = getHexagramFromTrigrams(upper, lower)
      const changed = getChangedHexagram(hexagram, changing)

      setTimeHexagram(hexagram)
      setChangedHexagram(changed)
      
      allSteps.push({
        title: '梅花易数计算过程',
        steps: timeSteps
      })
      setCalculationSteps([...allSteps])
    }
  }

  return (
    <main className="min-h-screen p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6"
      >
        <h1 className="text-2xl font-bold text-center mb-8">易经占卜 - 双重算法</h1>
        
        <TimeForm onSubmit={handleDivination} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center">大衍筮法</h2>
            <Hexagram lines={coinHexagram} showResult />
            {coinUpperTrigram && coinLowerTrigram && (
              <HexagramInterpretation
                upperTrigram={coinUpperTrigram}
                lowerTrigram={coinLowerTrigram}
              />
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center">梅花易数</h2>
            {timeHexagram !== undefined && (
              <>
                <Hexagram value={timeHexagram} changingLine={changingLine} />
                <p className="text-center text-gray-600 text-sm">
                  本卦：{getHexagramName(timeHexagram)}
                  {upperTrigram && lowerTrigram && changingLine && (
                    <>，上卦：{upperTrigram}，下卦：{lowerTrigram}，动爻：{changingLine}</>
                  )}
                </p>
                {changedHexagram !== undefined && (
                  <>
                    <h3 className="text-lg font-semibold text-center mt-4">变卦</h3>
                    <Hexagram value={changedHexagram} />
                    <p className="text-center text-gray-600 text-sm">
                      变卦：{getHexagramName(changedHexagram)}
                    </p>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {calculationSteps.length > 0 && (
          <CalculationTabs steps={calculationSteps} />
        )}

        {timeHexagram !== undefined && upperTrigram && lowerTrigram && (
          <>
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-center mb-4">梅花易数本卦解释</h2>
              <HexagramInterpretation
                upperTrigram={upperTrigram}
                lowerTrigram={lowerTrigram}
                changingLine={changingLine}
              />
            </div>
            {changedHexagram !== undefined && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-center mb-4">梅花易数变卦解释</h2>
                <HexagramInterpretation
                  upperTrigram={getTrigramsFromHexagram(changedHexagram)?.upper}
                  lowerTrigram={getTrigramsFromHexagram(changedHexagram)?.lower}
                  changingLine={changingLine}
                  isChangedHexagram={true}
                />
              </div>
            )}
          </>
        )}
      </motion.div>
    </main>
  )
}