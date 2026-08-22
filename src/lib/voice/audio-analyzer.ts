export class AudioAnalyzer {
  private audioContext?: AudioContext;
  private analyser?: AnalyserNode;
  private stream?: MediaStream;
  private dataArray?: Uint8Array;
  private animationFrame?: number;
  private onLevel?: (level: number) => void;

  async start(onLevel: (level: number) => void) {
    this.onLevel = onLevel;

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioContext = new AudioContext();
      const source = this.audioContext.createMediaStreamSource(this.stream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      source.connect(this.analyser);

      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
      this.tick();
    } catch (e) {
      console.error("Audio analyzer failed:", e);
    }
  }

  private tick = () => {
    if (!this.analyser || !this.dataArray) return;

    this.analyser.getByteFrequencyData(this.dataArray as any);
    const avg = this.dataArray.reduce((sum, v) => sum + v, 0) / this.dataArray.length;
    const normalized = Math.min(avg / 128, 1); // 0-1

    this.onLevel?.(normalized);
    this.animationFrame = requestAnimationFrame(this.tick);
  };

  stop() {
    if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
    this.stream?.getTracks().forEach(t => t.stop());
    this.audioContext?.close();
  }
}
