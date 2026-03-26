import { useState } from "react";

const OutputBox = ({ result }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <div className="output">
      <h3>Generated Email</h3>

      <pre>{result}</pre>

      {result && (
        <button className="button" onClick={handleCopy}>
          {copied ? "Copied!!!" : "Copy to Clipboard"}
        </button>
      )}
    </div>
  );
};

export default OutputBox;