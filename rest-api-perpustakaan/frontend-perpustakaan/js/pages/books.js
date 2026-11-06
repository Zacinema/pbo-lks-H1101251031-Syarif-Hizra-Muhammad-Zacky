class BooksPage {
    static async render(container) {
        container.innerHTML = `
            <div class="space-y-6">
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold text-gray-800">Manajemen Buku</h2>
                    <button onclick="BooksPage.openModal()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition">
                        + Tambah Buku
                    </button>
                </div>

                <!-- Tabel Buku -->
                <div class="bg-white border rounded-lg shadow-sm overflow-hidden">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-gray-100 text-gray-600 text-sm">
                                <th class="p-3">ID</th>
                                <th class="p-3">Judul</th>
                                <th class="p-3">Penulis</th>
                                <th class="p-3">Tahun</th>
                                <th class="p-3">Stok</th>
                                <th class="p-3 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="books-table-body" class="text-gray-700 text-sm divide-y">
                            <tr><td colspan="6" class="p-4 text-center text-gray-500">Memuat data...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Modal Form Tambah/Edit Buku -->
            <div id="book-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden flex items-center justify-center z-50">
                <div class="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
                    <h3 id="modal-title" class="text-xl font-bold mb-4 text-gray-800">Tambah Buku</h3>
                    <form id="book-form" onsubmit="BooksPage.handleSubmit(event)" class="space-y-4">
                        <input type="hidden" id="book-id">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Judul Buku</label>
                            <input type="text" id="book-judul" required class="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-blue-300">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Penulis</label>
                            <input type="text" id="book-penulis" required class="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-blue-300">
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Tahun</label>
                                <input type="number" id="book-tahun" required class="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-blue-300">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Stok</label>
                                <input type="number" id="book-stok" required class="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-blue-300">
                            </div>
                        </div>
                        <div class="flex justify-end space-x-3 mt-6">
                            <button type="button" onclick="BooksPage.closeModal()" class="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition">Batal</button>
                            <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">Simpan</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        await BooksPage.loadData();
    }

    static async loadData() {
        try {
            const response = await ApiClient.get('/books');
            const books = response.data || [];
            const tbody = document.getElementById('books-table-body');

            if (books.length === 0) {
                tbody.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-gray-500">Belum ada data buku.</td></tr>`;
                return;
            }

            tbody.innerHTML = books.map(book => `
                <tr class="hover:bg-gray-50">
                    <td class="p-3">${book.id}</td>
                    <td class="p-3 font-medium">${escapeHtml(book.judul)}</td>
                    <td class="p-3">${escapeHtml(book.penulis)}</td>
                    <td class="p-3">${book.tahun}</td>
                    <td class="p-3">${book.stok}</td>
                    <td class="p-3 text-center space-x-2">
                        <button onclick="BooksPage.openModal(${book.id}, '${escapeHtml(book.judul).replace(/'/g, "\\'")}', '${escapeHtml(book.penulis).replace(/'/g, "\\'")}', ${book.tahun}, ${book.stok})" class="text-blue-600 hover:underline">Edit</button>
                        <button onclick="BooksPage.delete(${book.id})" class="text-red-600 hover:underline">Hapus</button>
                    </td>
                </tr>
            `).join('');
        } catch (error) {
            showToast('Gagal memuat daftar buku: ' + error.message, true);
        }
    }

    static openModal(id = null, judul = '', penulis = '', tahun = '', stok = '') {
        document.getElementById('book-id').value = id || '';
        document.getElementById('book-judul').value = judul;
        document.getElementById('book-penulis').value = penulis;
        document.getElementById('book-tahun').value = tahun;
        document.getElementById('book-stok').value = stok;
        document.getElementById('modal-title').textContent = id ? 'Edit Buku' : 'Tambah Buku';
        document.getElementById('book-modal').classList.remove('hidden');
    }

    static closeModal() {
        document.getElementById('book-modal').classList.add('hidden');
    }

    static async handleSubmit(event) {
        event.preventDefault();
        const id = document.getElementById('book-id').value;
        const data = {
            judul: document.getElementById('book-judul').value,
            penulis: document.getElementById('book-penulis').value,
            tahun: parseInt(document.getElementById('book-tahun').value),
            stok: parseInt(document.getElementById('book-stok').value)
        };

        try {
            if (id) {
                await ApiClient.put(`/books/${id}`, data);
                showToast('Buku berhasil diperbarui');
            } else {
                await ApiClient.post('/books', data);
                showToast('Buku berhasil ditambahkan');
            }
            BooksPage.closeModal();
            await BooksPage.loadData();
        } catch (error) {
            showToast(error.message, true);
        }
    }

    static async delete(id) {
        if (!confirm('Apakah kamu yakin ingin menghapus buku ini?')) return;
        try {
            await ApiClient.delete(`/books/${id}`);
            showToast('Buku berhasil dihapus');
            await BooksPage.loadData();
        } catch (error) {
            showToast(error.message, true);
        }
    }
}