import React from 'react';

export default function RecentPage() {
  return (
    <div style={{ padding: 12, paddingBottom: '70px' }}>
      <h2>최근 기록</h2>
      <p>최근에 조회한 흡연구역 목록이 여기에 표시됩니다.</p>
      <div className="recent-empty" style={{ marginTop: 20, textAlign: 'center', color: '#888' }}>
        최근 기록이 없습니다.
      </div>
    </div>
  );
}