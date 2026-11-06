class ApiClient {
    // Fungsi inti untuk menembak API
    static async request(endpoint, method = 'GET', data = null) {
        const url = `${BASE_URL}${endpoint}`;
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            
            // Jika status HTTP bukan 2xx, lempar pesan error
            if (!response.ok) {
                throw new Error(result.message || 'Terjadi kesalahan pada server');
            }
            return result;
            
        } catch (error) {
            console.error(`[API Error] ${method} ${endpoint}:`, error);
            throw error; // Lempar ke halaman agar bisa dimunculkan di Toast
        }
    }

    // Fungsi singkat untuk setiap metode HTTP
    static async get(endpoint) {
        return this.request(endpoint, 'GET');
    }

    static async post(endpoint, data) {
        return this.request(endpoint, 'POST', data);
    }

    static async put(endpoint, data) {
        return this.request(endpoint, 'PUT', data);
    }

    static async delete(endpoint) {
        return this.request(endpoint, 'DELETE');
    }
}