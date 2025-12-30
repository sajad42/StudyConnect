import './App.css'
import Home from './Pages/Home'
import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom'
import SignUp from './Pages/SignUp'
import SignIn from './Pages/SignIn'
import Dashboard from './Pages/Dashboard'
import Groups from './Pages/Groups'
import CreateGroup from './Pages/CreateGroup'
import Profile from './Pages/Profile'

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/register' element={<SignUp/>} />
        <Route path='/login' element={<SignIn/>} />
        <Route path='/dashboard' element={<Dashboard/>} />
        <Route path='/groups' element={<Groups/>} />
        <Route path='/create-group' element={<CreateGroup/>} />
        <Route path='/profile' element={<Profile/>} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App