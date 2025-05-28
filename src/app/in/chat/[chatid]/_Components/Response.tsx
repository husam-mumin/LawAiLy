import React from "react";
import ReactMarkdown from "react-markdown";
export default function Response({
  value,
  loading = false,
}: {
  value: string;
  loading: boolean;
}) {
  return (
    <div>
      <div className="relative">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="markdown prose">
            <ReactMarkdown>{value ? value : ""}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
