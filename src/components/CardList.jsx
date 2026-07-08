import React, {useEffect, useRef} from 'react'

export default function CardList({spots = [], activeId, onSelect}){
  const containerRef = useRef(null)
  const itemRefs = useRef({})

  useEffect(()=>{
    if(!activeId) return
    const el = itemRefs.current[activeId]
    if(el && containerRef.current){
      el.scrollIntoView({behavior:'smooth', inline:'start', block:'nearest'})
    }
  },[activeId])

  return (
    <div className="cards" ref={containerRef}>
      {spots.map(s=> (
        <article
          className={"card" + (activeId===s.id? ' active':'')}
          key={s.id}
          ref={el=> itemRefs.current[s.id]=el}
          onClick={()=> onSelect && onSelect(s)}
          style={{cursor:'pointer'}}
        >
          <img src={s.img || 'https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=800&q=60'} alt="thumb" />
          <div className="card-body">
            <h4 className="card-title">{s.title}</h4>
            <div className="card-meta">
              <span className="badge">{s.distance}</span>
              <span style={{color:'#7b8aa3',fontSize:13}}>{s.status}</span>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
