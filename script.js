// Voice ID for Verity
const VERITY_VOICE_ID = '8d21b053e2804e2a890e1cf62f267b6f';

// Save API key to localStorage
function saveApiKey() {
    const apiKey = document.getElementById('apiKey').value.trim();
    if (apiKey) {
        localStorage.setItem('fishAudioApiKey', apiKey);
        alert('API key saved successfully!');
    } else {
        alert('Please enter a valid API key');
    }
}

// Load saved API key
function loadApiKey() {
    const savedKey = localStorage.getItem('fishAudioApiKey');
    if (savedKey) {
        document.getElementById('apiKey').value = savedKey;
    }
}

// Generate voice using Fish Audio API
async function generateVoice() {
    const apiKey = document.getElementById('apiKey').value.trim();
    const text = document.getElementById('textInput').value.trim();
    
    if (!apiKey) {
        alert('Please enter your Fish Audio API key first');
        return;
    }
    
    if (!text) {
        alert('Please enter some text to convert to speech');
        return;
    }
    
    const loadingIndicator = document.getElementById('loadingIndicator');
    const outputSection = document.getElementById('outputSection');
    const audioPlayer = document.getElementById('audioPlayer');
    const generateBtn = document.getElementById('generateBtn');
    
    // Show loading state
    loadingIndicator.style.display = 'block';
    outputSection.style.display = 'block';
    audioPlayer.style.display = 'none';
    generateBtn.disabled = true;
    generateBtn.textContent = 'Generating...';
    
    try {
        // Fish Audio API endpoint for text-to-speech
        const response = await fetch('https://api.fish.audio/v1/tts', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: text,
                voice_id: VERITY_VOICE_ID,
                // Optional parameters for better quality
                format: 'mp3',
                speed: 1.0,
                // You can adjust these parameters
                // pitch: 0,
                // volume: 1.0
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `API request failed with status ${response.status}`);
        }
        
        // Get the audio blob
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Set the audio source
        audioPlayer.src = audioUrl;
        audioPlayer.style.display = 'block';
        
        // Clean up old object URL when new one is loaded
        audioPlayer.onload = () => {
            // Optional: auto-play the audio
            // audioPlayer.play();
        };
        
    } catch (error) {
        console.error('Error generating voice:', error);
        alert(`Error generating voice: ${error.message}\n\nPlease check your API key and try again.`);
        outputSection.style.display = 'none';
    } finally {
        // Hide loading state
        loadingIndicator.style.display = 'none';
        generateBtn.disabled = false;
        generateBtn.textContent = '🎵 Generate Voice';
    }
}

// Load API key on page load
window.onload = function() {
    loadApiKey();
};

// Optional: Add keyboard shortcut to generate voice
document.getElementById('textInput').addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'Enter') {
        generateVoice();
    }
});
