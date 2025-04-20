/**
 * Debug script for Utterances comments
 * Add this to your blog-post.html file to help debug Utterances issues
 */

// Check if Utterances is loaded
function checkUtterancesLoaded() {
  console.log('Checking if Utterances is loaded...');
  
  // Check if the iframe exists
  const utterancesFrame = document.querySelector('.utterances-frame');
  if (utterancesFrame) {
    console.log('Utterances iframe found:', utterancesFrame);
  } else {
    console.log('Utterances iframe not found');
  }
  
  // Check if there are any error messages
  const errorMessages = document.querySelectorAll('.utterances-error');
  if (errorMessages.length > 0) {
    console.log('Utterances error messages found:', errorMessages);
  }
}

// Run the check after a delay to allow Utterances to load
setTimeout(checkUtterancesLoaded, 5000);

// Log GitHub authentication status if possible
window.addEventListener('message', function(event) {
  if (event.origin === 'https://utteranc.es') {
    console.log('Message from Utterances:', event.data);
  }
});
