

// Use MutationObserver for more robust element detection
function injectButton() {
  const target = document.querySelector('[class^="problems_header_content__title"]');
  const hintBtn = document.querySelector('[class^="problems_hint_button"]');
  const problemFooter = document.querySelector('[class^="problems_footer"]');
  const leetcodeTopBtns = document.querySelector('#ide-top-btns');
  
  if (problemFooter || leetcodeTopBtns) {
      // Check if button already exists to prevent multiple injections
      if (document.querySelector('.tutorial-btn')) return;

      const btn = document.createElement('button');
      btn.className = 'tutorial-btn';  // Add a unique class for tracking
      btn.innerText = 'Watch tutorial';
      btn.style.backgroundColor = '#4CAF50';
      btn.style.color = '#fff';
      btn.style.padding = '8px 16px';
      btn.style.border = 'none';
      btn.style.borderRadius = '4px';
      btn.style.cursor = 'pointer';
      btn.style.marginLeft = '8px';

      btn.addEventListener('click', async () => {
          try {
              await window.chrome.runtime.sendMessage({ action: 'openPopup' });
          } catch (error) {
              console.error('Error sending message:', error);
              window.chrome.runtime.sendMessage({ 
                  action: 'openPopup' 
              }, response => {
                  if (window.chrome.runtime.lastError) {
                      console.error('Runtime error:', window.chrome.runtime.lastError);
                  }
              });
          }
      });
      if(problemFooter) {
        const firstChildDiv = problemFooter.querySelector('div:first-child');
        if (firstChildDiv) {
            firstChildDiv.style.display = 'flex';
            firstChildDiv.style.alignItems = 'center';
            firstChildDiv.appendChild(btn);
        }
      }
      else if(leetcodeTopBtns) {
        leetcodeTopBtns.appendChild(btn);
      }
  }
  else if(leetcodeTopBtns) {

  }
}

// Use MutationObserver for dynamic content
const observer = new MutationObserver((mutations) => {
  for (let mutation of mutations) {
      if (mutation.type === 'childList') {
          injectButton();
      }
  }
});

// Start observing the entire document with a configuration
observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Initial attempt
injectButton();