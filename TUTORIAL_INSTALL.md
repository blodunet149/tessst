# Tutorial Instalasi Aplikasi React Sederhana

Berikut adalah langkah-langkah untuk menginstal dan menjalankan aplikasi React sederhana dengan fitur login, register, dashboard, dan profile.

## Prasyarat

Sebelum memulai, pastikan Anda telah menginstal:

- [Node.js](https://nodejs.org/) (versi 14.0.0 atau lebih baru)
- npm (umumnya disertakan dengan instalasi Node.js)

## Langkah-langkah Instalasi

### 1. Clone atau Unduh Proyek

Jika Anda mendapatkan proyek ini dari repositori:

```bash
git clone <URL_REPOSITORI>
cd <NAMA_PROYEK>
```

Jika Anda mendapatkan file dalam bentuk zip, ekstrak file dan buka terminal di direktori proyek.

### 2. Instal Dependencies

Dari direktori proyek, jalankan perintah berikut untuk menginstal semua dependencies yang dibutuhkan:

```bash
npm install
```

Perintah ini akan menginstal semua paket yang tercantum dalam file `package.json`, termasuk:
- React dan React-DOM
- React Router DOM
- Bootstrap
- React Scripts

### 3. Menjalankan Aplikasi

Untuk menjalankan aplikasi dalam mode development, gunakan perintah berikut:

```bash
npm start
```

Aplikasi akan otomatis membuka browser di:
```
http://localhost:3000
```

Jika browser tidak terbuka secara otomatis, buka browser dan akses alamat tersebut.

### 4. Struktur Proyek

Setelah instalasi, proyek Anda akan memiliki struktur berikut:

```
.
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.js
│   │   └── Navbar.css
│   ├── context/
│   │   └── AuthContext.js
│   ├── pages/
│   │   ├── LoginPage.js
│   │   ├── RegisterPage.js
│   │   ├── DashboardPage.js
│   │   ├── ProfilePage.js
│   │   └── CSS files for each page
│   ├── styles/
│   │   └── App.css
│   ├── App.js
│   ├── index.js
│   └── index.css
├── package.json
├── README.md
└── server.js
```

### 5. Fitur-fitur

Aplikasi ini memiliki empat halaman utama:

- **Login** (`/login`): Halaman untuk login ke aplikasi
- **Register** (`/register`): Halaman untuk mendaftar akun baru
- **Dashboard** (`/dashboard`): Halaman utama setelah login
- **Profile** (`/profile`): Halaman untuk melihat dan mengedit profil

### 6. Navigasi

- Terdapat navbar di bagian atas yang memudahkan navigasi antar halaman
- Ketika user belum login, hanya link Login dan Register yang tampil
- Setelah login, navbar menampilkan link Dashboard dan Profile serta tombol Logout

### 7. Autentikasi

- Aplikasi menggunakan React Context untuk manajemen state autentikasi
- Data user disimpan sementara di localStorage
- Status login dipertahankan antar sesi browser

## Build untuk Production

Jika Anda ingin membuat versi production dari aplikasi:

```bash
npm run build
```

Perintah ini akan membuat folder `build` dengan versi siap produksi dari aplikasi Anda.

## Troubleshooting

### Jika npm install gagal

Pastikan versi Node.js Anda kompatibel dan coba:
```bash
npm cache clean --force
npm install
```

### Jika npm start tidak berjalan

Pastikan tidak ada aplikasi lain yang menggunakan port 3000. Jika port 3000 digunakan, Anda bisa menggantinya dengan mengatur variabel lingkungan:
```bash
PORT=3001 npm start
```

### Jika muncul error saat instalasi

- Pastikan Anda memiliki koneksi internet yang stabil
- Pastikan Anda memiliki cukup ruang penyimpanan
- Coba jalankan perintah sebagai administrator (di Windows) atau dengan sudo (di Linux/Mac)

## Teknologi yang Digunakan

- **React**: Library JavaScript untuk membangun user interface
- **React Router DOM**: Routing untuk aplikasi React
- **React Context API**: Manajemen state global
- **Bootstrap**: Framework CSS untuk desain responsif
- **npm**: Package manager untuk dependency management

## Lisensi

Proyek ini dibuat untuk tujuan pendidikan dan dapat digunakan secara bebas.