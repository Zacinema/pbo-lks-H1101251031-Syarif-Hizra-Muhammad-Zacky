class CategoriesPage {
    static async render(container) {
        container.innerHTML = `
            <div class="space-y-6">
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold text-gray-800">Manajemen Kategori</h2>
                    <button onclick="CategoriesPage.openModal()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition">
                        + Tambah Kategori
                    </button>
                </div>

                <!-- Tabel Kategori -->
                <div class="bg-white border rounded-lg shadow-sm overflow-hidden">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-gray-100 text-gray-600 text-sm">
                                <th class="p-3">ID</th>
                                <th class="p-3">Nama Kategori</th>
                                <th class="p-3">Deskripsi</th>
                                <th class="p-3 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="categories-table-body" class="text-gray-700 text-sm divide-y">
                            <tr><td colspan="4" class="p-4 text-center text-gray-500">Memuat data...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Modal Form Tambah/Edit Kategori -->
            <div id="category-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden flex items-center justify-center z-50">
                <div class="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
                    <h3 id="category-modal-title" class="text-xl font-bold mb-4 text-gray-800">Tambah Kategori</h3>
                    <form id="category-form" onsubmit="CategoriesPage.handleSubmit(event)" class="space-y-4">
                        <input type="hidden" id="category-id">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Nama Kategori</label>
                            <input type="text" id="category-nama" required class="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-blue-300">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Deskripsi</label>
                            <textarea id="category-deskripsi" rows="3" class="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-blue-300"></textarea>
                        </div>
                        <div class="flex justify-end space-x-3 mt-6">
                            <button type="button" onclick="CategoriesPage.closeModal()" class="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition">Batal</button>
                            <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">Simpan</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        await CategoriesPage.loadData();
    }

    static async loadData() {
        try {
            const response = await ApiClient.get('/categories');
            const categories = response.data || [];
            const tbody = document.getElementById('categories-table-body');

            if (categories.length === 0) {
                tbody.innerHTML = `<tr><td colspan="4" class="p-4 text-center text-gray-500">Belum ada data kategori.</td></tr>`;
                return;
            }

            tbody.innerHTML = categories.map(cat => `
                <tr class="hover:bg-gray-50">
                    <td class="p-3">${cat.id}</td>
                    <td class="p-3 font-medium">${escapeHtml(cat.nama)}</td>
                    <td class="p-3">${escapeHtml(cat.deskripsi || '-')}</td>
                    <td class="p-3 text-center space-x-2">
                        <button onclick="CategoriesPage.openModal(${cat.id}, '${escapeHtml(cat.nama).replace(/'/g, "\\'")}', '${escapeHtml(cat.deskripsi || '').replace(/'/g, "\\'")}')" class="text-blue-600 hover:underline">Edit</button>
                        <button onclick="CategoriesPage.delete(${cat.id})" class="text-red-600 hover:underline">Hapus</button>
                    </td>
                </tr>
            `).join('');
        } catch (error) {
            showToast('Gagal memuat daftar kategori: ' + error.message, true);
        }
    }

    static openModal(id = null, nama = '', deskripsi = '') {
        document.getElementById('category-id').value = id || '';
        document.getElementById('category-nama').value = nama;
        document.getElementById('category-deskripsi').value = deskripsi;
        document.getElementById('category-modal-title').textContent = id ? 'Edit Kategori' : 'Tambah Kategori';
        document.getElementById('category-modal').classList.remove('hidden');
    }

    static closeModal() {
        document.getElementById('category-modal').classList.add('hidden');
    }

    static async handleSubmit(event) {
        event.preventDefault();
        const id = document.getElementById('category-id').value;
        const data = {
            nama: document.getElementById('category-nama').value,
            deskripsi: document.getElementById('category-deskripsi').value
        };

        try {
            if (id) {
                await ApiClient.put(`/categories/${id}`, data);
                showToast('Kategori berhasil diperbarui');
            } else {
                await ApiClient.post('/categories', data);
                showToast('Kategori berhasil ditambahkan');
            }
            CategoriesPage.closeModal();
            await CategoriesPage.loadData();
        } catch (error) {
            showToast(error.message, true);
        }
    }

    static async delete(id) {
        if (!confirm('Apakah kamu yakin ingin menghapus kategori ini?')) return;
        try {
            await ApiClient.delete(`/categories/${id}`);
            showToast('Kategori berhasil dihapus');
            await CategoriesPage.loadData();
        } catch (error) {
            showToast(error.message, true);
        }
    }
}