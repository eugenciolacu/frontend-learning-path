/* ─────────────────────────────────────────────────────────────────────────
 *  webrtc-demo.js
 *  Loopback WebRTC demo — both peers in the same tab.
 *  Chapter 9: Advanced Asynchronous Patterns
 * ───────────────────────────────────────────────────────────────────────── */

'use strict';

// ════════════════════════════════════════════════════════════════════════════
//  SECTION 1 — RTCDataChannel loopback chat
// ════════════════════════════════════════════════════════════════════════════

const ICE_CONFIG = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

let callerPC  = null; // RTCPeerConnection (Caller / Peer A)
let calleePC  = null; // RTCPeerConnection (Callee / Peer B)
let callerDC  = null; // RTCDataChannel on Caller
let calleeDC  = null; // RTCDataChannel on Callee

// ── DOM ───────────────────────────────────────────────────────────────────

const connectDataBtn    = document.getElementById('btn-data-connect');
const disconnectDataBtn = document.getElementById('btn-data-disconnect');
const callerStateEl     = document.getElementById('caller-state');
const calleeStateEl     = document.getElementById('callee-state');
const chatA             = document.getElementById('chat-a');
const chatB             = document.getElementById('chat-b');
const formA             = document.getElementById('form-a');
const formB             = document.getElementById('form-b');
const inputA            = document.getElementById('input-a');
const inputB            = document.getElementById('input-b');
const signalLog         = document.getElementById('signal-log');

// ── Helpers ───────────────────────────────────────────────────────────────

function signalAppend(msg, cls = 'log-info') {
  const d = document.createElement('div');
  d.textContent = msg;
  d.className = cls;
  signalLog.appendChild(d);
  signalLog.scrollTop = signalLog.scrollHeight;
}

function appendMessage(container, text, side) {
  const bubble = document.createElement('div');
  bubble.className = `bubble bubble-${side}`;
  bubble.textContent = text;
  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
}

function enableChat(callerReady, calleeReady) {
  inputA.disabled = !callerReady;
  inputB.disabled = !calleeReady;
  formA.querySelector('button').disabled = !callerReady;
  formB.querySelector('button').disabled = !calleeReady;
}

function setDataState(who, state) {
  const el = who === 'caller' ? callerStateEl : calleeStateEl;
  el.textContent = state;
  el.className = `peer-state state-${state.replace(/\s+/g, '-')}`;
}

// ── DataChannel loopback connection ───────────────────────────────────────

async function createDataConnection() {
  signalLog.innerHTML = '';
  connectDataBtn.disabled    = true;
  disconnectDataBtn.disabled = false;

  // Create both peer connections
  callerPC = new RTCPeerConnection(ICE_CONFIG);
  calleePC = new RTCPeerConnection(ICE_CONFIG);

  setDataState('caller', 'connecting');
  setDataState('callee', 'connecting');

  // ── ICE candidate exchange (simulated signalling) ──────────────────────
  callerPC.addEventListener('icecandidate', ({ candidate }) => {
    if (candidate) {
      signalAppend(`  [Caller → Callee] ICE candidate: ${candidate.type}`, 'log-info');
      calleePC.addIceCandidate(candidate);
    }
  });

  calleePC.addEventListener('icecandidate', ({ candidate }) => {
    if (candidate) {
      signalAppend(`  [Callee → Caller] ICE candidate: ${candidate.type}`, 'log-info');
      callerPC.addIceCandidate(candidate);
    }
  });

  // Connection state monitoring
  callerPC.addEventListener('connectionstatechange', () => {
    setDataState('caller', callerPC.connectionState);
    signalAppend(`  Caller state: ${callerPC.connectionState}`,
      callerPC.connectionState === 'connected' ? 'log-ok' : 'log-info');
  });

  calleePC.addEventListener('connectionstatechange', () => {
    setDataState('callee', calleePC.connectionState);
    signalAppend(`  Callee state: ${calleePC.connectionState}`,
      calleePC.connectionState === 'connected' ? 'log-ok' : 'log-info');
  });

  // ── Create data channel on the caller ─────────────────────────────────
  callerDC = callerPC.createDataChannel('chat', { ordered: true });
  signalAppend('[Caller] Created data channel "chat"', 'log-ok');

  callerDC.addEventListener('open', () => {
    signalAppend('[Caller] Data channel OPEN', 'log-ok');
    enableChat(true, false); // Callee channel not yet open
  });

  callerDC.addEventListener('message', event => {
    appendMessage(chatA, `← B: ${event.data}`, 'received');
  });

  callerDC.addEventListener('close', () => {
    signalAppend('[Caller] Data channel closed', 'log-warn');
    enableChat(false, false);
  });

  // ── Callee receives the channel ────────────────────────────────────────
  calleePC.addEventListener('datachannel', event => {
    calleeDC = event.channel;
    signalAppend('[Callee] Received data channel', 'log-ok');

    calleeDC.addEventListener('open', () => {
      signalAppend('[Callee] Data channel OPEN', 'log-ok');
      enableChat(callerDC.readyState === 'open', true);
    });

    calleeDC.addEventListener('message', event => {
      appendMessage(chatB, `← A: ${event.data}`, 'received');
    });
  });

  // ── Offer / Answer exchange ────────────────────────────────────────────
  signalAppend('[Caller] Creating offer…', 'log-info');
  const offer = await callerPC.createOffer();
  await callerPC.setLocalDescription(offer);
  signalAppend('[Caller → Callee] Offer SDP sent', 'log-ok');

  await calleePC.setRemoteDescription(offer);
  signalAppend('[Callee] Received offer, creating answer…', 'log-info');

  const answer = await calleePC.createAnswer();
  await calleePC.setLocalDescription(answer);
  signalAppend('[Callee → Caller] Answer SDP sent', 'log-ok');

  await callerPC.setRemoteDescription(answer);
  signalAppend('[Caller] Received answer — ICE negotiation starting…', 'log-info');
}

