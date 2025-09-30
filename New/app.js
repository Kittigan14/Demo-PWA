let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
});

function installPWA() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the PWA install');
            }
            deferredPrompt = null;
        });
    } else {
        alert('PWA สามารถติดตั้งได้แล้ว หรือกำลังใช้งานอยู่แล้ว หรือ Browser ไม่รองรับ');
    }
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').then((registration) => {
        console.log('ServiceWorker registered:', registration);
    }).catch((error) => {
        console.log('ServiceWorker registration failed:', error);
    });
}

const availableImages = [
    'images/image1.jpg',
    'images/image2.jpg',
    'images/image3.jpg',
    'images/image4.jpg'
];

let images = [];
let currentImageIndex = 0;

function updateStatus() {
    const status = document.getElementById('status');
    if (navigator.onLine) {
        status.textContent = '🟢 ออนไลน์';
        status.className = 'status online';
    } else {
        status.textContent = '🔴 ออฟไลน์';
        status.className = 'status offline';
    }
}

window.addEventListener('online', updateStatus);
window.addEventListener('offline', updateStatus);
updateStatus();

function loadNextImage() {
    if (images.length >= 4) {
        alert('สามารถเก็บได้สูงสุด 4 รูปเท่านั้น กรุณาล้างแกลเลอรี่ก่อนเพิ่มรูปใหม่');
        return;
    }

    const imageUrl = availableImages[currentImageIndex];

    const imageData = {
        id: Date.now(),
        url: imageUrl,
        timestamp: new Date().toLocaleString('th-TH'),
        name: `รูปที่ ${currentImageIndex + 1}`
    };

    images.push(imageData);
    currentImageIndex++;

    updateGallery();
    updateStorageInfo();
    updateButtonState();
}

function updateGallery() {
    const gallery = document.getElementById('gallery');

    if (images.length === 0) {
        gallery.innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                </svg>
                <h3>ยังไม่มีรูปภาพ</h3>
                <p>คลิก "โหลดรูปถัดไป" เพื่อเริ่มต้น</p>
            </div>
        `;
        return;
    }

    gallery.innerHTML = images.map((img) => `
        <div class="image-card" onclick="openModal('${img.url}')">
            <img src="${img.url}" alt="${img.name}" loading="lazy">
            <div class="image-info">
                <p>📷 ${img.name}</p>
                <p>📅 ${img.timestamp}</p>
            </div>
        </div>
    `).join('');
}

function clearGallery() {
    if (confirm('ต้องการล้างรูปภาพทั้งหมดใช่หรือไม่?')) {
        images = [];
        currentImageIndex = 0;
        updateGallery();
        updateStorageInfo();
        updateButtonState();
    }
}

function updateStorageInfo() {
    const info = document.getElementById('storageInfo');
    info.textContent = `จำนวนรูปภาพ: ${images.length}/4 รูป (เก็บใน Memory)`;
}

function updateButtonState() {
    const loadBtn = document.getElementById('loadBtn');
    if (images.length >= 4) {
        loadBtn.disabled = true;
        loadBtn.textContent = '✅ โหลดครบแล้ว';
    } else {
        loadBtn.disabled = false;
        loadBtn.textContent = '📷 โหลดรูปถัดไป';
    }
}

function openModal(imageUrl) {
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modalImage');
    modalImage.src = imageUrl;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(event) {
    if (event.target.id === 'modal' || event.target.classList.contains('close-modal')) {
        const modal = document.getElementById('modal');
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('modal');
        if (modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
});

updateGallery();
updateStorageInfo();
updateButtonState();