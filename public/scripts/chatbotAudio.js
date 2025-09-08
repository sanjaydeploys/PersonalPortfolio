(function() {
let voices = [];
let speechStates = new Map();
let volume = parseFloat(localStorage.getItem('speech-volume') || 1);
let rate = parseFloat(localStorage.getItem('speech-rate') || 1);
let speechQueue = [];
function loadVoices() {
return new Promise((resolve) => {
voices = window.speechSynthesis.getVoices();
if (voices.length > 0) {
resolve(voices);
return;
}
window.speechSynthesis.onvoiceschanged = function() {
voices = window.speechSynthesis.getVoices();
        console.log('Voices loaded:', voices.map(v => `${v.name} (${v.lang})`));
resolve(voices);
};
// No timeout; rely on onvoiceschanged event
});
}
function cleanText(text) {
// Strip bold and italic markdown, keeping content
text = text.replace(/(**|__|*|_)/g, '');
// Remove headers #
text = text.replace(/^#+ /gm, '');
// Remove bullets - *
text = text.replace(/^\s*[-*] /gm, '');
// Remove code blocks and inline code
text = text.replace(/+[^]+`+/g, '');
// Remove links, keep text
text = text.replace(/(.*?) $$$$ .*?/g, '$1');
// Remove emojis
text = text.replace(/[\u{1F000}-\u{1FFFF}]/gu, '');
// Remove specific specials ^ / :
text = text.replace(/[^\/:]/g, '');
// Normalize spaces
text = text.replace(/\s+/g, ' ').trim();
return text;
}
// Robust chunking for long messages
function chunkText(text, maxLength = 500) {
if (!text || text.trim() === '') return [text];
const chunks = [];
let currentChunk = '';
const paragraphs = text.split('\n').filter(p => p.trim());
for (const paragraph of paragraphs) {
const words = paragraph.split(/\s+/);
for (const word of words) {
if ((currentChunk + ' ' + word).length > maxLength) {
if (currentChunk) chunks.push(currentChunk.trim());
currentChunk = word;
} else {
currentChunk += (currentChunk ? ' ' : '') + word;
}
}
if (currentChunk) {
chunks.push(currentChunk.trim());
currentChunk = '';
}
}
if (currentChunk) chunks.push(currentChunk.trim());
return chunks.length > 0 ? chunks : [text];
}
async function speakMessage(messageId, text, lang) {
if (!window.speechSynthesis) {
console.warn('Speech synthesis not supported in this browser.');
if (window.messages) {
window.messages.push({
sender: 'ai',
text: lang === 'hi' ? 'इस ब्राउज़र में स्पीच सिंथेसिस समर्थित नहीं है।' : 'Speech synthesis is not supported in this browser.',
id: Date.now(),
timestamp: new Date().toISOString(),
category: 'general',
reactions: [],
isPinned: false
});
window.renderMessages?.();
}
return;
}
if (!text || text.trim() === '') {
console.warn('No valid text to speak.');
return;
}
text = cleanText(text);
if (speechStates.size > 0 && !speechStates.has(messageId)) {
speechQueue.push({ messageId, text, lang });
return;
}
window.interactionAnalytics = window.interactionAnalytics || { questionsAsked: 0, speechUsed: 0, categories: {}, reactionsUsed: 0 };
window.interactionAnalytics.speechUsed++;
const synth = window.speechSynthesis;
let state = speechStates.get(messageId) || { isSpeaking: false, isPaused: false, utterance: null, chunks: [], currentChunk: 0 };
if (state.isSpeaking && !state.isPaused) {
synth.pause();
state.isPaused = true;
state.isSpeaking = false;
speechStates.set(messageId, state);
updateSpeakButton(messageId, false);
const message = window.messages.find(m => m.id === messageId);
if (message) {
message.isSpeaking = false;
window.renderMessages?.();
}
return;
} else if (state.isPaused) {
synth.resume();
state.isPaused = false;
state.isSpeaking = true;
speechStates.set(messageId, state);
updateSpeakButton(messageId, true);
const message = window.messages.find(m => m.id === messageId);
if (message) {
message.isSpeaking = true;
window.renderMessages?.();
}
return;
}
state.chunks = chunkText(text);
state.currentChunk = 0;
speechStates.set(messageId, state);
async function speakNextChunk() {
if (state.currentChunk >= state.chunks.length || !speechStates.has(messageId)) {
speechStates.delete(messageId);
updateSpeakButton(messageId, false);
const message = window.messages.find(m => m.id === messageId);
if (message) {
message.isSpeaking = false;
window.renderMessages?.();
}
if (speechQueue.length > 0) {
const next = speechQueue.shift();
speakMessage(next.messageId, next.text, next.lang);
}
return;
}
const utterance = new SpeechSynthesisUtterance();
utterance.volume = volume;
utterance.rate = lang === 'hi' ? rate * 0.9 : rate; // Slower rate for Hindi clarity
utterance.pitch = 1;
utterance.text = state.chunks[state.currentChunk].trim() || 'No text available.';
utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
try {
voices = await loadVoices();
let voice;
if (lang === 'hi') {
voice = voices.find(v => v.lang === 'hi-IN' && v.name.includes('Google')) ||
voices.find(v => v.lang === 'hi-IN') ||
voices.find(v => v.lang === 'hi') ||
voices.find(v => v.lang.includes('en')); // Fallback to English
if (!voice) {
console.warn('No Hindi voice available, falling back to default.');
window.messages.push({
sender: 'ai',
text: 'कोई हिंदी आवाज़ उपलब्ध नहीं है। कृपया अपने डिवाइस पर Google Text-to-Speech स्थापित करें या अंग्रेजी में सुनने के लिए भाषा बदलें।',
id: Date.now(),
timestamp: new Date().toISOString(),
category: 'general',
reactions: [],
isPinned: false
});
window.renderMessages?.();
speechStates.delete(messageId);
updateSpeakButton(messageId, false);
if (speechQueue.length > 0) {
const next = speechQueue.shift();
speakMessage(next.messageId, next.text, next.lang);
}
return;
}
} else {
voice = voices.find(v => v.lang === 'en-US' && v.name.includes('Google')) ||
voices.find(v => v.lang === 'en-US') ||
voices.find(v => v.lang.includes('en'));
}
if (voice) {
utterance.voice = voice;
state.utterance = utterance;
state.isSpeaking = true;
state.isPaused = false;
speechStates.set(messageId, state);
utterance.onend = function() {
if (speechStates.has(messageId)) {
state.currentChunk++;
speechStates.set(messageId, state);
speakNextChunk();
}
};
utterance.onerror = function(event) {
console.warn('Speech synthesis error: ' + event.error);
if (window.messages) {
window.messages.push({
sender: 'ai',
text: lang === 'hi' ? 'स्पीच सिंथेसिस में त्रुटि: ' + event.error + '. कृपया स्पीच रेट समायोजित करें या Google Text-to-Speech स्थापित करें।' : 'Speech synthesis failed: ' + event.error + '. Try adjusting the speech rate or installing Google Text-to-Speech.',
id: Date.now(),
timestamp: new Date().toISOString(),
category: 'general',
reactions: [],
isPinned: false
});
window.renderMessages?.();
}
if (speechStates.has(messageId)) {
state.currentChunk++; // Retry next chunk
speechStates.set(messageId, state);
speakNextChunk(); // Continue instead of stopping
}
};
synth.speak(utterance);
updateSpeakButton(messageId, true);
const message = window.messages.find(m => m.id === messageId);
if (message) {
message.isSpeaking = true;
window.renderMessages?.();
}
} else {
console.warn('Voice for ' + utterance.lang + ' or fallback not available.');
if (window.messages) {
window.messages.push({
sender: 'ai',
text: lang === 'hi' ? 'उपयुक्त आवाज़ ' + utterance.lang + ' के लिए उपलब्ध नहीं है। कृपया Google Text-to-Speech स्थापित करें या अपने सिस्टम की भाषा सेटिंग्स जांचें।' : 'No suitable voice available for ' + utterance.lang + '. Please install Google Text-to-Speech or check your system’s language settings.',
id: Date.now(),
timestamp: new Date().toISOString(),
category: 'general',
reactions: [],
isPinned: false
});
window.renderMessages?.();
}
speechStates.delete(messageId);
updateSpeakButton(messageId, false);
if (speechQueue.length > 0) {
const next = speechQueue.shift();
speakMessage(next.messageId, next.text, next.lang);
}
}
} catch (error) {
console.warn('Failed to load voices: ' + error.message);
if (window.messages) {
window.messages.push({
sender: 'ai',
text: lang === 'hi' ? 'आवाज़ लोड करने में विफल: ' + error.message + '. कृपया Google Text-to-Speech स्थापित करें।' : 'Failed to load voices: ' + error.message + '. Please install Google Text-to-Speech.',
id: Date.now(),
timestamp: new Date().toISOString(),
category: 'general',
reactions: [],
isPinned: false
});
window.renderMessages?.();
}
speechStates.delete(messageId);
updateSpeakButton(messageId, false);
if (speechQueue.length > 0) {
const next = speechQueue.shift();
speakMessage(next.messageId, next.text, next.lang);
}
}
}
if (speechStates.has(messageId) && !state.isSpeaking) {
synth.cancel();
}
speakNextChunk();
}
function stopAllSpeech() {
window.speechSynthesis.cancel();
speechStates.forEach((_, messageId) => {
updateSpeakButton(messageId, false);
const message = window.messages.find(m => m.id === messageId);
if (message) {
message.isSpeaking = false;
}
speechStates.delete(messageId);
});
speechQueue = [];
window.renderMessages?.();
}
function updateSpeakButton(messageId, isSpeaking) {
const messageDiv = document.querySelector(`[data-message-id="${messageId}"]`);
if (messageDiv) {
const speakBtn = messageDiv.querySelector('.speak-btn');
if (speakBtn) {
speakBtn.innerHTML = isSpeaking
? <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6"></path></svg>
: <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-6.504-3.753v7.506l6.504-3.753zM5 3v18l14-9L5 3z"></path></svg>;
speakBtn.setAttribute('aria-label', isSpeaking ? 'Pause message' : 'Play message');
}
const message = window.messages.find(m => m.id === messageId);
if (message) {
message.isSpeaking = isSpeaking;
}
}
}
function setSpeechVolume(value) {
volume = parseFloat(value);
localStorage.setItem('speech-volume', volume);
if (speechStates.size > 0) {
stopAllSpeech();
}
}
function setSpeechRate(value) {
rate = parseFloat(value);
localStorage.setItem('speech-rate', rate);
if (speechStates.size > 0) {
stopAllSpeech();
}
}
function getSpeechVolume() {
return volume;
}
function getSpeechRate() {
return rate;
}
document.addEventListener('DOMContentLoaded', function() {
const volumeControl = document.getElementById('volume-control');
if (volumeControl) volumeControl.addEventListener('input', function() {
setSpeechVolume(this.value);
});
const rateControl = document.getElementById('rate-control');
if (rateControl) rateControl.addEventListener('input', function() {
setSpeechRate(this.value);
});
loadVoices();
});
window.speakMessage = speakMessage;
window.toggleSpeak = speakMessage;
window.stopAllSpeech = stopAllSpeech;
window.setSpeechVolume = setSpeechVolume;
window.setSpeechRate = setSpeechRate;
window.getSpeechVolume = getSpeechVolume;
window.getSpeechRate = getSpeechRate;
})();
