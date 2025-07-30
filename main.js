// Plus menu logic
const plusBtn = document.querySelector('.glass-plus-btn');
const plusMenu = document.getElementById('plus-menu');
const plusMenuBg = plusMenu ? plusMenu.querySelector('.plus-menu-bg') : null;
const plusCancel = document.getElementById('plus-cancel');
if (plusBtn && plusMenu) {
  plusBtn.addEventListener('click', () => {
    const sheet = plusMenu.querySelector('.plus-menu-sheet');
    if (sheet) sheet.classList.remove('closing');
    plusMenu.classList.add('active');
  });
}
if (plusMenuBg) {
  plusMenuBg.addEventListener('click', () => {
    closePlusMenuWithAnim();
  });
}
if (plusCancel) {
  plusCancel.addEventListener('click', () => {
    closePlusMenuWithAnim();
  });
}

function closePlusMenuWithAnim() {
  const sheet = plusMenu.querySelector('.plus-menu-sheet');
  if (sheet) {
    sheet.classList.add('closing');
    setTimeout(() => {
      plusMenu.classList.remove('active');
      sheet.classList.remove('closing');
    }, 180); // matchar CSS duration
  } else {
    plusMenu.classList.remove('active');
  }
}
const bgBrightnessSlider = document.getElementById('bg-brightness-slider');
const bgBrightnessValue = document.getElementById('bg-brightness-value');
const bgBlurSlider = document.getElementById('bg-blur-slider');
const bgBlurValue = document.getElementById('bg-blur-value');
const bgFadeOverlay = document.getElementById('bg-fade-overlay');
const bgRemoveBtn = document.getElementById('bg-remove-btn');
// Background upload button logic
const bgUploadBtn = document.getElementById('bg-upload-btn');
const bgUploadInput = document.getElementById('bg-upload-input');
const bgPreview = document.getElementById('bg-preview');

if (bgUploadBtn && bgUploadInput && bgPreview) {
  bgUploadBtn.addEventListener('click', () => {
    bgUploadInput.click();
  });
  bgUploadInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files.length > 0) {
      Array.from(e.target.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function(ev) {
          const imgEl = new window.Image();
          imgEl.onload = function() {
            // Skala ner till 180x120px för preview, men spara originalet för bakgrund
            const canvas = document.createElement('canvas');
            canvas.width = 180;
            canvas.height = 120;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, 180, 120);
            // Beräkna rätt storlek och position för att behålla proportioner
            let ratio = Math.min(180 / imgEl.width, 120 / imgEl.height);
            let newW = imgEl.width * ratio;
            let newH = imgEl.height * ratio;
            let offsetX = (180 - newW) / 2;
            let offsetY = (120 - newH) / 2;
            ctx.drawImage(imgEl, offsetX, offsetY, newW, newH);
            // Preview som PNG
            const dataUrl = canvas.toDataURL('image/png');
            const img = document.createElement('img');
            img.src = dataUrl;
            img.alt = 'Preview';
            img.className = 'bg-preview-img';
            img.setAttribute('data-fullsrc', ev.target.result); // Spara originalet
            bgPreview.appendChild(img);
            // Ingen click/hover event här, vi använder event delegation nedan
          };
          imgEl.src = ev.target.result;
        };
        reader.readAsDataURL(file);
      });
    }
  });
}

// Event delegation för hover och click på preview-bilder
if (bgPreview) {
  // Hover: lägg till/tar bort en klass för att trigga CSS :hover även på mobila enheter om så önskas
  bgPreview.addEventListener('mouseover', function(e) {
    if (e.target.classList.contains('bg-preview-img')) {
      e.target.classList.add('hover');
    }
  });
  bgPreview.addEventListener('mouseout', function(e) {
    if (e.target.classList.contains('bg-preview-img')) {
      e.target.classList.remove('hover');
    }
  });
  // Click: markera vald bild och byt bakgrund
  bgPreview.addEventListener('click', function(e) {
    if (e.target.classList.contains('bg-preview-img')) {
      Array.from(bgPreview.querySelectorAll('.bg-preview-img')).forEach(el => el.classList.remove('selected'));
      e.target.classList.add('selected');
      const fullSrc = e.target.getAttribute('data-fullsrc') || e.target.src;
      const fade = document.getElementById('bg-fade-overlay');
      if (fade) {
        fade.classList.add('active');
        setTimeout(() => {
          setBackgroundWithBlur(fullSrc);
          setTimeout(() => {
            fade.classList.remove('active');
          }, 500);
        }, 10);
      } else {
        setBackgroundWithBlur(fullSrc);
      }
    }
  });
}
if (bgRemoveBtn && bgPreview) {
  bgRemoveBtn.addEventListener('click', () => {
    bgPreview.innerHTML = '';
    bgUploadInput.value = '';
  });
}
// Settings drawer open/close with slide animation and click-outside to close
const openBtn = document.getElementById('open-settings');
const drawer = document.getElementById('settings-drawer');
const images = [
  'background_images/wallpapper03.png',
  'background_images/wallpapper_02.png',
  'background_images/wallpapper_01.jpg'
];
function setRandomBackground() {
  const randomImage = images[Math.floor(Math.random() * images.length)];
  setBackgroundWithBlur(randomImage);
}

