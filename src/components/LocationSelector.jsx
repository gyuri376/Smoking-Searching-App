import React from 'react'

export default function LocationSelector(){
  return (
    <div className="location">
      <div className="loc-left">
        <div style={{width:36,height:36,borderRadius:10,background:'#eef6ff',display:'flex',alignItems:'center',justifyContent:'center'}}>📍</div>
        <div>
          <div className="loc-city">구미</div>
          <div className="loc-area">인동동</div>
        </div>
      </div>
      <div style={{marginLeft:'auto',color:'#7b8aa3'}}>▼</div>
    </div>
  )
}
