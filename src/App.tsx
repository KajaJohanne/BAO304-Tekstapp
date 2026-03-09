import './App.css'
import AppRouter from "./routes/AppRouter"
import { Toaster } from "react-hot-toast"; 

const App = () => {
  return (
    <>
    <AppRouter />
    <Toaster position='top-center' />
    </>
  ) 
}

export default App
