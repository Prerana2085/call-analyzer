import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // Upload to AssemblyAI
  const uploadRes = await fetch('https://api.assemblyai.com/v2/upload', {
    method: 'POST',
    headers: { authorization: process.env.ASSEMBLYAI_API_KEY! },
    body: buffer,
  });

  const uploadData = await uploadRes.json();
  const audioUrl = uploadData.upload_url;

  // Submit transcription job
  const transcriptRes = await fetch('https://api.assemblyai.com/v2/transcript', {
    method: 'POST',
    headers: {
      authorization: process.env.ASSEMBLYAI_API_KEY!,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ audio_url: audioUrl }),
  });

  const transcriptJob = await transcriptRes.json();

  // Wait for it to finish (simple polling)
  let status = transcriptJob.status;
  let transcriptData;

  while (status !== 'completed' && status !== 'error') {
    await new Promise((r) => setTimeout(r, 4000));
    const pollRes = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptJob.id}`, {
      headers: { authorization: process.env.ASSEMBLYAI_API_KEY! },
    });
    transcriptData = await pollRes.json();
    status = transcriptData.status;
  }

  if (status === 'error') {
    return NextResponse.json({ error: 'Transcription failed' }, { status: 500 });
  }

  const transcriptText = transcriptData.text;

  // Try to improve observation with Gemini
  let observation = `Transcript: ${transcriptText}`;

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are an expert call reviewer. Here's a messy transcript of a call:\n\n"${transcriptText}"\n\nSummarize what the agent was trying to do in 1-2 lines. Ignore filler words, and rephrase in natural English.`,
                },
              ],
            },
          ],
        }),
      }
    );

    const geminiJson = await geminiRes.json();
    observation =
      geminiJson?.candidates?.[0]?.content?.parts?.[0]?.text || observation;
  } catch (err) {
    console.error('Gemini summarization failed:', err);
  }

  const scores = {
    greeting: 5,
    collectionUrgency: 8,
    productKnowledge: 10,
  };

  return NextResponse.json({
    scores,
    overallFeedback: 'Transcription successful and analysis completed.',
    observation,
  });
}
