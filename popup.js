document.addEventListener('DOMContentLoaded', () => {
    // HTML'deki butonumuzun ID'si 'startBtn'
    const startBtn = document.getElementById('startBtn');

    if (!startBtn) return;

    startBtn.addEventListener('click', async () => {
        // Aktif sekmeyi bul
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (!tab) {
            alert("Aktif sekme bulunamadı!");
            return;
        }

        // Instagram'da olup olmadığını kontrol et
        if (!tab.url || !tab.url.includes("instagram.com")) {
            alert("Lütfen önce Instagram profil sayfanıza gidin! / Please go to Instagram first!");
            return;
        }

        // analyzer.js dosyasını Instagram sekmesine enjekte et
        try {
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['analyzer.js']
            });
            window.close(); // İşlem başlayınca Popup'ı kapat
        } catch (err) {
            console.error("Script enjekte edilirken hata:", err);
            alert("Hata oluştu: " + err.message);
        }
    });
});