function closeDataConnection() {
  callerDC?.close();
  calleeDC?.close();
  callerPC?.close();
  calleePC?.close();
  callerPC = calleePC = callerDC = calleeDC = null;

  setDataState('caller', 'disconnected');
  setDataState('callee', 'disconnected');
  enableChat(false, false);
  connectDataBtn.disabled    = false;
  disconnectDataBtn.disabled = true;
  signalAppend('Connection closed', 'log-warn');
}

connectDataBtn.addEventListener('click', createDataConnection);
disconnectDataBtn.addEventListener('click', closeDataConnection);

formA.addEventListener('submit', e => {
  e.preventDefault();
  const text = inputA.value.trim();
  if (!text || callerDC?.readyState !== 'open') return;
  callerDC.send(text);
  appendMessage(chatA, `→ A: ${text}`, 'sent');
  inputA.value = '';
});

formB.addEventListener('submit', e => {
  e.preventDefault();
  const text = inputB.value.trim();
  if (!text || calleeDC?.readyState !== 'open') return;
  calleeDC.send(text);
  appendMessage(chatB, `→ B: ${text}`, 'sent');
  inputB.value = '';
});

// ════════════════════════════════════════════════════════════════════════════
//  SECTION 2 — Camera / getUserMedia + video loopback
// ════════════════════════════════════════════════════════════════════════════

const camStartBtn      = document.getElementById('btn-cam-start');
const camStopBtn       = document.getElementById('btn-cam-stop');
const loopbackStartBtn = document.getElementById('btn-loopback-start');
const loopbackStopBtn  = document.getElementById('btn-loopback-stop');
const audioChk         = document.getElementById('chk-audio');
const localVideo       = document.getElementById('local-video');
const remoteVideo      = document.getElementById('remote-video');
const mediaLog         = document.getElementById('media-log');

let localStream  = null;
let videoCallerPC = null;
let videoCalleePC = null;

function mediaAppend(msg, cls = 'log-info') {
  const d = document.createElement('div');
  d.textContent = msg;
  d.className = cls;
  mediaLog.appendChild(d);
  mediaLog.scrollTop = mediaLog.scrollHeight;
}

camStartBtn.addEventListener('click', async () => {
  try {
    mediaAppend('Requesting camera/mic access…');
    localStream = await navigator.mediaDevices.getUserMedia({
      video: { width: { ideal: 640 }, height: { ideal: 360 } },
      audio: audioChk.checked,
    });

    localVideo.srcObject = localStream;
    const tracks = localStream.getTracks().map(t => `${t.kind} (${t.label})`);
    mediaAppend(`✅ Got stream: ${tracks.join(', ')}`, 'log-ok');

    camStartBtn.disabled      = true;
    camStopBtn.disabled       = false;
    loopbackStartBtn.disabled = false;
  } catch (err) {
    mediaAppend(`❌ getUserMedia failed: ${err.message}`, 'log-err');
  }
});

camStopBtn.addEventListener('click', () => {
  stopVideoLoopback();
  localStream?.getTracks().forEach(t => t.stop());
  localStream = null;
  localVideo.srcObject  = null;
  remoteVideo.srcObject = null;
  camStartBtn.disabled      = false;
  camStopBtn.disabled       = true;
  loopbackStartBtn.disabled = true;
  mediaAppend('Camera stopped', 'log-warn');
});

loopbackStartBtn.addEventListener('click', async () => {
  if (!localStream) return;
  loopbackStartBtn.disabled = true;
  loopbackStopBtn.disabled  = false;

  videoCallerPC = new RTCPeerConnection(ICE_CONFIG);
  videoCalleePC = new RTCPeerConnection(ICE_CONFIG);

  // ICE candidate exchange
  videoCallerPC.addEventListener('icecandidate', ({ candidate }) => {
    if (candidate) videoCalleePC.addIceCandidate(candidate);
  });
  videoCalleePC.addEventListener('icecandidate', ({ candidate }) => {
    if (candidate) videoCallerPC.addIceCandidate(candidate);
  });

  // Display remote stream
  videoCalleePC.addEventListener('track', event => {
    if (!remoteVideo.srcObject) {
      remoteVideo.srcObject = event.streams[0];
      mediaAppend('✅ Remote video track received (loopback)', 'log-ok');
    }
  });

  // Add local tracks to caller
  localStream.getTracks().forEach(track => {
    videoCallerPC.addTrack(track, localStream);
    mediaAppend(`  Added ${track.kind} track to caller`, 'log-info');
  });

  // Offer / Answer
  const offer = await videoCallerPC.createOffer();
  await videoCallerPC.setLocalDescription(offer);
  await videoCalleePC.setRemoteDescription(offer);

  const answer = await videoCalleePC.createAnswer();
  await videoCalleePC.setLocalDescription(answer);
  await videoCallerPC.setRemoteDescription(answer);

  mediaAppend('Video loopback negotiation complete', 'log-ok');
});

loopbackStopBtn.addEventListener('click', stopVideoLoopback);

function stopVideoLoopback() {
  videoCallerPC?.close();
  videoCalleePC?.close();
  videoCallerPC = videoCalleePC = null;
  remoteVideo.srcObject   = null;
  loopbackStartBtn.disabled = localStream === null;
  loopbackStopBtn.disabled  = true;
  if (localStream) mediaAppend('Video loopback stopped', 'log-warn');
}
