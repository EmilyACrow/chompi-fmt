import React, { StrictMode } from 'react';
import Chompi from './chompi.js';
import ReactDOM from 'react-dom/client';
import './index.css';
import SampleBrowser from './sampleBrowser.js';

function App() {
    return (
        <div>
            <Manager />
        </div>
    );
}

class Manager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeBank: 0,
            activeKey: null,
            activeSampler: "jammi",
            banks: {
                jammi: Array(3).fill(Array(14).fill("jammi")),
                cubbi: Array(3).fill(Array(14).fill("cubbi")),
            },
            bank: Array(14).fill(null),
        };
    }

    handleChangeBank(i) {
        this.setState({activeBank: i})
    }

    handleChangeActiveKey(i) {
        this.setState({activeKey: i})
    }

    loadSampleToKey(sample) {
        if (!this.state.activeKey) return

        let bank=this.state.bank;
        let banks = this.state.banks;
        bank[this.state.activeKey] = sample;
        banks[this.state.activeSampler][this.activeBank] = bank;
        
        
        this.setState({banks: banks,
                        bank: bank,
        })
    }

    handleChangeSampler(sampler) {
        this.setState({activeSampler: sampler})
    }

    render() {
        return (
            <div className="app-container">  
                <Chompi 
                    className="chompi"
                    activeBank={this.state.activeBank}
                    changeBank={this.handleChangeBank}
                    activeKey={this.state.activeKey}
                    changeActiveKey={this.handleChangeActiveKey}
                    activeSampler={this.state.activeSampler}
                    changeActiveSampler={this.handleChangeSampler}
                />
                <SampleBrowser 
                    className="browser" 
                    activeBank={this.state.activeBank}
                    activeKey={this.state.activeKey}
                    loadSampleToKey={this.loadSampleToKey}
                />
            </div>
        );
    }

}

export default App;

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<StrictMode>
                <App />
            </StrictMode>);