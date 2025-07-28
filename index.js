const qrcodeEle = document.getElementById('qrcode')
const inputEle = document.getElementById('input')

const qrcode = new QRCode(qrcodeEle, {
  text: '',
  width: 300,
  height: 300,
  colorDark: '#000000',
  colorLight: '#ffffff',
  correctLevel: QRCode.CorrectLevel.H,
})

// get imageEle after new QRCode() !
const imageEle = qrcodeEle.querySelector('img')

// decode handle: image processing and decoding
function processImage(file) {
  const reader = new FileReader()
  reader.onload = e => {
    const image = new Image()
    image.src = e.target.result
    image.onload = () => {
      const qrcodeDecoder = new QrcodeDecoder()
      qrcodeDecoder
        .decodeFromImage(image)
        .then(res => {
          if (res.data === undefined) inputEle.value = 'no qrcode detected!'
          else inputEle.value = res.data
        })
        .catch(err => {
          console.log('Failed to decode QR code:', err)
        })
      imageEle.src = e.target.result
    }
  }
  reader.readAsDataURL(file)
}

// decode handle: click to upload
qrcodeEle.addEventListener('click', () => {
  const file = document.createElement('input')
  file.type = 'file'
  file.accept = 'image/*'
  file.onchange = e => {
    const file = e.target.files[0]
    processImage(file)
  }
  file.click()
})

// decode handle: drag and drop
qrcodeEle.addEventListener('dragover', e => {
  e.preventDefault()
  e.stopPropagation()
  qrcodeEle.classList.add('drag-over')
})
qrcodeEle.addEventListener('dragleave', e => {
  e.preventDefault()
  e.stopPropagation()
  qrcodeEle.classList.remove('drag-over')
})
qrcodeEle.addEventListener('drop', e => {
  e.preventDefault()
  e.stopPropagation()
  qrcodeEle.classList.remove('drag-over')
  const files = e.dataTransfer.files
  if (files.length > 0) {
    const file = files[0]
    if (file.type.startsWith('image/')) {
      processImage(file)
    } else {
      console.log('Please drop an image file')
    }
  }
})

// decode handle: paste
document.addEventListener('paste', e => {
  const items = e.clipboardData.items
  for (let i = 0; i < items.length; i++) {
    if (items[i].type.indexOf('image') !== -1) {
      const blob = items[i].getAsFile()
      const reader = new FileReader()
      reader.onload = e => {
        const image = new Image()
        image.src = e.target.result
        image.onload = () => {
          imageEle.src = e.target.result
          const qrcodeDecoder = new QrcodeDecoder()
          qrcodeDecoder
            .decodeFromImage(image)
            .then(res => {
              if (res.data === undefined) inputEle.value = 'no qrcode detected!'
              else inputEle.value = res.data
            })
            .catch(err => {
              console.log('Failed to decode QR code:', err)
            })
        }
      }
      reader.readAsDataURL(blob)
      break
    }
  }
})

// encode handle: type in words
inputEle.addEventListener('input', () => {
  const input = inputEle.value
  qrcode.makeCode(input)
})
