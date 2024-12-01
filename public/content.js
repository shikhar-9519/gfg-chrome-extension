window.addEventListener('load', () => {
    // Find the element using a partial class selector
    const target = document.querySelector('[class^="problems_header_content__title"]');
    const hintBtn = document.querySelector('[class^="problems_hint_button"]');
    const problemFooter = document.querySelector('[class^="problems_footer"]');
    
    target.style.alignItems = "center";
    if (target) {
      // Create a new button
      const btn = document.createElement('button');
      btn.innerText = 'Watch tutorial';
      btn.style.backgroundColor = '#4CAF50';
      btn.style.color = '#fff';
      btn.style.padding = '8px 16px';
      btn.style.border = 'none';
      btn.style.borderRadius = '4px';
      btn.style.cursor = 'pointer';
      btn.style.marginLeft = '8px';
  
      // Add a click event with error handling
      btn.addEventListener('click', async () => {
        try {
          // Send message to background script
          await window.chrome.runtime.sendMessage({ action: 'openPopup' });
        } catch (error) {
          console.error('Error sending message:', error);
          
          // Fallback approach
          window.chrome.runtime.sendMessage({ 
            action: 'openPopup' 
          }, response => {
            if (window.chrome.runtime.lastError) {
              console.error('Runtime error:', window.chrome.runtime.lastError);
            }
          });
        }
      });
  
      // Insert the button beside the target
      // target.append(btn);
      // hintBtn.parentNode.insertBefore(btn, target.nextSibling)
      if (problemFooter) {
        // Get the first child div
        const firstChildDiv = problemFooter.querySelector('div:first-child');
    
        if (firstChildDiv) {
          // Add flex styling
          firstChildDiv.style.display = 'flex';
          firstChildDiv.style.alignItems = 'center';
           // This will push it to the right
          // Add any other styles or content to newDiv as needed
          
          // Append the new div to the first child
          firstChildDiv.appendChild(btn);
        } 
      }
    } else {
      console.error('Target element not found');
    }
  });
  
  // Listen for messages from background script (optional)
  window.chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Message received in content script:', request);
    return true;
  });