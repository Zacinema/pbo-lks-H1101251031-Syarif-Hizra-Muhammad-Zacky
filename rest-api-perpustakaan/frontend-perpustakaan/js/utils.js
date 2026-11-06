// Fungsi untuk mencegah XSS (Cross-Site Scripting) saat merender data ke HTML
function escapeHtml(unsafe) {
    if (unsafe === null || unsafe === undefined) return '';
    if (typeof unsafe !== 'string') return unsafe;
    
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

// Fungsi untuk menampilkan pop-up notifikasi (Toast)
function showToast(message, isError = false) {
    const toast = document.createElement('div');
    toast.className = `toast-notification ${isError ? 'toast-error' : 'toast-success'}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);

    // Hilangkan toast setelah 3 detik
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}