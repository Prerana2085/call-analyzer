/*import styles from '@/styles/ResultPanel.module.css';

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
*/


import styles from '@/styles/ResultPanel.module.css';
import { evaluationParameters } from '../../constants/evaluationParams';


interface Feedback {
  scores: Record<string, number>;
  overallFeedback: string;
  observation: string;
}

export default function ResultPanel({ feedback }: { feedback: Feedback }) {
  // Compute final weighted score
  let totalWeighted = 0;
  let totalPossible = 0;

  evaluationParameters.forEach(param => {
    const score = feedback.scores[param.key] ?? 0;
    totalWeighted += score * param.weight;
    totalPossible += param.weight;
  });

  const finalScore = ((totalWeighted / totalPossible) * 100).toFixed(2);

  return (
    <div className={styles.result}>
      <h2>Evaluation Summary</h2>
      <ul>
        {evaluationParameters.map(param => (
          <li key={param.key}>
            <strong>{param.name} ({param.inputType}):</strong> {feedback.scores[param.key] ?? 'N/A'}
          </li>
        ))}
      </ul>

      <h3>✅ Final Weighted Score</h3>
      <p><strong>{finalScore}%</strong></p>

      <h3>🧠 Overall Feedback</h3>
      <p>{feedback.overallFeedback}</p>

      <h3>🔍 Observation</h3>
      <p>{feedback.observation}</p>
    </div>
  );
}
