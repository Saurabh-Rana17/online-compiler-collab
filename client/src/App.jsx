import axios from "axios";
import "./App.css";
import stubs from "./stubs";
import React, { useState, useEffect } from "react";
import moment from "moment";
import MonacoEditor from 'react-monaco-editor';
import Button from '@mui/material/Button'; // Import Material-UI Button
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Box from '@mui/material/Box'; // Import Material-UI's Box component







function App() {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState(null);
  const [jobDetails, setJobDetails] = useState(null);

  useEffect(() => {
    setCode(stubs[language]);
  }, [language]);

  useEffect(() => {
    const defaultLang = localStorage.getItem("default-language") || "cpp";
    setLanguage(defaultLang);
  }, []);

  let pollInterval;

  const handleSubmit = async () => {
    const payload = {
      language,
      code,
    };
    try {
      setOutput("");
      setStatus(null);
      setJobId(null);
      setJobDetails(null);
      const { data } = await axios.post("http://localhost:5000/run", payload);
      if (data.jobId) {
        setJobId(data.jobId);
        setStatus("Submitted.");

        // poll here
        pollInterval = setInterval(async () => {
          const { data: statusRes } = await axios.get(
            `http://localhost:5000/status`,
            {
              params: {
                id: data.jobId,
              },
            }
          );
          const { success, job, error } = statusRes;
          console.log(statusRes);
          if (success) {
            const { status: jobStatus, output: jobOutput } = job;
            setStatus(jobStatus);
            setJobDetails(job);
            if (jobStatus === "pending") return;
            setOutput(jobOutput);
            clearInterval(pollInterval);
          } else {
            console.error(error);
            setOutput(error);
            setStatus("Bad request");
            clearInterval(pollInterval);
          }
        }, 1000);
      } else {
        setOutput("Retry again.");
      }
    } catch ({ response }) {
      if (response) {
        const errMsg = response.data.err.stderr;
        setOutput(errMsg);
      } else {
        setOutput("Please retry submitting.");
      }
    }
  };

  const setDefaultLanguage = () => {
    localStorage.setItem("default-language", language);
    console.log(`${language} set as default!`);
  };

  const renderTimeDetails = () => {
    if (!jobDetails) {
      return "";
    }
    let { submittedAt, startedAt, completedAt } = jobDetails;
    let result = "";
    submittedAt = moment(submittedAt).toString();
    result += `Job Submitted At: ${submittedAt}  `;
    if (!startedAt || !completedAt) return result;
    const start = moment(startedAt);
    const end = moment(completedAt);
    const diff = end.diff(start, "seconds", true);
    result += `Execution Time: ${diff}s`;
    return result;
  };

  const handleEditorChange = (newValue) => {
    setCode(newValue);
  };

  const editorOptions = {
    selectOnLineNumbers: true,
    fontSize: 14,
    automaticLayout: true,
    lineNumbers: 'on', // 'off' | 'on' | 'relative'
  glyphMargin: true,
  };
  const handleChange = (event) => {
    const shouldSwitch = window.confirm(
      'Are you sure you want to change language? WARNING: Your current code will be lost.'
    );
    if (shouldSwitch) {
      setLanguage(event.target.value);
    }
  };
  const customStyles = {
    // Change the color of the components as desired
    backgroundColor: 'white', // Background color of FormControl
    color: 'red', // Text color of FormControl and InputLabel
    '& .MuiInputBase-root': {
      color: 'green', // Text color of the selected value in Select
    },
  };
  const handleClearClick = () => {
    // Clear the editor's content
    setCode('');
  };  
  const buttonStyles = {
    submitButton: {
      backgroundColor: 'green',
      color: 'white',
      marginRight: '10px',
      '&:hover': {
        backgroundColor: 'darkgreen', // Change the color on hover
      },
    },
    clearButton: {
      backgroundColor: 'red',
      color: 'white',
      '&:hover': {
        backgroundColor: 'darkred', // Change the color on hover
      },
    },
  };
  return (
    <div className="App">
      <h1>Online Code Compiler</h1>
      <div>
      <FormControl variant="filled" style={customStyles}>
      <InputLabel id="language-label">Language</InputLabel>
      <Select
        labelId="language-label"
        value={language}
        onChange={handleChange}
        label="Language"
      >
        <MenuItem value="cpp">C++</MenuItem>
        <MenuItem value="py">Python</MenuItem>
      </Select>
    </FormControl>
      </div>
      <br />
      <div>
      <Button className="btn" variant="contained" >
        Set Default
      </Button>      </div>
      <br />
      {/* <textarea className="inp-box"
        rows="20"
        cols="75"
        value={code}
        onChange={(e) => {
          setCode(e.target.value);
        }}
      ></textarea> */}
      <MonacoEditor
      width="50%"
      height="300"
      language="javascript" // Change this to the desired programming language
      theme="vs-dark" // Change this to your preferred theme
      value={code}
      options={editorOptions}
      onChange={handleEditorChange}
    />
      <br />
      
      <div>
      <Button className="btn"
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        style={{ backgroundColor: 'green', color: 'white', marginRight: '10px' }}
      >
        Submit
      </Button>
      <Button className="btn "
        variant="contained"
        onClick={handleClearClick}
        style={{ backgroundColor: 'red', color: 'white' }}

        
      >
        Clear
      </Button>
    </div>
    
    <Box border={1} padding={2} borderColor="grey.300" borderRadius={4}>
      <p>{status}</p>
      <p>{jobId ? `Job ID: ${jobId}` : ""}</p>
      <p>{renderTimeDetails()}</p>
      <p>{output}</p>
    </Box>
    </div>
  );
}

export default App;
