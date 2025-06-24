/*'use client';

import React, { useState } from 'react';

type ResultType = {
  scores: Record<string, number>;
  overallFeedback: string;
  observation: string;
};

export default function Home() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ResultType | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setAudioFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!audioFile) return;
    setIsLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', audioFile);

    try {
      const res = await fetch('/api/analyze-call', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>🎧 Call Analyzer</h1>
      <input type="file" accept=".mp3,.wav" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={isLoading} style={{ margin: '1rem 0' }}>
        {isLoading ? 'Processing...' : 'Process'}
      </button>

      {audioFile && (
        <audio controls src={URL.createObjectURL(audioFile)} style={{ marginBottom: '1rem' }} />
      )}

      {result && (
        <div style={{ border: '1px solid #ccc', padding: '1rem' }}>
          <h2>🎯 Evaluation Scores:</h2>
          {result?.scores ? (
            <ul>
              {Object.entries(result.scores).map(([key, value]) => (
                <li key={key}>
                  <strong>{key}</strong>: {String(value)}
                </li>
              ))}
            </ul>
          ) : (
            <p>No scores returned from the server.</p>
          )}

          <h3>📝 Overall Feedback:</h3>
          <p>{result.overallFeedback || 'N/A'}</p>

          <h3>🔍 Observation:</h3>
          <p>{result.observation || 'N/A'}</p>
        </div>
      )}
    </main>
  );
}
*/
'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
      setAudioURL(URL.createObjectURL(file));
    }
  };

  const handleProcess = async () => {
    if (!audioFile) return;
    setIsLoading(true);

    const formData = new FormData();
    formData.append('file', audioFile);

    try {
      const res = await fetch('/api/analyze-call', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error('API error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>🎧 Call Analyzer</h1>

      <label className={styles.uploadBox}>
        <input
          type="file"
          accept=".mp3,.wav"
          hidden
          onChange={handleFileChange}
        />
        {audioFile ? audioFile.name : 'Click to upload or drag & drop a file'}
      </label>

      {audioURL && (
        <audio controls className={styles.audioPlayer}>
          <source src={audioURL} />
        </audio>
      )}

      <button
        className={styles.processButton}
        onClick={handleProcess}
        disabled={!audioFile || isLoading}
      >
        {isLoading ? 'Processing...' : '🚀 Process'}
      </button>

      {result && (
        <div className={styles.resultPanel}>
          <h2>📝 <u>Evaluation Results</u></h2>

          {result?.scores ? (
            <table className={styles.resultTable}>
              <thead>
                <tr>
                  <th>Criteria</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(result.scores as Record<string, number>).map(([key, value]) => (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No scores returned.</p>
          )}

          <div className={styles.feedbackSection}>
            <p><strong>🗣 Overall Feedback:</strong> {result.overallFeedback}</p>
            <p><strong>🔍 Observation:</strong> {result.observation}</p>
          </div>
        </div>
      )}
    </div>
  );
}
