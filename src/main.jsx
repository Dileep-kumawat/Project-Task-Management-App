import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Claude from './claude.jsx'
import "./features/shared/styles/main.css";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        {/* <App /> */}
        <Claude />
    </StrictMode>,
)
