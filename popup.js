// popup.js

const enabledEl = document.getElementById('enabled')
const messageEl = document.getElementById('message')
const saveBtn = document.getElementById('save')
const statusEl = document.getElementById('status')
const charCountEl = document.getElementById('charCount')
const presetChips = document.querySelectorAll('.preset-chip')

// Default message
const DEFAULT_MESSAGE = 'm'

// Update character count
function updateCharCount() {
  charCountEl.textContent = messageEl.value.length
}

// Show status message
function showStatus(message, isError = false) {
  statusEl.textContent = message
  statusEl.style.color = isError ? '#f44336' : '#4CAF50'
  statusEl.classList.add('show')
  setTimeout(() => {
    statusEl.classList.remove('show')
  }, 2000)
}

// Load stored settings
chrome.storage.sync.get(['enabled', 'message'], (items) => {
  enabledEl.checked = items.enabled !== undefined ? items.enabled : true
  messageEl.value = items.message || DEFAULT_MESSAGE
  updateCharCount()
})

// Update char count on input
messageEl.addEventListener('input', updateCharCount)

// Preset chip click handlers
presetChips.forEach((chip) => {
  chip.addEventListener('click', () => {
    const presetMessage = chip.getAttribute('data-message')
    messageEl.value = presetMessage
    updateCharCount()

    // Visual feedback - briefly highlight the chip
    chip.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    chip.style.color = '#fff'
    setTimeout(() => {
      chip.style.background = ''
      chip.style.color = ''
    }, 200)
  })
})

// Save settings
saveBtn.addEventListener('click', () => {
  const enabled = enabledEl.checked
  const message = messageEl.value.trim() || DEFAULT_MESSAGE

  // Update the textarea if it was empty
  if (!messageEl.value.trim()) {
    messageEl.value = DEFAULT_MESSAGE
    updateCharCount()
  }

  chrome.storage.sync.set({ enabled, message }, () => {
    showStatus('✓ Settings saved successfully!')
  })
})
