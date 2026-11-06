class App {
    static init() {
        window.addEventListener('hashchange', () => App.router());
        window.addEventListener('DOMContentLoaded', () => App.router());
    }

    static router() {
        const hash = window.location.hash || '#dashboard';
        const container = document.getElementById('app');

        switch (hash) {
            case '#dashboard':
                if (typeof DashboardPage !== 'undefined') {
                    DashboardPage.render(container);
                } else {
                    container.innerHTML = `<p class="text-center text-red-500">DashboardPage belum dimuat.</p>`;
                }
                break;

            case '#books':
                if (typeof BooksPage !== 'undefined') {
                    BooksPage.render(container);
                } else {
                    container.innerHTML = `<p class="text-center text-red-500">Halaman Buku belum dimuat atau ada error.</p>`;
                }
                break;

            case '#categories':
                if (typeof CategoriesPage !== 'undefined') {
                    CategoriesPage.render(container);
                } else {
                    container.innerHTML = `<p class="text-center text-gray-500">Halaman Kategori belum dimuat.</p>`;
                }
                break;

            default:
                container.innerHTML = `<h2 class="text-xl font-bold text-red-500 text-center">404 - Halaman Tidak Ditemukan</h2>`;
        }
    }
}

// Jalankan aplikasi
App.init();