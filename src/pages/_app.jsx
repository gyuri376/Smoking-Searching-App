import '../styles.css'
import 'leaflet/dist/leaflet.css'
import { AppProvider, useAppContext } from '../context/AppContext'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import DetailPanel from '../components/DetailPanel'
import ToastContainer from '../components/ToastContainer'

function AppLayout({ children }) {
  const { selected, setSelected, addFavorite } = useAppContext()

  return (
    <div className="app">
      <Header />
      <main style={{ paddingBottom: 90 }}>{children}</main>
      <BottomNav />
      <DetailPanel spot={selected} onClose={() => setSelected(null)} onFavorite={addFavorite} />
      <ToastContainer />
    </div>
  )
}

export default function App({ Component, pageProps }) {
  return (
    <AppProvider>
      <AppLayout>
        <Component {...pageProps} />
      </AppLayout>
    </AppProvider>
  )
}
