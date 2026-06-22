import { useEffect, useState } from 'react'

export default function useTypewriter(words, { typeSpeed = 90, deleteSpeed = 50, pause = 1400 } = {}) {
  const [text, setText] = useState('')
  const [i, setI] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!words?.length) return
    const word = words[i % words.length]
    const speed = deleting ? deleteSpeed : typeSpeed

    const t = setTimeout(() => {
      if (!deleting) {
        const next = word.slice(0, text.length + 1)
        setText(next)
        if (next === word) setTimeout(() => setDeleting(true), pause)
      } else {
        const next = word.slice(0, text.length - 1)
        setText(next)
        if (next === '') { setDeleting(false); setI(v => v + 1) }
      }
    }, speed)

    return () => clearTimeout(t)
  }, [text, deleting, i, words, typeSpeed, deleteSpeed, pause])

  return text
}
