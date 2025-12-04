import React, { useState, useEffect } from 'react'
import istanbul from '../assets/images/istanbul.webp'
import maldives from '../assets/images/maldives.jpg'
import paris from '../assets/images/parish.jpg'
import beach from '../assets/images/beach.jpg'

const BackgroundCarousel = () => {
  const images = [istanbul, maldives, paris, beach]
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 5000) // Переключение каждые 5 секунд

    return () => clearInterval(interval)
  }, [images.length])

  return (
    <div className="background-carousel">
      {images.map((image, index) => (
        <div
          key={index}
          className={`carousel-slide ${index === currentIndex ? 'active' : ''}`}
          style={{ backgroundImage: `url(${image})` }}
        />
      ))}
      <div className="carousel-overlay"></div>
    </div>
  )
}

export default BackgroundCarousel

