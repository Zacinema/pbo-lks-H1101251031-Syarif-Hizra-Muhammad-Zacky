class DashboardPage {
    static async render(container) {
        container.innerHTML = `
            <div class="space-y-6">
                <h2 class="text-2xl font-bold text-gray-800">Dashboard Perpustakaan</h2>
                
                <!-- Kartu Statistik -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="bg-blue-500 text-white p-6 rounded-lg shadow-md flex items-center justify-between">
                        <div>
                            <p class="text-sm uppercase tracking-wider">Total Buku</p>
                            <h3 id="stat-books" class="text-3xl font-bold mt-1">...</h3>
                        </div>
                        <svg class="w-12 h-12 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                    </div>
                    
                    <div class="bg-orange-500 text-white p-6 rounded-lg shadow-md flex items-center justify-between">
                        <div>
                            <p class="text-sm uppercase tracking-wider">Total Kategori</p>
                            <h3 id="stat-categories" class="text-3xl font-bold mt-1">...</h3>
                        </div>
                        <svg class="w-12 h-12 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                    </div>
                </div>

                <!-- Buku Terbaru -->
                <div class="bg-white border rounded-lg p-6 shadow-sm">
                    <h3 class="text-lg font-semibold text-gray-700 mb-4">5 Buku Terbaru</h3>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-gray-100 text-gray-600 text-sm">
                                    <th class="p-3">Judul</th>
                                    <th class="p-3">Penulis</th>
                                    <th class="p-3">Tahun</th>
                                    <th class="p-3">Stok</th>
                                </tr>
                            </thead>
                            <tbody id="recent-books-table" class="text-gray-700 text-sm divide-y">
                                <tr><td colspan="4" class="p-4 text-center text-gray-500">Memuat data...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        try {
            // Ambil data buku dan kategori secara paralel
            const [booksRes, categoriesRes] = await Promise.all([
                ApiClient.get('/books'),
                ApiClient.get('/categories')
            ]);

            const books = booksRes.data || [];
            const categories = categoriesRes.data || [];

            // Update Statistik
            document.getElementById('stat-books').textContent = books.length;
            document.getElementById('stat-categories').textContent = categories.length;

            // Render 5 Buku Terbaru
            const tbody = document.getElementById('recent-books-table');
            const recentBooks = books.slice(0, 5);

            if (recentBooks.length === 0) {
                tbody.innerHTML = `<tr><td colspan="4" class="p-4 text-center text-gray-500">Belum ada data buku.</td></tr>`;
                return;
            }

            tbody.innerHTML = recentBooks.map(book => `
                <tr class="hover:bg-gray-50">
                    <td class="p-3 font-medium">${escapeHtml(book.judul)}</td>
                    <td class="p-3">${escapeHtml(book.penulis)}</td>
                    <td class="p-3">${book.tahun}</td>
                    <td class="p-3">${book.stok}</td>
                </tr>
            `).join('');

        } catch (error) {
            showToast('Gagal memuat data dashboard: ' + error.message, true);
        }
    }
}