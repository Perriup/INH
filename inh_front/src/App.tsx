import { useEffect, useState } from 'react'
import './App.css'

import MainPage from './assets/Pages/MainPage'
import LoginPage from './assets/Pages/LoginPage'

function App() {
    const [token, setToken] = useState<string | null>(null)

    useEffect(() => {
        const tryGetTokenFromLocalStorage = () => {
            const token = localStorage.getItem('jwtToken')
            if (token) {
                setToken(token)
            }
        }
        tryGetTokenFromLocalStorage()
    }, []);


    return (
      <div className="App">
      <header className="App-header">
        {token ? <MainPage /> : <LoginPage />}
            </header>
      </div>
  )
}

export default App
