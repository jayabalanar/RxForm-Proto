import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import InvisalignRxForm from './pages/InvisalignRxForm'
import RxFormPDFView from './pages/RxFormPDFView'

function App() {

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
