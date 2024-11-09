import React, { useState, useEffect } from 'react'

const ButtonCopy = () => {
  const [copySuccessMessage, setCopySuccessMessage] = useState('')
  const [instructions, setInstructions] = useState('')
  const email = 'email@domain.com'

  useEffect(() => {
    const timer = setTimeout(() => {
      setCopySuccessMessage('')
    }, 5000)
    return () => clearTimeout(timer)
  }, [copySuccessMessage])

  function copyEmail() {
    navigator.clipboard.writeText(email)
    setCopySuccessMessage(`${email} copied to clipboard`)
    setInstructions('')
  }

  function showInstruction() {
    if (copySuccessMessage) {
      return
    }
    setInstructions(`click to copy ${email}`)
  }

  function hideInstruction() {
    setInstructions('')
  }

  return (
    <nav>
      <p>
        {copySuccessMessage} {instructions}
      </p>
      <p
        onClick={copyEmail}
        onMouseOver={showInstruction}
        onMouseOut={hideInstruction}
      >
        Email
      </p>
    </nav>
  )
}
