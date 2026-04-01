import { ToastContainer } from '@uxuissk/design-system'
import AuthPage from './pages/AuthPage'

function App() {
  return (
    <>
      <AuthPage />
      {/* DS ToastContainer — global toast notifications */}
      <ToastContainer />
    </>
  )
}

export default App
