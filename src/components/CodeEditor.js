import React from 'react';
import MonacoEditor from 'react-monaco-editor';

const CodeEditor = ({ code, setCode }) => (
    <MonacoEditor
        height="400px"
        language="python"
        theme="vs-dark"
        value={code}
        onChange={setCode}
    />
);

export default CodeEditor;
