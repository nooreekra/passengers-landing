import React, { useState, useEffect } from 'react'

const MilesAnimation = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayTotal, setDisplayTotal] = useState(52000)
  const [hasCompletedCycle, setHasCompletedCycle] = useState(false)

  // Операции в порядке по нумерации (против часовой стрелки)
  const operations = [
    { id: 1, text: 'Airline Almaty - Astana', amount: +500, type: 'earning' },
    { id: 2, text: 'Hotel', amount: +500, type: 'earning' },
    { id: 3, text: 'Restaurant', amount: +147, type: 'earning' },
    { id: 4, text: 'Airline Astana - London', amount: +1500, type: 'earning' },
    { id: 5, text: 'Coffee Shop', amount: +15, type: 'earning' },
    { id: 6, text: 'Banking', amount: +1960, type: 'earning' },
    { id: 7, text: 'Flight Almaty - Dubai', amount: -23500, type: 'deduction' },
  ]

  const baseTotal = 52000

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1
        // Когда дошли до последней операции и переходим к началу
        if (nextIndex >= operations.length) {
          setHasCompletedCycle(true)
          return 0 // Возвращаемся к началу
        }
        return nextIndex
      })
    }, 2000) // Переключение каждые 2 секунды

    return () => clearInterval(interval)
  }, [operations.length])

  // Анимация счетчика при изменении индекса
  useEffect(() => {
    let targetTotal
    
    // Если это начало цикла (currentIndex === 0 после завершения цикла), возвращаемся к базовой сумме
    if (currentIndex === 0 && hasCompletedCycle) {
      targetTotal = baseTotal
      setHasCompletedCycle(false)
    } else if (currentIndex === 0 && !hasCompletedCycle) {
      // Первая операция - начинаем с базовой суммы
      targetTotal = baseTotal
    } else {
      // Вычисляем накопленную сумму до текущей операции
      let accumulated = baseTotal
      operations.slice(0, currentIndex + 1).forEach(op => {
        accumulated += op.amount
      })
      targetTotal = accumulated
    }

    const duration = 1000 // 1 секунда анимации
    const steps = 30
    const difference = targetTotal - displayTotal
    const stepValue = difference / steps
    const stepDuration = duration / steps

    if (Math.abs(difference) < 1) {
      setDisplayTotal(targetTotal)
      return
    }

    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      if (currentStep <= steps) {
        setDisplayTotal(prev => {
          const newValue = prev + stepValue
          return Math.round(newValue)
        })
      } else {
        setDisplayTotal(targetTotal)
        clearInterval(timer)
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [currentIndex, baseTotal, operations])


  return (
    <div className="miles-animation-container">
      <div className="miles-balance">
        <div className="miles-balance-content">
          <div className="miles-label">Miles, total</div>
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
                  <div className="operation-text">{operation.text}</div>
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

