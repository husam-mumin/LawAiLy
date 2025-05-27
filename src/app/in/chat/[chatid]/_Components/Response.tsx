import React from "react";
import ReactMarkdown from "react-markdown";
export default function Response() {
  return (
    <div>
      <div className="markdown prose">
        <ReactMarkdown>
          {"# Response this is the main Response **how is feel** __awesome__"}
        </ReactMarkdown>
      </div>
    </div>
  );
}
