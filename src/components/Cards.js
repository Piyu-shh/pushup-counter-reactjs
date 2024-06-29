import React from 'react'
import CardItem from './CardItem'
import './Cards.css'
import exmpImage1 from '../images/pushups.png'
import exmpImage2 from '../images/squats.jpg'
function Cards() {
  return (
    <div className='cards'>
        <h1>Check out these awesome excercises!</h1>
        <div className='cards__container'>
            <div className='cards__wrapper'>
                <ul className='cards__items'>
                    <CardItem
                    src={exmpImage1}
                    text="Push-ups build chest, shoulder, and core strength."
                    label="Push-Ups"
                    path='/pushup'
                    />
                    <CardItem
                    src={exmpImage2}
                    text="Squats build leg and glute strength."
                    label="Squats"
                    path='/services'
                    />
                </ul>
            </div>
        </div>
      
    </div>
  )
}

export default Cards