function setBackgroundWithBlur(src) {
  if (!bgFadeOverlay) return;
  bgFadeOverlay.style.backgroundImage = `url('${src}')`;
  bgFadeOverlay.style.backgroundSize = 'cover';
  bgFadeOverlay.style.backgroundPosition = 'center';
  bgFadeOverlay.style.backgroundRepeat = 'no-repeat';
  const blur = bgBlurSlider ? bgBlurSlider.value : 8;
  const brightness = bgBrightnessSlider ? bgBrightnessSlider.value : 100;
  bgFadeOverlay.style.filter = `blur(${blur}px) brightness(${brightness/100})`;
  // Spara till localStorage
  localStorage.setItem('docktab_bg', src);
  localStorage.setItem('docktab_blur', blur);
  localStorage.setItem('docktab_brightness', brightness);
}
// Ladda från localStorage om det finns, annars random
const savedBg = localStorage.getItem('docktab_bg');
const savedBlur = localStorage.getItem('docktab_blur');
const savedBrightness = localStorage.getItem('docktab_brightness');
if (savedBg) {
  if (bgBlurSlider && savedBlur) bgBlurSlider.value = savedBlur;
  if (bgBrightnessSlider && savedBrightness) bgBrightnessSlider.value = savedBrightness;
  setBackgroundWithBlur(savedBg);
  updateBgOverlayFilter();
} else {
  setRandomBackground();
}
// Blur & brightness slider logic
function updateBgOverlayFilter() {
  const blur = bgBlurSlider ? bgBlurSlider.value : 8;
  const brightness = bgBrightnessSlider ? bgBrightnessSlider.value : 100;
  if (bgBlurValue) bgBlurValue.textContent = blur;
  if (bgBrightnessValue) bgBrightnessValue.textContent = brightness;
  if (bgFadeOverlay) bgFadeOverlay.style.filter = `blur(${blur}px) brightness(${brightness/100})`;
  // Spara blur och brightness till localStorage (bilden sparas i setBackgroundWithBlur)
  localStorage.setItem('docktab_blur', blur);
  localStorage.setItem('docktab_brightness', brightness);
}

if (bgBlurSlider && bgBlurValue && bgFadeOverlay) {
  bgBlurSlider.addEventListener('input', updateBgOverlayFilter);
  bgBlurValue.textContent = bgBlurSlider.value;
}
if (bgBrightnessSlider && bgBrightnessValue && bgFadeOverlay) {
  bgBrightnessSlider.addEventListener('input', updateBgOverlayFilter);
  bgBrightnessValue.textContent = bgBrightnessSlider.value;
}
// Init filter
updateBgOverlayFilter();
if (openBtn && drawer) {
  openBtn.addEventListener('click', function(e) {
    e.preventDefault();
    drawer.classList.remove('closing');
    drawer.classList.add('open');
    drawer.style.display = '';
  });
}

// Click outside to close
document.addEventListener('mousedown', function(e) {
  if (drawer.classList.contains('open')) {
    if (!drawer.contains(e.target) && !openBtn.contains(e.target)) {
      drawer.classList.remove('open');
      drawer.classList.add('closing');
      setTimeout(() => {
        drawer.classList.remove('closing');
        drawer.style.display = 'none';
      }, 350);
    }
  }
});

// Drag and drop/upload for background
const dropArea = document.getElementById('drop-area');
const bgUpload = document.getElementById('bg-upload');
const dropText = document.getElementById('drop-text');

function setBackgroundImage(file) {
  const reader = new FileReader();
  reader.onload = function(e) {
    document.body.style.backgroundImage = `url('${e.target.result}')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
  };
  reader.readAsDataURL(file);
}

if (dropArea && bgUpload) {
  dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropArea.classList.add('dragover');
  });
  dropArea.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dropArea.classList.remove('dragover');
  });
  dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dropArea.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      setBackgroundImage(files[0]);
    }
  });
  dropArea.addEventListener('click', () => {
    bgUpload.click();
  });
  bgUpload.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      setBackgroundImage(e.target.files[0]);
    }
  });
}
