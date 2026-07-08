import React, {useEffect, useState} from 'react'

let idCounter = 1

export default function ToastContainer(){
  const [toasts,setToasts] = useState([])

  useEffect(()=>{
    function handle(e){
      const { message, type = 'info', duration = 3000 } = e.detail || {}
      const id = idCounter++
      setToasts(t => [...t, {id, message, type}])
      setTimeout(()=>{
        setToasts(t => t.filter(x=> x.id !== id))
      }, duration)
    }
    window.addEventListener('show-toast', handle)
    return ()=> window.removeEventListener('show-toast', handle)
  },[])

  return (
    <div className="toast-container">
      {toasts.map(t=> (
        <div key={t.id} className={"toast " + t.type}>{t.message}</div>
      ))}
    </div>
  )
}
