import React from 'react'
import LandingPage from './suby/pages/LandingPage'
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './suby/context/ThemeContext'
import TopBar from './suby/components/TopBar'
import ProductMenu from './suby/components/ProductMenu'
import OrderTracking from './suby/components/OrderTracking'

import './App.css'

const App = () => {
  return (
    <ThemeProvider>
      <TopBar />
      <main>
        <Routes>
            <Route path='/' element={<LandingPage />} />
            <Route path='/products/:firmId/:firmName' element={<ProductMenu />} />
            <Route path='/order-tracking' element={<OrderTracking />} />
        </Routes>
      </main>
    </ThemeProvider>
  )
}

export default App