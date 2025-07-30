// Shortcuts container
let shortcutsContainer = document.getElementById('shortcuts-container');
if (!shortcutsContainer) {
  shortcutsContainer = document.createElement('div');
  shortcutsContainer.id = 'shortcuts-container';
  shortcutsContainer.style.display = 'flex';
  shortcutsContainer.style.flexDirection = 'row';
  shortcutsContainer.style.alignItems = 'flex-end';
  shortcutsContainer.style.flexWrap = 'nowrap';
  shortcutsContainer.style.justifyContent = 'center';
  shortcutsContainer.style.gap = '18px';
  shortcutsContainer.style.margin = '32px 0 0 0';
  const container = document.querySelector('.container');
  if (container) container.appendChild(shortcutsContainer);
}

// Shortcut context menu logic (efter shortcutsContainer är definierad)
let longPressTimer = null;
let currentShortcutBtn = null;
const shortcutContextMenu = document.getElementById('shortcut-context-menu');
const shortcutContextSheet = shortcutContextMenu ? shortcutContextMenu.querySelector('.shortcut-context-sheet') : null;
const shortcutRename = document.getElementById('shortcut-rename');
const shortcutChangeIcon = document.getElementById('shortcut-change-icon');
const shortcutRemove = document.getElementById('shortcut-remove');
const shortcutContextCancel = document.getElementById('shortcut-context-cancel');

function showShortcutContextMenu(btn, x, y) {
  if (!shortcutContextMenu || !shortcutContextSheet) return;
  shortcutContextMenu.classList.add('active');
  btn.classList.add('enlarged');
  currentShortcutBtn = btn;
  // Position menu next to button
  const rect = btn.getBoundingClientRect();
  shortcutContextSheet.style.left = (rect.right + 16) + 'px';
  shortcutContextSheet.style.top = (rect.top) + 'px';
  shortcutContextSheet.style.position = 'fixed';
}
function hideShortcutContextMenu() {
  if (!shortcutContextMenu) return;
  shortcutContextMenu.classList.remove('active');
  if (currentShortcutBtn) currentShortcutBtn.classList.remove('enlarged');
  currentShortcutBtn = null;
}

// Event delegation for long press
shortcutsContainer.addEventListener('mousedown', function(e) {
  if (e.target.classList.contains('shortcut-btn')) {
    longPressTimer = setTimeout(() => {
      showShortcutContextMenu(e.target, e.clientX, e.clientY);
    }, 500);
  }
});
shortcutsContainer.addEventListener('mouseup', function(e) {
  clearTimeout(longPressTimer);
});
shortcutsContainer.addEventListener('mouseleave', function(e) {
  clearTimeout(longPressTimer);
});
// Touch support
shortcutsContainer.addEventListener('touchstart', function(e) {
  const target = e.target.closest('.shortcut-btn');
  if (target) {
    longPressTimer = setTimeout(() => {
      showShortcutContextMenu(target, 0, 0);
    }, 500);
  }
});
shortcutsContainer.addEventListener('touchend', function(e) {
  clearTimeout(longPressTimer);
});

// Hide menu on cancel or outside
if (shortcutContextCancel) shortcutContextCancel.addEventListener('click', hideShortcutContextMenu);
if (shortcutContextMenu) shortcutContextMenu.addEventListener('mousedown', function(e) {
  if (e.target === shortcutContextMenu) hideShortcutContextMenu();
});

// Remove shortcut
if (shortcutRemove) shortcutRemove.addEventListener('click', function() {
  if (currentShortcutBtn) {
    currentShortcutBtn.remove();
    hideShortcutContextMenu();
  }
});

// Rename shortcut
if (shortcutRename) shortcutRename.addEventListener('click', function() {
  if (!currentShortcutBtn) return;
  let label = currentShortcutBtn.querySelector('.shortcut-label');
  if (!label) {
    label = document.createElement('div');
    label.className = 'shortcut-label';
    label.style.position = 'absolute';
    label.style.bottom = '-28px';
    label.style.left = '50%';
    label.style.transform = 'translateX(-50%)';
    label.style.width = 'max-content';
    label.style.maxWidth = '80px';
    label.style.fontSize = '0.98rem';
    label.style.color = '#fff';
    label.style.textAlign = 'center';
    label.style.pointerEvents = 'none';
    currentShortcutBtn.appendChild(label);
  }
  const newName = prompt('Nytt namn:', label.textContent || '');
  if (newName !== null) label.textContent = newName;
  hideShortcutContextMenu();
});

// Change icon
if (shortcutChangeIcon) shortcutChangeIcon.addEventListener('click', function() {
  if (!currentShortcutBtn) return;
  const newIcon = prompt('URL till ny ikon:');
  if (newIcon) {
    let img = currentShortcutBtn.querySelector('img');
    if (!img) {
      img = document.createElement('img');
      img.style.width = '60%';
      img.style.height = '60%';
      img.style.objectFit = 'contain';
      img.style.position = 'absolute';
      img.style.top = '50%';
      img.style.left = '50%';
      img.style.transform = 'translate(-50%, -50%)';
      img.style.pointerEvents = 'none';
      currentShortcutBtn.appendChild(img);
    }
    img.src = newIcon;
  }
  hideShortcutContextMenu();
});

