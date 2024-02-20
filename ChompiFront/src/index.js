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
    const [banks, setBanks] = useState({
        jammi: Array(3).fill(Array(14).fill("jammi")),
        cubbi: Array(3).fill(Array(14).fill("cubbi")),
    });
    const [bank, setBank] = useState(Array(14).fill(null));
    const [currentSample, setCurrentSample] = useState(null);
    const [samples, setSamples] = useState([]);

    const handleSetBank = (i) => {
        setActiveBank(i);
    };

    const handleSetActiveKey = (i) => {
        setActiveKey(i);
    };

    const handleSetSampler = (sampler) => {
        setActiveSampler(sampler);
    };

    const handleSetCurrentSample = (sample) => {
        setCurrentSample(sample);
        if (activeKey) {
            let updatedBank = [...bank];
            let updatedBanks = { ...banks };
            updatedBank[activeKey] = sample;
            updatedBanks[activeSampler][activeBank] = updatedBank;

            setBank(updatedBank);
            setBanks(updatedBanks);
        }
    }

    const handleUploadSamples = (files) => {
        const formData = new FormData();

        files.forEach(file => {
            formData.append(
                "samples", file,
            );
        });

        axios({
            method: "POST",
            url: "http://localhost:5000/load-samples",
            data: formData,
        })
        .then((response) => {
            const data= response.data; //Data is an array of sample names

            if(Array.isArray(data)) {
                let loadedSamples = data.filter((sample) => 
                    (sample.status && sample.status === "success")
                ).map((sample) => { return sample.filename });

                setSamples([...samples, ...loadedSamples]);
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
                getBankColors={() => getBankColors(activeBank)}
            />
            <SampleBrowser
                className="browser"
                bank={bank}
                activeKey={activeKey}
                samples={samples}
                loadSamples={handleUploadSamples}
                currentSample={currentSample}
                setCurrentSample={handleSetCurrentSample}
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