import React from 'react'

export default function DetailPanel({spot, onClose, onFavorite}){
  if(!spot) return null
  const openDirections = ()=>{
    // open Google Maps directions
    const url = `https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}`
    window.open(url, '_blank')
  }

  return (
    <div style={{position:'fixed',right:12,bottom:96,width:320,maxWidth:'90%',background:'white',borderRadius:12,boxShadow:'0 8px 24px rgba(0,0,0,0.12)',padding:12}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <strong>{spot.title}</strong>
        <button onClick={onClose} style={{border:'none',background:'transparent',fontSize:18}}>✕</button>
      </div>
      <div style={{marginTop:8,color:'#6b778c'}}>{spot.distance} · {spot.status} · {spot.crowd}</div>
      <p style={{marginTop:8}}>{spot.info}</p>
      <div style={{display:'flex',gap:8,marginTop:10}}>
        <button onClick={openDirections} style={{flex:1,padding:'10px 12px',background:'#0a86f3',color:'white',border:'none',borderRadius:8}}>길찾기</button>
        <button onClick={()=> onFavorite && onFavorite(spot)} style={{padding:'10px 12px',border:'1px solid #ddd',borderRadius:8}}>즐겨찾기</button>
      </div>
    </div>
  )
}
