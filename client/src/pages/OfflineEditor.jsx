import axios from "axios";
import "../App.css";
import stubs from "../stubs";
import React, { useState, useEffect } from "react";
import moment from "moment";
import Button from "@mui/material/Button"; // Import Material-UI Button
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Box from "@mui/material/Box"; // Import Material-UI's Box component
import MonacoEditor from "react-monaco-editor";

export default function OfflineEditor() {
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

  const editorOptions = {
    selectOnLineNumbers: true,
    fontSize: 14,
    automaticLayout: true,
    lineNumbers: "on", // 'off' | 'on' | 'relative'
    glyphMargin: true,
  };
  const handleEditorChange = (newValue) => {
    setCode(newValue);
  };

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

  const handleChange = (event) => {
    const shouldSwitch = window.confirm(
      "Are you sure you want to change language? WARNING: Your current code will be lost."
    );
    if (shouldSwitch) {
      setLanguage(event.target.value);
    }
  };
  const customStyles = {
    // Change the color of the components as desired
    backgroundColor: "white", // Background color of FormControl
    color: "red", // Text color of FormControl and InputLabel
    "& .MuiInputBase-root": {
      color: "green", // Text color of the selected value in Select
    },
  };
  const handleClearClick = () => {
    // Clear the editor's content
    setCode("");
  };

  return (
    <div className="App">
      <Box
        backgroundColor={"black"}
        color={"white"}
        border={1}
        margin={1}
        padding={1}
        borderColor="grey.300"
        borderRadius={4}
        className="animated-box"
      >
        <center>
          <h1>Online Code Compiler</h1>
        </center>
      </Box>
      <div className="grid-container">
        <div className="left-section">
          <Box
            className="code-animated-box" // Add a class for animation
            backgroundColor={"black"}
            height={"105%"}
            color={"green"}
            border={1}
            padding={2}
            borderColor="grey.300"
            borderRadius={4}
          >
            <div className="input-container">
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
              <Button className="btn" variant="contained">
                Set Default
              </Button>
            </div>
            <br />
            <MonacoEditor
              width="100%"
              height="325s"
              language="javascript"
              theme="hc-black"
              value={code}
              options={editorOptions}
              onChange={handleEditorChange}
            />
            <br />
            <div>
              <Button
                className="btn"
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                style={{
                  backgroundColor: "green",
                  color: "white",
                  marginRight: "10px",
                }}
              >
                Submit
              </Button>
              <Button
                className="btn"
                variant="contained"
                onClick={handleClearClick}
                style={{ backgroundColor: "red", color: "white" }}
              >
                Clear
              </Button>
            </div>
          </Box>
        </div>
        <div className="right-section">
          <Box
            className="st-animated-box pulse text-color-change"
            backgroundColor={"black"}
            height={"25%"}
            color={"green"}
            border={1}
            padding={2}
            borderColor="grey.300"
            borderRadius={4}
          >
            <p>{status}</p>

            <p>{jobId ? `Job ID: ${jobId}` : ""}</p>

            <p>{renderTimeDetails()}</p>
          </Box>
          <br />
          <Box
            className="op-animated-box rotate color-change"
            backgroundColor={"#05021c"}
            height={"70%"}
            color={"white"}
            border={1}
            padding={2}
            borderColor="grey.300"
            borderRadius={4}
            sx={{ whiteSpace: "pre-line" }}
          >
            {output}
          </Box>
        </div>
      </div>
    </div>
  );
}
