import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import RxFormTable from './pages/RxForm-Table'
import { BrowserRouter, Route, Routes } from 'react-router'
import InvisalignRxForm from './pages/InvisalignRxForm'
import RxFormPDFView from './pages/RxFormPDFView'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>  
          {/* <Route path="/" element={<RxFormTable />} /> */}
          <Route path="/" element={<InvisalignRxForm />} />
          <Route path="/rx-form/pdf" element={<RxFormPDFView />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
