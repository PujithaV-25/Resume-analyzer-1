import React, { useState } from "react";
import "./Styles.css";

function App() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile || !jobDescription) {
      alert("Please upload a resume and enter the job description.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("jobDescription", jobDescription);

    setLoading(true);
    setResult("");

    try {
      const response = await fetch("http://localhost:5000/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.result);
      } else {
        setResult("Analysis failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setResult("Server error. Check your connection.");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h2 className="heading">Resume Analyzer</h2>
      <form onSubmit={handleSubmit}>

        <div className="upload_container">
  <div className="upload_box">
    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAaVBMVEX///8AAABNTU3p6em1tbVRUVGrq6vd3d3e3t77+/tXV1fa2trNzc0YGBgfHx81NTXw8PDExMRlZWW8vLyFhYUvLy92dnZERESdnZ1bW1vz8/NycnIPDw9tbW3l5eWwsLA8PDwpKSkjIyMVq0aKAAADqklEQVR4nO3da1PiQBCF4YkBuQoCooguqP//R64upWYmk0sn2z2c1Hm+sVSq5y0Fb5lZ54iIiIiIiIiIiIiIiIiIiIiIiIgq5JvRJk+9CEWTcfZlPEm9EC3n7Ns59VJ03Ga/blMvRkMxcJCJfuAAE8PAwSWWAweWGAscVGI8cECJVYGDSawOHEhiXeAgEusDB5DYFAif2BwIntgmEDqxXSBwYttA2MT2gaCJkkDIRFkgYKI0EC5RHgiW2CUQKjEWuNp7D/cr5MToR/A09x7OT8AfxWjgwt14j2/cAjYxGjhxpUI3AU2MBk5dpNBNIRMrAyOFkIlVn6IuWgj4ibqJrXhxeS5WGH+72aQLaHRXHRgvjCbepVp+s11kuT9/DY0XRj9Rd2mW38JjTWBVYSzxMcXiWxnXBFYWRhLH9ktvaR4udVF4srKw/FqcWy+8tYeawJrCUuKD7bIFljWBdYVh4tJy0TJPxXUG95TUFfqvxSe7BYvl1YH1hV7iVd9SNP3+mr+ahk/VF7rp94/Ed6Urr8vssP5c5fowKz3TUFhz5dW5z+9j/9xUWH0lihaF4FiIj4X4WIiPhfhYiI+F+FiIj4X4WIiPhfhYiI+F+FiIj4X4WIiPhfhYiI+F+FiIj4X4oArvN6ON+P6snoWdZnY0udzs/Cy8h7BX4fT531Vzk3PQfs8kG4mu61M4+rnO4By04rYY0d3KPQqLd1frb6gp7v0UbW7pUVjcirOSLVdu5K1Tsrmle6G/FUf22pDzt8VINrd0L+w+swt/W4xk60f3Qn+jivaGmnHnacFOZ5OZXXSf5m+okWyLQSn0N9RIvtCgFHobakTbYmAKixtqRNtiYAp/t8WUN9SozZTrNW12+DocYy/dFgNU+OmYH81nXvO0FDNZiD+ThfgzWYg/k4X4M1mIP5OF+DOHX+j/xmytPO1i7c3UPrxm603LlKdd+CO3ytOCQ3YszqwKztfSPp4nOHLuXXncl3d/pPaBdeGBRy/K85x7CSYumi/pZfYaDNzKf+8icQxe+Nmr+ukuf7LQw/KU6zgtw7O1suyPdmD8aERDBocqfiQN/NAPLNypkILJ/9i2b16Hmr1FYHjunCmjs+rKb3BWzI4bvGleiwq7m+Fm6+bVKFgbHuV2fEsQ+Kb73VMo/GZKn/ZPTSUH48CDdaBzueWHcZvmPMyFVeNW+yemasezfuT2bPsOU5YvdyMtu+VVn9ZKRERERERERERERERERERERERE/91fq2UnrlYpI/sAAAAASUVORK5CYII=" alt="upload icon" className="upload_icon"/>
    <p><strong>Upload a PDF Resume</strong> or <span className="choose_file">choose a file.</span></p>
    <input type="file" accept="application/pdf" onChange={(e) => setResumeFile(e.target.files[0])} className="input_box"/>
    <p className="subtext">English resumes in <strong>PDF</strong></p>
  </div>
</div>
        <div className="divv_2">
          <label>Enter Job Description:</label>
          <textarea
            rows="5"
            cols="50"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Enter Job Description Here..."
          />
        </div>
        <button type="submit" className="analyze_btn">
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>
      </form>

      {result && (
        <div className="result_div">
          <h3 className="result_title">Analysis Result:</h3>
          {result}
        </div>
      )}
    </div>
  );
}

export default App;
