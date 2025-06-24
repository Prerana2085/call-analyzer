import styles from '@/styles/ResultPanel.module.css';

interface Feedback {
  scores: Record<string, number>;
  overallFeedback: string;
  observation: string;
}

export default function ResultPanel({ feedback }: { feedback: Feedback }) {
  return (
    <div className={styles.result}>
      <h2>Scores</h2>
      <ul>
        {Object.entries(feedback.scores).map(([key, value]) => (
          <li key={key}><strong>{key}:</strong> {value}</li>
        ))}
      </ul>
      <h3>Overall Feedback</h3>
      <p>{feedback.overallFeedback}</p>
      <h3>Observation</h3>
      <p>{feedback.observation}</p>
    </div>
  );
}
