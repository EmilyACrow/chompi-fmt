import { StrictMode, useState } from 'react';
import Chompi from './chompi.js';
import ReactDOM from 'react-dom/client';
import './index.css';
import SampleBrowser from './sampleBrowser.js';
import axios from 'axios';

function App() {
    return (
        <div>
            <Manager />
        </div>
    );
}

function getBankColors(bank) {
    let bankColor, hoverColor;
    switch(bank) {
        case 1:
            bankColor = "#F6C95E";
            hoverColor = "#CEA136";
            break;
        case 2:
            bankColor = "#64BDCA";
            hoverColor = "#3C95A2";
            break;
        default:
            bankColor = "#A794C2";
            hoverColor = "#7F6C9A";
    }
    return {
        bankColor: bankColor,
        bankHover: hoverColor,
        activeColor: "#25BE7A",
        activeHover: "#22b473", //#1A8D54
    }
}

function Manager() {
    const [activeBank, setActiveBank] = useState(0);
    const [activeKey, setActiveKey] = useState(null);
    const [activeSampler, setActiveSampler] = useState("jammi");
    const [jammi, setJammi] = useState(Array(3).fill(Array(14).fill(null)));
    const [cubbi, setCubbi] = useState(Array(3).fill(Array(14).fill(null)));
    const [bank, setBank] = useState([...jammi[activeBank]]);
    const [currentSample, setCurrentSample] = useState(null);
    const [samples, setSamples] = useState([]);

    /**
     * Returns a shallow copy of the active sampler banks.
     * @returns {Array} Shallow copy of the active sampler banks.
     */
    const getBanks = (sampler) => { return sampler === "jammi" ? jammi : cubbi; }

    /**
     * Returns a JSON string of the current chompi state.
     * @returns {String} JSON string of current chompi state
     */
    const formatExportData = () => {
        let data = {"samples": []};
        for(let bank = 0; bank < 3; bank++) {
            for (let slot = 0; slot < 14; slot++) {
                if(jammi[bank][slot] != null) {
                    data.samples.push({'filename' : jammi[bank][slot],
                                        'sampler' : 'jammi',
                                        'bank' : bank,
                                        'slot' : slot + 1});
                }
                if(cubbi[bank][slot] != null) {
                    data.samples.push({'filename' : cubbi[bank][slot],
                                        'sampler' : 'cubbi',
                                        'bank' : bank,
                                        'slot' : slot + 1});
                }
            }
        }
        return JSON.stringify(data);
    }

    const cloneBank = (sampler, bank) => {
        return sampler[bank].map((i) => i);
    }

    const handleSetBank = (i) => {
        if (i === activeBank) return;

        setActiveBank(i);
        setBank(cloneBank(getBanks(activeSampler), i));
        // toggle the active key off when we change banks
        handleSetActiveKey(null);
    };

    const handleSetActiveKey = (i) => {
        let val = i === activeKey ? null : i;
        setActiveKey(val);
        setCurrentSample(getBanks(activeSampler)[activeBank][val]);
    };

    const handleSetSampler = (sampler) => {
        if (sampler === activeSampler) return;

        setActiveSampler(sampler);
        setBank(cloneBank(getBanks(sampler), activeBank));
        handleSetActiveKey(null);
    };

    const catchError = (error) => {
        if (error.response) {
            console.log(error.response)
            console.log(error.response.status)
            console.log(error.response.headers)
        }
    }

    const getSamples = () => {
        // Once we've loaded samples, update our sample list
        axios.get("http://localhost:5000/get-samples")
            .then((response) => {
                const data= response.data; //Data is an array of sample names

                if(Array.isArray(data)) {
                    setSamples(data.map((sample) => { return sample.filename }));
                } else {
                    console.log("Not an array")
                }
            }).catch(error => catchError(error));

    }

    const handleUploadSamples = (files) => {
        const formData = new FormData();

        files.forEach(file => {
            formData.append(
                "samples", file,
            );
        });

        axios.post("http://localhost:5000/load-samples", formData)
        .then(getSamples)
        .catch(error => catchError(error));

    }

    const handleSampleClick = (sample) => {
        if (activeKey !== null) {
            let updatedBank = [...bank];
            let updatedBanks = {"cubbi": [], "jammi": []};
            updatedBank[activeKey] = sample;
            
            for(let i = 0; i < 3; i++) {
                if(i === activeBank) {
                    updatedBanks["cubbi"].push(activeSampler === "cubbi" ? updatedBank : cloneBank(cubbi, i));
                    updatedBanks["jammi"].push(activeSampler === "jammi" ? updatedBank : cloneBank(jammi, i));
                } else {
                    updatedBanks["cubbi"].push(cloneBank(cubbi, i));
                    updatedBanks["jammi"].push(cloneBank(jammi, i));
                }
            }

            setCurrentSample(sample);
            setBank(updatedBank);
            setCubbi(updatedBanks["cubbi"]);
            setJammi(updatedBanks["jammi"]);
        }
    }

    const handleDeleteSample = (sample) => {
        let data = {"filename": sample};

        axios.post("http://localhost:5000/delete-sample", 
            JSON.stringify(data),
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        .then(getSamples)
        .catch(error => catchError(error));
    }

    const handleExport = () => {
        let data = formatExportData();
        axios.post("http://localhost:5000/export", 
            data,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        .then((response) => {
            console.log(response.data);
        })
        .catch(error => catchError(error));
    }

    return (
        <div className="app-container">
            <Chompi
                className="chompi"
                activeBank={activeBank}
                setActiveBank={handleSetBank}
                activeKey={activeKey}
                setActiveKey={handleSetActiveKey}
                activeSampler={activeSampler}
                setActiveSampler={handleSetSampler}
                currentSample={currentSample}
                getBankColors={getBankColors}
                handleExport={handleExport}
            />
            <SampleBrowser
                className="browser"
                bank={bank}
                activeKey={activeKey}
                samples={samples}
                loadSamples={handleUploadSamples}
                currentSample={currentSample}
                onSampleClick={handleSampleClick}
                getBankColors={() => getBankColors(activeBank)}
                onDeleteSampleClick={handleDeleteSample}
            />
        </div>
    );
}

export default App;

// ========================================

// Reset the samples folder so that samples don't persist between sessions
axios({
    method: "POST",
    url: "http://localhost:5000/delete-all-samples",
}).then (
    (response) => {
        console.log(response.data)
    }
).catch(
    (error) => {
        console.log(error)
    }
)

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<StrictMode>
                <App />
            </StrictMode>);