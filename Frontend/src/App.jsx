import { useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";

import "./App.css";
import RobotLogo from "./assets/robot.png";
import "highlight.js/styles/atom-one-dark.css";

function App() {
  const [code, setCode] = useState("// Write your code here...");
  const [language, setLanguage] = useState("javascript");
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  function detectCodeLanguage(code) {
    const c = code.toLowerCase().trim();

    if (
      /^#include/.test(c) ||
      c.includes("std::") ||
      c.includes("printf(") ||
      /int\s+main\s*\(/.test(c)
    )
      return "cpp";

    if (
      c.includes("public class") ||
      c.includes("system.out.println") ||
      /static\s+void\s+main/.test(c)
    )
      return "java";

    if (
      /^def\s+\w+\(/m.test(c) ||
      /^import\s+\w+/m.test(c) ||
      /print\(/.test(c) ||
      (c.includes(":") && !c.includes(";") && !c.includes("{"))
    )
      return "python";

    if (
      /\bselect\b/i.test(c) ||
      /\binsert\b/i.test(c) ||
      /\bupdate\b/i.test(c) ||
      /\bdelete\b/i.test(c) ||
      /\bfrom\b/i.test(c)
    )
      return "sql";

    if (
      /\bfunction\b/.test(c) ||
      /\bconsole\.log/.test(c) ||
      /\b(let|const|var)\b/.test(c) ||
      /=>/.test(c)
    )
      return "javascript";

    return "unknown";
  }

  async function reviewcode() {
    const detected = detectCodeLanguage(code);

    if (detected !== "unknown" && detected !== language) {
      setReview(
        `⚠ **Language Mismatch!**\nDetected: **${detected}**\nSelected: **${language}**`,
      );
      return;
    }

    setLoading(true);
    setReview("⏳ Reviewing your code... Please wait.");

    try {
      const res = await axios.post(
        "https://aipoweredcodereviewer-6vrm.onrender.com/ai/get-review",
        { code, language },
      );

      setReview(res.data.output || res.data);
    } catch (err) {
      console.error(err);
      setReview("❌ Backend Error — please try again later.");
    }

    setLoading(false);
  }

  return (
    <div className="app-wrapper">
      {/* ================= NAVBAR ================= */}
      <div className="navbar">
        <div className="logo">
          <img src={RobotLogo} alt="logo" className="logo-img" />
          <div className="logo-text">
            <span className="logo-accent">Code</span>
            <span className="logo-dark">Reviewer</span>
          </div>
        </div>
      </div>

      <div className="navbar-divider"></div>

      {/* ================= HERO SECTION ================= */}
      <section className="hero">
        <div className="hero-badge">
          <span className="dot"></span>
          Join thousands of developers improving their code
        </div>

        <h1 className="hero-title">
          Improve What You've <span className="gradient-text">Built</span>,
          Review What's <span className="gradient-text">Shipping</span>
        </h1>

        <p className="hero-subtitle">
          A modern platform for developers to review code, enhance performance,
          fix bugs faster, and ship high-quality software confidently.
        </p>

        <div className="hero-actions">
          <button
            className="primary-btn"
            onClick={() =>
              document
                .getElementById("tool-section")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            <span className="btn-icon">⚡</span>
            <span>Start Reviewing</span>
          </button>
        </div>
      </section>

      {/* ================= TOOL SECTION ================= */}
      <section id="tool-section" className="tool-screen">
        <div className="workspace">
          <div className="editor-pane">
            <div className="topbar">
              <select
                className="language-dropdown"
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

            <Editor
              height="calc(100% - 90px)"
              language={language}
              value={code}
              theme="vs-dark"
              onChange={(v) => setCode(v || "")}
              options={{
                fontSize: 16,
                lineHeight: 24,
                minimap: { enabled: false },
                automaticLayout: true,
              }}
            />

            <div className="bottom-bar">
              <button
                className="review-btn"
                onClick={reviewcode}
                disabled={loading}
              >
                {loading ? "Reviewing..." : "Review"}
              </button>
            </div>
          </div>

          <div className="review-pane">
            {review ? (
              <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
            ) : (
              <p className="placeholder">
                AI review output will appear here...
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
