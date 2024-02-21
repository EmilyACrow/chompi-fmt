import React, { StrictMode, useState } from 'react';
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
    const [jammi, setJammi] = useState(Array(3).fill(Array(14).fill("j")));
    const [cubbi, setCubbi] = useState(Array(3).fill(Array(14).fill("c")));
    const [bank, setBank] = useState([...jammi[activeBank]]);
    const [currentSample, setCurrentSample] = useState(null);
    const [samples, setSamples] = useState([]);

    /**
     * Returns a shallow copy of the active sampler banks.
     * @returns {Array} Shallow copy of the active sampler banks.
     */
    const getBanks = (sampler) => { return sampler === "jammi" ? jammi : cubbi; }

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

    const handleUploadSamples = (files) => {
        const formData = new FormData();

        files.forEach(file => {
            formData.append(
                "samples", file,
            );
        });

        axios.post("http://localhost:5000/load-samples", formData)
        .then(() => {
            // Once we've loaded samples, update our sample list
            axios.get("http://localhost:5000/get-samples")
                .then((response) => {
                    const data= response.data; //Data is an array of sample names

                    if(Array.isArray(data)) {
                        setSamples(data.map((sample) => { return sample.filename }));
                    } else {
                        console.log("Not an array")
                    }
                }).catch((error) => {
                    if (error.response) {
                        console.log(error.response)
                        console.log(error.response.status)
                        console.log(error.response.headers)
                    }
                });
        }).catch((error) => {
            if (error.response) {
                console.log(error.response)
                console.log(error.response.status)
                console.log(error.response.headers)
            }
        });

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