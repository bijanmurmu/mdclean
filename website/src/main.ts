import './style.css'
import 'github-markdown-css/github-markdown.css'
import { cleanMarkdown, renderHtml } from './cleaner'

document.addEventListener('DOMContentLoaded', () => {
  const inputMd = document.getElementById('input-md') as HTMLTextAreaElement | null;
  const outputMd = document.getElementById('output-md') as HTMLTextAreaElement | null;
  const cleanBtn = document.getElementById('clean-btn') as HTMLButtonElement | null;
  const copyBtn = document.getElementById('copy-btn') as HTMLButtonElement | null;
  
  const viewRawBtn = document.getElementById('view-raw') as HTMLButtonElement | null;
  const viewPreviewBtn = document.getElementById('view-preview') as HTMLButtonElement | null;
  const outputPreview = document.getElementById('output-preview') as HTMLDivElement | null;

  // --- EDITOR PAGE LOGIC ---
  if (inputMd && outputMd && cleanBtn && copyBtn) {
    const doClean = async () => {
      const raw = inputMd.value;
      if (!raw.trim()) return;
      
      cleanBtn.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
      `;
      
      try {
        const cleaned = await cleanMarkdown(raw);
        outputMd.value = cleaned;
        if (outputPreview && viewPreviewBtn?.classList.contains('active')) {
          outputPreview.innerHTML = await renderHtml(cleaned);
        }
      } catch (e) {
        outputMd.value = "Error parsing markdown. Check console.";
        console.error(e);
      } finally {
        cleanBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
        `;
      }
    };

    cleanBtn.addEventListener('click', doClean);

    copyBtn.addEventListener('click', () => {
      if (!outputMd.value) return;
      navigator.clipboard.writeText(outputMd.value);
      const originalText = copyBtn.innerText;
      copyBtn.innerText = 'COPIED!';
      copyBtn.style.background = 'var(--accent)';
      copyBtn.style.color = 'var(--accent-fg)';
      copyBtn.style.borderColor = 'var(--accent)';
      setTimeout(() => {
        copyBtn.innerText = originalText;
        copyBtn.style.background = '';
        copyBtn.style.color = '';
        copyBtn.style.borderColor = '';
      }, 2000);
    });

    if (viewRawBtn && viewPreviewBtn && outputPreview) {
      viewRawBtn.addEventListener('click', () => {
        viewRawBtn.classList.add('active');
        viewPreviewBtn.classList.remove('active');
        outputMd.style.display = 'block';
        outputPreview.style.display = 'none';
      });

      viewPreviewBtn.addEventListener('click', async () => {
        viewPreviewBtn.classList.add('active');
        viewRawBtn.classList.remove('active');
        outputMd.style.display = 'none';
        outputPreview.style.display = 'block';
        outputPreview.innerHTML = await renderHtml(outputMd.value);
      });
    }
  }

  // Landing page copy command button
  const cmdCopyBtn = document.getElementById('cmd-copy-btn') as HTMLButtonElement | null;
  const installCmd = document.getElementById('install-cmd') as HTMLSpanElement | null;
  
  if (cmdCopyBtn && installCmd) {
    cmdCopyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(installCmd.innerText);
      cmdCopyBtn.classList.add('copied');
      cmdCopyBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
      
      setTimeout(() => {
        cmdCopyBtn.classList.remove('copied');
        cmdCopyBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
      }, 2000);
    });
  }
});
