import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Login from "./Pages/Login.jsx";
import Register from "./Pages/Register.jsx";
import NotFound from "./Pages/NotFound.jsx";
import Home from "./Pages/Home.jsx";
import GeminiChat from "./Pages/GeminiChat.jsx";

function App() {

  return (
      <BrowserRouter>
          <Routes>
              <Route
                  path="/"
                  element={
                      <ProtectedRoute>
                          <Home />
                      </ProtectedRoute>
                  }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/chat" element={<GeminiChat />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<NotFound />}></Route>
          </Routes>
      </BrowserRouter>
  )
}

export default App
