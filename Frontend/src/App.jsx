import React from 'react'
import { Outlet } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/store'

function App() {
  return (
    <div className='scrollbar'>
      <Provider store={store}>
        <Outlet/>
      </Provider>
    </div>
  )
}

export default App
