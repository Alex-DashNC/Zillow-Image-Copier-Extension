// Get references to the button and message elements
const copyButton = document.getElementById('copyButton');
const messageDiv = document.getElementById('message');

// Add a click event listener to the copy button
copyButton.addEventListener('click', () => {
    // Get the currently active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        // Check if the tab is a Zillow property page
        if (activeTab.url.includes('zillow.com/homedetails')) {
            // Send a message to the content script to get the image URL
            chrome.tabs.sendMessage(activeTab.id, { action: "getImageUrl" }, (response) => {
                if (chrome.runtime.lastError) {
                    messageDiv.textContent = 'Error: Could not connect. Please refresh the page.';
                    messageDiv.className = 'message error';
                    console.error(chrome.runtime.lastError.message);
                    return;
                }

                if (response && response.url) {
                    // Copy the URL to the clipboard
                    navigator.clipboard.writeText(response.url).then(() => {
                        messageDiv.textContent = 'URL copied to clipboard!';
                        messageDiv.className = 'message success';
                    }).catch(err => {
                        messageDiv.textContent = 'Failed to copy URL.';
                        messageDiv.className = 'message error';
                        console.error('Failed to copy: ', err);
                    });
                } else {
                    messageDiv.textContent = 'Could not find an image URL on this page.';
                    messageDiv.className = 'message error';
                }
            });
        } else {
            messageDiv.textContent = 'This is not a Zillow listing page.';
            messageDiv.className = 'message warning';
        }
    });
});
