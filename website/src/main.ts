import './style.css'
import { cleanMarkdown } from './cleaner'

document.addEventListener('DOMContentLoaded', () => {
  const inputMd = document.getElementById('input-md') as HTMLTextAreaElement;
  const outputMd = document.getElementById('output-md') as HTMLTextAreaElement;
  const cleanBtn = document.getElementById('clean-btn') as HTMLButtonElement;
  const copyBtn = document.getElementById('copy-btn') as HTMLButtonElement;

  const doClean = async () => {
    const raw = inputMd.value;
    if (!raw.trim()) return;
    
    cleanBtn.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
      Processing...
    `;
    
    try {
      const cleaned = await cleanMarkdown(raw);
      outputMd.value = cleaned;
    } catch (e) {
      outputMd.value = "Error parsing markdown. Check console.";
      console.error(e);
    } finally {
      cleanBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
        Auto-Heal
      `;
    }
  };

  cleanBtn.addEventListener('click', doClean);

  copyBtn.addEventListener('click', () => {
    if (!outputMd.value) return;
    navigator.clipboard.writeText(outputMd.value);
    const originalText = copyBtn.innerText;
    copyBtn.innerText = 'Copied!';
    copyBtn.style.background = '#27c93f';
    copyBtn.style.color = '#000';
    setTimeout(() => {
      copyBtn.innerText = originalText;
      copyBtn.style.background = '';
      copyBtn.style.color = '';
    }, 2000);
  });
});
