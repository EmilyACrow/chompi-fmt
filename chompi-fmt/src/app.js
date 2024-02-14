import React from 'react';
import Chompi from './chompi.js';
import Samples from './samples.js';

function App() {
    return (
        <div>
            <div style={{ height: '50vh' }}>
                <Chompi />
            </div>
            <div style={{ height: '50vh' }}>
                <Samples />
            </div>
        </div>
    );
}

export default App;

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);