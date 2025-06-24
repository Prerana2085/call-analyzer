'use client';
import styles from '@/styles/FileUpload.module.css';

export default function FileUpload({ onFileSelect }: { onFileSelect: (file: File) => void }) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className={styles.uploadBox}>
      <input type="file" accept=".mp3,.wav" onChange={handleChange} />
    </div>
  );
}
