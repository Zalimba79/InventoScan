// Synthetischer Kamera-Shutter-Sound mit Web Audio API
let audioContext: AudioContext | null = null;

// Initialize audio context on first user interaction
export const initAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    // Resume context if suspended (iOS requirement)
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
  }
  return audioContext;
};

export const playCameraSound = () => {
  try {
    // Get or create audio context
    const ctx = audioContext || initAudioContext();
    
    if (!ctx) return;
    
    // Resume if needed
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    
    const currentTime = ctx.currentTime;
    
    // Create oscillator for the click sound
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    // Configure the sound - louder and more distinctive
    oscillator.frequency.value = 1500; // Start frequency
    oscillator.type = 'square'; // More clicky sound
    
    // Quick frequency sweep for shutter effect
    oscillator.frequency.exponentialRampToValueAtTime(800, currentTime + 0.01);
    oscillator.frequency.exponentialRampToValueAtTime(400, currentTime + 0.02);
    oscillator.frequency.exponentialRampToValueAtTime(200, currentTime + 0.03);
    
    // Volume envelope for click - louder
    gainNode.gain.setValueAtTime(0.5, currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.1);
    
    // Play the sound
    oscillator.start(currentTime);
    oscillator.stop(currentTime + 0.1);
    
    // Add a second click for mechanical shutter effect
    setTimeout(() => {
      const oscillator2 = audioContext.createOscillator();
      const gainNode2 = audioContext.createGain();
      
      oscillator2.connect(gainNode2);
      gainNode2.connect(audioContext.destination);
      
      oscillator2.frequency.value = 800;
      oscillator2.type = 'square';
      oscillator2.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.01);
      
      gainNode2.gain.value = 0.15;
      gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.03);
      
      oscillator2.start(audioContext.currentTime);
      oscillator2.stop(audioContext.currentTime + 0.03);
    }, 30);
    
  } catch (error) {
    console.log('Could not play camera sound:', error);
  }
};