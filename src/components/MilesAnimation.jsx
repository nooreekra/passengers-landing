"use client"

import React, { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

const MilesAnimation = () => {
  const { t } = useTranslation()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayTotal, setDisplayTotal] = useState(52000)
  const [hasCompletedCycle, setHasCompletedCycle] = useState(false)
  const animationTimerRef = useRef(null)
  const displayTotalRef = useRef(52000) // Храним текущее значение для синхронного доступа

  // Операции в порядке по нумерации (против часовой стрелки)
  const operations = [
    { id: 1, textKey: 'airlineAlmatyAstana', amount: +500, type: 'earning' },
    { id: 2, textKey: 'hotel', amount: +500, type: 'earning' },
    { id: 3, textKey: 'restaurant', amount: +147, type: 'earning' },
    { id: 4, textKey: 'airlineAstanaLondon', amount: +1500, type: 'earning' },
    { id: 5, textKey: 'coffeeShop', amount: +15, type: 'earning' },
    { id: 6, textKey: 'banking', amount: +1960, type: 'earning' },
    { id: 7, textKey: 'flightAlmatyDubai', amount: -23500, type: 'deduction' },
  ]

  const baseTotal = 52000

  // Функция для запуска анимации счетчика
  const animateCounter = (targetTotal, startTotal) => {
    // Очищаем предыдущий таймер, если он есть
    if (animationTimerRef.current) {
      clearInterval(animationTimerRef.current)
      animationTimerRef.current = null
    }

    const duration = 1000 // 1 секунда анимации
    const steps = 30
    const difference = targetTotal - startTotal
    const stepValue = difference / steps
    const stepDuration = duration / steps

    if (Math.abs(difference) < 1) {
      setDisplayTotal(targetTotal)
      displayTotalRef.current = targetTotal
      return
    }

    let currentStep = 0
    animationTimerRef.current = setInterval(() => {
      currentStep++
      if (currentStep <= steps) {
        const newValue = startTotal + (stepValue * currentStep)
        const roundedValue = Math.round(newValue)
        setDisplayTotal(roundedValue)
        displayTotalRef.current = roundedValue
      } else {
        setDisplayTotal(targetTotal)
        displayTotalRef.current = targetTotal
        if (animationTimerRef.current) {
          clearInterval(animationTimerRef.current)
          animationTimerRef.current = null
        }
      }
    }, stepDuration)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      // Получаем текущее значение синхронно
      const currentTotal = displayTotalRef.current
      
      // Вычисляем следующий индекс используя функциональную форму
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) >= operations.length ? 0 : prevIndex + 1
        
        // Вычисляем целевую сумму для следующей операции
        let targetTotal
        if (nextIndex === 0) {
          // Возвращаемся к базовой сумме
          setHasCompletedCycle(true)
          targetTotal = baseTotal
        } else {
          // Вычисляем накопленную сумму до следующей операции
          let accumulated = baseTotal
          operations.slice(0, nextIndex + 1).forEach(op => {
            accumulated += op.amount
          })
          targetTotal = accumulated
        }

        // Запускаем анимацию счетчика синхронно с переключением операции
        animateCounter(targetTotal, currentTotal)
        
        return nextIndex
      })
    }, 2000) // Переключение каждые 2 секунды

    return () => {
      clearInterval(interval)
      if (animationTimerRef.current) {
        clearInterval(animationTimerRef.current)
        animationTimerRef.current = null
      }
    }
  }, [operations.length])

  // Синхронизируем ref с состоянием
  useEffect(() => {
    displayTotalRef.current = displayTotal
  }, [displayTotal])


  return (
    <div className="miles-animation-container">
      <div className="miles-balance">
        <div className="miles-balance-content">
          <div className="my-account-label">{t('landing.milesAnimation.myAccount')}</div>
          <div className="miles-label">{t('landing.milesAnimation.milesTotal')}</div>
          <div className="miles-total">{displayTotal.toLocaleString()}</div>
        </div>
      </div>

      <div className="miles-operations">
        <div className="operations-semicircle">
          {operations.map((operation, index) => {
            // Вертикальный полукруг: активная операция внизу (90°), остальные вокруг
            const totalAngle = 180 // Полукруг от -90 до +90
            const centerAngle = 90 // Центр внизу

            // Вычисляем относительную позицию от текущей активной операции
            let relativeIndex = index - currentIndex
            // Нормализуем для корректного расчета
            if (relativeIndex < 0) {
              relativeIndex += operations.length
            }
            if (relativeIndex >= operations.length) {
              relativeIndex -= operations.length
            }

            // Распределяем операции по полукругу
            // Активная операция (relativeIndex === 0) внизу по центру (90°)
            // Остальные распределяются вокруг (по часовой стрелке)
            const angleStep = totalAngle / (operations.length - 1)
            const angle = centerAngle + (relativeIndex * angleStep)
            const radius = 150

            // Конвертируем в радианы
            const radian = (angle * Math.PI) / 180
            const x = Math.cos(radian) * radius
            const y = Math.sin(radian) * radius

            const isActive = index === ((currentIndex + 3) % operations.length)

            return (
              <div
                key={operation.id}
                className={`operation-item ${isActive ? 'active' : ''}`}
                style={{
                  transform: `translate(${x +100}px, ${y}px)`,
                  transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                <div className="operation-content">
                  <div className="operation-text">{t(`landing.milesAnimation.operations.${operation.textKey}`)}</div>
                  <div className={`operation-amount ${operation.type}`}>
                    {operation.amount > 0 ? '+' : ''}{operation.amount.toLocaleString()}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default MilesAnimation

