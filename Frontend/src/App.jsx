import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "./App.css";

function App() {
  const [code, setCode] = useState(
    localStorage.getItem("saved_code") ||
      `function sum() {
    return 1+1;
  }`
  );

  const [language, setLanguage] = useState(
    localStorage.getItem("saved_language") || "javascript"
  );

  const [review, setReview] = useState("");

  // 🔹 Auto-save code
  useEffect(() => {
    localStorage.setItem("saved_code", code);
  }, [code]);

  // 🔹 Auto-save language
  useEffect(() => {
    localStorage.setItem("saved_language", language);
  }, [language]);

  // 🔍 Detect language heuristics
  function detectCodeLanguage(code) {
    const c = code.toLowerCase();

    if (
      c.includes("#include") ||
      c.includes("std::") ||
      c.includes("printf") ||
      c.includes("int main")
    )
      return "cpp";

    if (
      c.includes("public class") ||
      c.includes("system.out.println") ||
      c.includes("static void main")
    )
      return "java";

    if (
      c.includes("def ") ||
      c.includes("import ") ||
      c.includes("print(") ||
      c.includes(":")
    )
      return "python";

    if (
      c.includes("select ") ||
      c.includes("insert ") ||
      c.includes("update ") ||
      c.includes("from ") ||
      c.includes(" where ")
    )
      return "sql";

    if (
      c.includes("function") ||
      c.includes("console.log") ||
      c.includes("let ") ||
      c.includes("const ") ||
      c.includes("=>")
    )
      return "javascript";

    return "unknown";
  }

  // 🚀 Trigger Review
  async function reviewcode() {
    const detected = detectCodeLanguage(code);

    if (detected !== "unknown" && detected !== language) {
      setReview(
        `❗ **Language Mismatch!**\n\nDetected from code: **${detected}**\nSelected: **${language}**\n\nPlease correct the selection.`
      );
      return;
    }

    try {
      const response = await axios.post(
        "https://aipoweredcodereviewer-6vrm.onrender.com/ai/get-review",
        {
          code,
          language,
        }
      );
      setReview(response.data.output || response.data);
    } catch (err) {
      console.error(err);
      setReview("❌ Error connecting to backend!");
    }
  }

  return (
    <main>
      <div className="left">
        {/* === Top Language Selector === */}
        <div className="editor-topbar">
          <div className="lang-select-wrapper">
            <select
              className="lang-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="javascript">JavaScript</option>
              <option value="c">C</option>
              <option value="cpp">C++</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="sql">SQL</option>
            </select>
          </div>
        </div>

        {/* === Monaco Editor === */}
        <Editor
          height="calc(100% - 60px)"
          language={language}
          value={code}
          theme="vs-dark"
          onChange={(value) => setCode(value || "")}
          options={{
            minimap: { enabled: false },
            fontSize: 16,
            fontFamily: "JetBrains Mono",
            lineHeight: 24,
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            automaticLayout: true,
            tabSize: 2,
          }}
        />

        {/* === Review Button === */}
        <div className="review" onClick={reviewcode}>
          Review
        </div>
      </div>

      {/* === Right Review Window === */}
      <div className="right">
        <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
      </div>
    </main>
  );
}

export default App;
