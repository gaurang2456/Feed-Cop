document.addEventListener("DOMContentLoaded", function () {
    const browserAPI = typeof browser !== 'undefined' ? browser : chrome;
    
    // check the stored API key when popup opens
    browserAPI.storage.sync.get("groqApiKey", function (data) {
        const errorCard = document.querySelector(".error-card");

        if (data.groqApiKey) {
            errorCard.style.display = "none";
        }
    });

    // toggle swish for cringe guard
    const toggleSwitch = document.getElementById("toggle-switch");

    // Load initial state from browser storage
    browserAPI.storage.sync.get("isEnabled", function (data) {
        toggleSwitch.checked = data.isEnabled ?? false; // Default to false
        updateToggleStatus(data.isEnabled ?? false);
    });

    // Listen for toggle changes
    toggleSwitch.addEventListener("change", function () {
        const isEnabled = toggleSwitch.checked;
        browserAPI.storage.sync.set({ isEnabled: isEnabled });
        updateToggleStatus(isEnabled);
    });

    function updateToggleStatus(isEnabled) {
        const statusText = document.getElementById('status-text');
        const statusSubtitle = document.querySelector('.status-subtitle');
        const toggleSection = document.querySelector('.main-toggle-section');
        
        if (isEnabled) {
            statusText.textContent = 'Extension Active';
            statusSubtitle.textContent = 'Filtering cringe content on LinkedIn';
            statusText.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            toggleSection.classList.add('active');
        } else {
            statusText.textContent = 'Extension Disabled';
            statusSubtitle.textContent = 'Click to start filtering cringe content';
            statusText.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
            toggleSection.classList.remove('active');
        }
        statusText.style.webkitBackgroundClip = 'text';
        statusText.style.webkitTextFillColor = 'transparent';
        statusText.style.backgroundClip = 'text';
    }

    browserAPI.storage.sync.get(["cringeCount", "timeSavedInMinutes"], function (data) {
        document.getElementById("cringe-count").innerText = data.cringeCount || 0;
        document.getElementById("time-saved").innerText = Math.ceil(data.timeSavedInMinutes || 0) + "m";
    });

    // Load filter mode setting
    browserAPI.storage.sync.get("filterMode", function (data) {
        const filterMode = data.filterMode || "blur"; // Default to blur if not set
        const toggleSlider = document.querySelector('.toggle-slider');

        if (filterMode === "remove") {
            toggleSlider.classList.add('remove');
            toggleSlider.classList.remove('blur');
            // TODO - description should be changed only from 1 place
            document.getElementById('mode-description').textContent =
                "Vanish cringe completely";
        } else {
            toggleSlider.classList.add('blur');
            toggleSlider.classList.remove('remove');
            document.getElementById('mode-description').textContent =
                "Blurs cringe until you decide";
        }
    });

    // Listen for filter mode changes
    const toggleSlider = document.querySelector('.toggle-slider');
    toggleSlider.addEventListener('click', function () {
        const currentMode = this.classList.contains('blur') ? 'blur' : 'remove';
        const newMode = currentMode === 'blur' ? 'remove' : 'blur';

        this.classList.remove(currentMode);
        this.classList.add(newMode);

        // Update description
        if (newMode === 'remove') {
            document.getElementById('mode-description').textContent =
                "Vanish cringe completely";
        } else {
            document.getElementById('mode-description').textContent =
                "Blurs cringe until you decide";
        }

        browserAPI.storage.sync.set({ filterMode: newMode });
        console.log(`Filter mode changed to: ${newMode}`);
    });

    // take user to the settings page
    const settingsButton = document.querySelector('.settings-icon');
    settingsButton.addEventListener('click', () => {
        browserAPI.runtime.openOptionsPage();
    });

    // Mute words functionality
    let mutedWords = [];

    function loadMutedWords() {
        browserAPI.storage.sync.get(['mutedWords'], (data) => {
            mutedWords = data.mutedWords || [];
            updateMutedWordsDisplay();
        });
    }

    function saveMutedWords() {
        browserAPI.storage.sync.set({ mutedWords: mutedWords });
    }

    function updateMutedWordsDisplay() {
        const container = document.getElementById('muted-words-list');
        const emptyState = document.getElementById('empty-state');
        const clearAllBtn = document.getElementById('clear-all-btn');
        const muteCount = document.getElementById('mute-count');

        muteCount.textContent = `${mutedWords.length} word${mutedWords.length !== 1 ? 's' : ''}`;

        if (mutedWords.length === 0) {
            container.style.display = 'none';
            emptyState.style.display = 'block';
            clearAllBtn.style.display = 'none';
        } else {
            container.style.display = 'flex';
            emptyState.style.display = 'none';
            clearAllBtn.style.display = 'block';

            container.textContent = '';
            mutedWords.forEach((word, index) => {
                const wordTag = document.createElement('div');
                wordTag.className = 'muted-word-tag';
                
                const wordSpan = document.createElement('span');
                wordSpan.textContent = word;
                
                const removeBtn = document.createElement('button');
                removeBtn.className = 'remove-word-btn';
                
                const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svg.setAttribute('width', '10');
                svg.setAttribute('height', '10');
                svg.setAttribute('viewBox', '0 0 24 24');
                svg.setAttribute('fill', 'none');
                svg.setAttribute('stroke', 'currentColor');
                svg.setAttribute('stroke-width', '2');
                
                const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line1.setAttribute('x1', '18');
                line1.setAttribute('y1', '6');
                line1.setAttribute('x2', '6');
                line1.setAttribute('y2', '18');
                
                const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line2.setAttribute('x1', '6');
                line2.setAttribute('y1', '6');
                line2.setAttribute('x2', '18');
                line2.setAttribute('y2', '18');
                
                svg.appendChild(line1);
                svg.appendChild(line2);
                removeBtn.appendChild(svg);
                
                wordTag.appendChild(wordSpan);
                wordTag.appendChild(removeBtn);
                removeBtn.addEventListener('click', () => removeMutedWord(index));

                container.appendChild(wordTag);
            });
        }
    }

    function addMutedWord() {
        const input = document.getElementById('mute-input');
        const word = input.value.trim().toLowerCase();

        if (word && !mutedWords.includes(word) && mutedWords.length < 20) {
            mutedWords.push(word);
            saveMutedWords();
            updateMutedWordsDisplay();
            input.value = '';
            updateAddButtonState();
        }
    }

    function removeMutedWord(index) {
        console.log(`Removing muted word at index ${index}`);
        mutedWords.splice(index, 1);
        saveMutedWords();
        updateMutedWordsDisplay();
        updateAddButtonState();
    }

    function clearAllMutedWords() {
        mutedWords = [];
        saveMutedWords();
        updateMutedWordsDisplay();
        updateAddButtonState();
    }

    function updateAddButtonState() {
        const input = document.getElementById('mute-input');
        const addBtn = document.getElementById('add-word-btn');
        const word = input.value.trim().toLowerCase();

        const isValid = word && !mutedWords.includes(word) && mutedWords.length < 20;
        addBtn.disabled = !isValid;
    }

    // Event listeners
    document.getElementById('add-word-btn').addEventListener('click', addMutedWord);
    document.getElementById('clear-all-btn').addEventListener('click', clearAllMutedWords);

    const muteInput = document.getElementById('mute-input');
    muteInput.addEventListener('input', updateAddButtonState);
    muteInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addMutedWord();
        }
    });

    // Initialize
    loadMutedWords();
    updateAddButtonState();
});