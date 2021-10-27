import App from './demo-1.js';
import "../css/lookbook_base.css";
import "../css/lookbook.css";



new App()

document.documentElement.classList.remove('no-js')
document.documentElement.classList.add('js')

const images = document.querySelectorAll('img:not([src*="https://tympanus.net/codrops/wp-content/banners/"])')
let imagesIndex = 0

Array.from(images).forEach(element => {
  const image = new Image()

  image.src = element.src
  image.onload = _ => {
    imagesIndex += 1

    if (imagesIndex === images.length) {
      document.documentElement.classList.remove('loading')
      document.documentElement.classList.add('loaded')
    }
  }
})
