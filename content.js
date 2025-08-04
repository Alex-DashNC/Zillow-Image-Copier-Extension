// Listen for messages from the popup script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getImageUrl") {
        // Find the main picture element on the page
        const pictureElement = document.querySelector('.sc-jNJNQp.ftGxJm');
        if (pictureElement) {
            // Find all the source elements within the picture element
            const sources = pictureElement.querySelectorAll('source');
            let largestImageUrl = '';
            let maxResolution = 0;

            // Loop through each source to find the largest image
            sources.forEach(source => {
                const srcset = source.getAttribute('srcset');
                if (srcset) {
                    // Split the srcset into individual image URLs and their resolutions
                    const urlEntries = srcset.split(',').map(entry => {
                        const parts = entry.trim().split(' ');
                        return {
                            url: parts[0],
                            width: parseInt(parts[1].replace('w', ''), 10)
                        };
                    });

                    // Find the image with the highest resolution in the current srcset
                    const largestInSrcset = urlEntries.reduce((max, current) => {
                        return (current.width > max.width) ? current : max;
                    }, { url: '', width: 0 });

                    // Update the overall largest image if the current one is bigger
                    if (largestInSrcset.width > maxResolution) {
                        maxResolution = largestInSrcset.width;
                        largestImageUrl = largestInSrcset.url;
                    }
                }
            });

            // If no sources were found, try to get the URL from the img tag
            if (!largestImageUrl) {
                const imgElement = pictureElement.querySelector('img');
                if (imgElement) {
                    largestImageUrl = imgElement.src;
                }
            }

            // Send the URL back to the popup
            if (largestImageUrl) {
                sendResponse({ url: largestImageUrl });
            } else {
                sendResponse({ url: null });
            }
        } else {
            sendResponse({ url: null });
        }
    }
    // Return true to indicate that the response will be sent asynchronously
    return true;
});
