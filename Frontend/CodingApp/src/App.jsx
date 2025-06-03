import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './Components/Home'
import Contact from './Components/Contact'
import About from './Components/About'
import Contests from './Components/Contests'
import Profile from './Components/Profile'
import Signup from './Components/Signup'
import Login from './Components/Login'
import CreateContest from './Admin/Contest/CreateContest'
import ContestPage from './Components/Contest/ContestPage'
import QuestionPage from './Components/Contest/QuestionPage'
import ContestQuestion from './Components/Contest/ContestQuestion'
import AddWalletPage from './Components/Users/AddWallet'
import RegisterContest from './Components/Contest/RegisterContest'
import WithdrawWalletPage from './Components/Users/Withdraw'
import ContestList from './Components/Results/ContestList'
import TopParticipants from './Components/Results/ContestResult'


function App() {
  
  return (
    <>
    
     <BrowserRouter>
     <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/contact' element={<Contact/>}/>
      <Route path='/about' element={<About/>}/>
      <Route path='/contests' element={<Contests/>}/>
      <Route path='/profile' element={<Profile/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/createContest' element={<CreateContest/>}/>
      <Route path="/contest/:id" element={<ContestPage/>} />
      <Route path='/question/:id' element={<QuestionPage/>}/>
      <Route path='/contest/:id/questions' element={<ContestQuestion/>}/>
      <Route path='/profile/addWallet' element={<AddWalletPage/>}/>
      <Route path="/contests/:id/register" element={<RegisterContest/>}/>
      <Route path='/profile/withdraw' element={<WithdrawWalletPage/>}/>
      <Route path='/completedContest' element={<ContestList/>}/>
      <Route path="topWinners/:contestId" element={<TopParticipants/>}/>

     </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
