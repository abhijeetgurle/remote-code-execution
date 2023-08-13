import { useEffect, useState } from "react";

import styles from "@/styles/Home.module.css";
import Editor from "react-simple-code-editor";
import axios from "axios";
import { highlight, languages } from "prismjs/components/prism-core";
import { Button } from "antd";
import { Spin } from "antd";

import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css";

const CodeEditor = () => {
  const [code, setCode] = useState(
    `function add(a, b) {\n // Write your code here... \n\n}`
  );

  const [output, setOutput] = useState("");
  const [jobId, setJobId] = useState("");
  const [jobStatus, setJobStatus] = useState("");

  const runCodeClickHandler = () => {
    axios
      .post("http://localhost:8000/code", {
        code: code,
      })
      .then((res) => {
        setJobId(res.data.data.jobId);
        setJobStatus("PROCESSING");
      });
  };

  useEffect(() => {
    if (jobId) {
      const interval = setInterval(() => {
        axios.get(`http://localhost:8000/job/${jobId}`).then((res) => {
          setJobStatus(res.data.data.jobStatus);
          if (res.data.data.jobStatus !== "PROCESSING") {
            clearInterval(interval);
          }
          setOutput(res.data.data.jobOutput);
        });
      }, 3000);
    }
  }, [jobId]);

  const getMessageToDisplay = () => {
    if (jobStatus === "SUCCESS") {
      return (
        <span className={styles.success}>
          Congratulations!!! Your code is running on all test cases
        </span>
      );
    } else if (jobStatus === "MISMATCHED") {
      return (
        <span className={styles.error}>
          Test cases are failing! Please check your code
        </span>
      );
    } else if (jobStatus === "PROCESSING") {
      return <span>Code Is Running</span>;
    }
  };

  return (
    <div className={styles.code}>
      <Editor
        value={code}
        onValueChange={(code) => setCode(code)}
        highlight={(code) => highlight(code, languages.js)}
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 14,
          width: "100%",
          height: "70%",
          border: "1px solid gray",
          borderRadius: "5px",
          backgroundColor: "black",
          color: "white",
        }}
      />
      <Button
        type="primary"
        className={styles.btn}
        onClick={runCodeClickHandler}
      >
        Submit Code
      </Button>
      {jobStatus && (
        <div className={styles.output}>
          <p>Output</p>
          {jobStatus === "PROCESSING" ? (
            <div className={styles.spinnerContainer}>
              <Spin />
            </div>
          ) : (
            <div>{getMessageToDisplay()}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
