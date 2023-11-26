document.addEventListener('DOMContentLoaded', function () {
  const sentences = [
    'DISCOVER,COLLECT AND SELL EXTRAODINARY NFTs WITH AWESOME',
    'DISCOVER,COLLECT AND SELL EXTRAODINARY NFTs WITH IE104',
  ]

  let currentIndex = 0
  let offset = 0
  const sentenceElement = document.querySelector('.sentence')
  let forwards = true
  let skipCount = 0
  const skipDelay = 15
  const speed = 70

  const updateSentence = () => {
    sentenceElement.textContent = sentences[currentIndex].substring(0, offset)
  }

  const handleAnimation = () => {
    if (forwards) {
      if (offset >= sentences[currentIndex].length) {
        if (++skipCount === skipDelay) {
          forwards = false
          skipCount = 0
        }
      }
    } else if (offset === 0) {
      forwards = true
      currentIndex = (currentIndex + 1) % sentences.length
    }

    if (skipCount === 0) {
      forwards ? offset++ : offset--
    }

    updateSentence()
  }

  setInterval(handleAnimation, speed)
})
