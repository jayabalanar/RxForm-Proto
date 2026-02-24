import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import InvisalignRxForm from './pages/InvisalignRxForm'
import RxFormPDFView from './pages/RxFormPDFView'
import RxFormTable from './pages/RxForm-Table'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>  
          <Route path="/" element={<RxFormTable />} />
          <Route path="/rx-form/edit" element={<InvisalignRxForm />} />
          <Route path="/rx-form/pdf" element={<RxFormPDFView />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