const shortcutSave = document.getElementById('shortcut-save');
const shortcutUrl = document.getElementById('shortcut-url');
const shortcutImg = document.getElementById('shortcut-img');
const shortcutTitle = document.getElementById('shortcut-title');
if (shortcutSave && shortcutUrl && shortcutImg && shortcutTitle) {
  shortcutSave.addEventListener('click', () => {
    const url = shortcutUrl.value.trim();
    const img = shortcutImg.value.trim();
    const title = shortcutTitle.value.trim() || 'Genväg';
    if (!url) {
      shortcutUrl.focus();
      shortcutUrl.style.border = '1.5px solid #ff4d4f';
      setTimeout(() => shortcutUrl.style.border = '', 1200);
      return;
    }
    // Skapa wrapper för shortcut och label
    const wrapper = document.createElement('div');
    wrapper.className = 'shortcut-outer';
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
    wrapper.style.alignItems = 'center';
    wrapper.style.width = '56px';
    wrapper.style.maxWidth = '80px';
    wrapper.style.gap = '7px';
    // Skapa shortcut-knapp
    const btn = document.createElement('a');
    btn.href = url;
    btn.target = '_blank';
    btn.rel = 'noopener noreferrer';
    btn.className = 'glass-plus-btn shortcut-btn';
    btn.style.width = '56px';
    btn.style.height = '56px';
    btn.style.margin = '0';
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    let image;
    if (img) {
      image = document.createElement('img');
      image.src = img;
      image.alt = '';
      image.style.width = '60%';
      image.style.height = '60%';
      image.style.objectFit = 'contain';
      image.style.position = 'absolute';
      image.style.top = '50%';
      image.style.left = '50%';
      image.style.transform = 'translate(-50%, -50%)';
      image.style.pointerEvents = 'none';
      // Om bilden inte laddas, visa default-ikon
      image.onerror = function() {
        image.style.display = 'none';
        btn.insertAdjacentHTML('afterbegin', `<svg class=\"shortcut-default-icon\" width=\"28\" height=\"28\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><rect width=\"24\" height=\"24\" rx=\"7\" fill=\"#e0e0e0\"/><path d=\"M7.5 12h9M12 7.5v9\" stroke=\"#222\" stroke-width=\"2.2\" stroke-linecap=\"round\"/></svg>`);
      };
      btn.appendChild(image);
    } else {
      btn.innerHTML = '<svg class="shortcut-default-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="7" fill="#e0e0e0"/><path d="M7.5 12h9M12 7.5v9" stroke="#222" stroke-width="2.2" stroke-linecap="round"/></svg>';
    }
    // Lägg till namn under knappen (utanför a-taggen)
    const label = document.createElement('div');
    label.className = 'shortcut-label';
    label.textContent = title;
    label.style.display = 'block';
    label.style.width = '100%';
    label.style.maxWidth = '80px';
    label.style.fontSize = '0.98rem';
    label.style.color = '#fff';
    label.style.textAlign = 'center';
    label.style.pointerEvents = 'none';
    label.style.margin = '0';
    wrapper.appendChild(btn);
    wrapper.appendChild(label);
    // Lägg in wrapper före plus-knappen (så plus alltid är sist)
    const plusBtn = document.querySelector('.glass-plus-btn:not(.shortcut-btn)');
    if (plusBtn && plusBtn.parentNode === shortcutsContainer) {
      shortcutsContainer.insertBefore(wrapper, plusBtn);
    } else {
      shortcutsContainer.appendChild(wrapper);
    }
    // Stäng menyn
    closeShortcutMenuWithAnim();
    shortcutUrl.value = '';
    shortcutImg.value = '';
    shortcutTitle.value = '';
  });
}
// Shortcut menu logic
const plusShortcut = document.getElementById('plus-shortcut');
const shortcutMenu = document.getElementById('shortcut-menu');
const shortcutCancel = document.getElementById('shortcut-cancel');
const shortcutBg = shortcutMenu ? shortcutMenu.querySelector('.plus-menu-bg') : null;
if (plusShortcut && shortcutMenu) {
  plusShortcut.addEventListener('click', () => {
    // Stäng plusmenyn med animation
    closePlusMenuWithAnim();
    setTimeout(() => {
      shortcutMenu.style.display = 'flex';
      setTimeout(() => shortcutMenu.classList.add('active'), 10);
    }, 180);
  });
}
function closeShortcutMenuWithAnim() {
  const sheet = shortcutMenu.querySelector('.plus-menu-sheet');
  if (sheet) {
    sheet.classList.add('closing');
    setTimeout(() => {
      shortcutMenu.classList.remove('active');
      sheet.classList.remove('closing');
      shortcutMenu.style.display = 'none';
    }, 180);
  } else {
    shortcutMenu.classList.remove('active');
    shortcutMenu.style.display = 'none';
  }
}
if (shortcutCancel) {
  shortcutCancel.addEventListener('click', () => {
    closeShortcutMenuWithAnim();
  });
}
if (shortcutBg) {
  shortcutBg.addEventListener('click', () => {
    closeShortcutMenuWithAnim();
  });
}
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
