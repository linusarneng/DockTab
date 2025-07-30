// Background upload button logic
const bgUploadBtn = document.getElementById('bg-upload-btn');
const bgUploadInput = document.getElementById('bg-upload-input');
const bgPreview = document.getElementById('bg-preview');

if (bgUploadBtn && bgUploadInput && bgPreview) {
  bgUploadBtn.addEventListener('click', () => {
    bgUploadInput.click();
  });
  bgUploadInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = function(ev) {
        bgPreview.innerHTML = `<img src="${ev.target.result}" alt="Preview" style="max-width:100%;max-height:120px;border-radius:12px;box-shadow:0 2px 8px 0 rgba(0,0,0,0.10);margin-top:8px;" />`;
      };
      reader.readAsDataURL(file);
    }
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
  document.body.style.backgroundImage = `url('${randomImage}')`;
  document.body.style.backgroundSize = 'cover';
  document.body.style.backgroundPosition = 'center';
  document.body.style.backgroundRepeat = 'no-repeat';
}
// Set random background on page load
setRandomBackground();
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
