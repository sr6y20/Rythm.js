import Global from './config/global'

class Analyser {
  constructor() {
    this.startingScale = 0
    this.pulseRatio = 1
    this.maxValueHistory = 100
    this.hzHistory = []
  }

  initialise = analyser => {
    this.analyser = analyser
    this.analyser.fftSize = Global.fftSize
  }

  reset = () => {
    this.hzHistory = []
    this.frequences = new Uint8Array(this.analyser.frequencyBinCount)
  }

  analyse = () => {
    this.analyser.getByteFrequencyData(this.frequences)
    for (let i = 0; i < this.frequences.length; i++) {
      if (!this.hzHistory[i]) {
        this.hzHistory[i] = []
      }
      if (this.hzHistory[i].length > this.maxValueHistory) {
        this.hzHistory[i].shift()
      }
      this.hzHistory[i].push(this.frequences[i])
    }

    const myCanvas = Global.myCanvas
    if (myCanvas) {
      const canvasCtx = myCanvas.getContext('2d')
      const cW = myCanvas.width
      const cH = myCanvas.height

      const basicWidth = (Math.round(cW / this.analyser.fftSize * 10) + 1) / 10
      const basicHeight = 1

      const color1 = canvasCtx.createLinearGradient(
        cW / 2,
        cH / 2 - 10,
        cW / 2,
        cH / 2 - 150
      )
      const topColor = Global.topColor.split(',')
      color1.addColorStop(0, topColor[0])
      color1.addColorStop(1, topColor[1])

      const color2 = canvasCtx.createLinearGradient(
        cW / 2,
        cH / 2 + 10,
        cW / 2,
        cH / 2 + 150
      )
      const bottomColor = Global.bottomColor.split(',')
      color2.addColorStop(0, bottomColor[0])
      color2.addColorStop(1, bottomColor[1])

      canvasCtx.clearRect(0, 0, cW, cH)

      for (let i = 0; i < this.frequences.length; i++) {
        const barHeight = this.frequences[i]

        canvasCtx.fillStyle = color1
        canvasCtx.fillRect(
          cW / 2 + i * basicWidth,
          cH / 2,
          basicWidth,
          -barHeight * basicHeight * 1.1
        )
        canvasCtx.fillRect(
          cW / 2 - i * basicWidth,
          cH / 2,
          basicWidth,
          -barHeight * basicHeight * 1.1
        )

        canvasCtx.fillStyle = color2
        canvasCtx.fillRect(
          cW / 2 + i * basicWidth,
          cH / 2,
          basicWidth,
          barHeight * basicHeight * 0.8
        )
        canvasCtx.fillRect(
          cW / 2 - i * basicWidth,
          cH / 2,
          basicWidth,
          barHeight * basicHeight * 0.8
        )
      }
    }
  }

  getRangeAverageRatio = (startingValue, nbValue) => {
    let total = 0
    for (let i = startingValue; i < nbValue + startingValue; i++) {
      total += this.getFrequenceRatio(i)
    }
    return total / nbValue
  }

  getFrequenceRatio = index => {
    let min = 255
    let max = 0
    this.hzHistory[index].forEach(value => {
      if (value < min) {
        min = value
      }
      if (value > max) {
        max = value
      }
    })
    const scale = max - min
    const actualValue = this.frequences[index] - min
    const percentage = scale === 0 ? 0 : actualValue / scale
    return this.startingScale + this.pulseRatio * percentage
  }
}

export default new Analyser()
