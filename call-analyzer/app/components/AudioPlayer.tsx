'use client';
import styles from '@/styles/AudioPlayer.module.css';

export default function AudioPlayer({ src }: { src: string }) {
  return (
    <audio className={styles.audioPlayer} controls>
      <source src={src} />
      Your browser does not support the audio element.
    </audio>
  );
}
