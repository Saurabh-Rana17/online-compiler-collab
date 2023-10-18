import { useState } from "react";
import LiveEditorWindow from "./LiveEditorWindow";
import "./liveEditor.css";
export default function LiveEditor() {
  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [js, setJs] = useState("");

  return (
    <>
      <div className="pane top-pane">
        <LiveEditorWindow
          language="xml"
          displayName="HTML"
          value={html}
          onChange={setHtml}
        >
          {" "}
        </LiveEditorWindow>
        <LiveEditorWindow
          language="css"
          displayName="CSS"
          value={css}
          onChange={setCss}
        >
          {" "}
        </LiveEditorWindow>
        <LiveEditorWindow
          language="javascript"
          displayName="JS"
          value={js}
          onChange={setJs}
        >
          {" "}
        </LiveEditorWindow>
      </div>
      <div className="pane">
        <iframe
          title="output"
          sandbox="allow-scripts"
          frameBorder="0"
          width="100%"
          height="100%"
        ></iframe>
      </div>
    </>
  );
}
