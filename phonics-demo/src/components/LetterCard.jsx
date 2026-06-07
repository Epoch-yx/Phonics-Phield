import React from 'react'

export default function LetterCard({ letter, isSelected, isCorrect, isWrong, onClick, disabled }) {
  const baseClasses = `
    w-20 h-20 rounded-2xl flex items-center justify-center
    text-4xl font-bold cursor-pointer
    transition-all duration-200 transform
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 active:scale-95'}
  `

  const stateClasses = isCorrect
    ? 'bg-green-500 text-white shadow-lg scale-110'
    : isWrong
    ? 'bg-red-500 text-white shadow-lg animate-shake'
    : isSelected
    ? 'bg-indigo-500 text-white shadow-lg'
    : 'bg-white text-indigo-600 shadow-md hover:shadow-lg'

  return (
    <button
      className={`${baseClasses} ${stateClasses}`}
      onClick={onClick}
      disabled={disabled}
    >
      {letter}
    </button>
  )
}
