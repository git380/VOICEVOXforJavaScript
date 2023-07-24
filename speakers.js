fetch('https://static.tts.quest/voicevox_speakers.json')
    .then(response => response.json())
    .then(speakers => {
        const selectElement = document.getElementById('speakerSelect');
        speakers.forEach(speaker => {
            const option = document.createElement('option');
            option.value = speaker;
            option.text = speaker;
            selectElement.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Error fetching speakers:', error);
    });