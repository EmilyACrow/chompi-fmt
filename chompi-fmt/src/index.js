import React, { StrictMode } from 'react';
import Chompi from './chompi.js';
import ReactDOM from 'react-dom/client';
import './index.css';

function App() {
    return (
        <div>
            <div style={{ width: '50vw' }}>
                <Chompi />
            </div>
        </div>
    );
}

export default App;

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<StrictMode>
                <App />
            </StrictMode>);