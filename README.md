https://github.com/LouinLee/Inventory

## Koneksi ke Database
- Buat new connection di MongoDB, kemudian connect

## Cara Menjalankan Proyek
- Clone repository
- Install semua dependency yang dibutuhkan
- Untuk memulai program, jalankan `npm run dev` pada terminal backend dan `npm start` pada terminal frontend

## Fitur yang Telah Diimplementasikan

### **Autentikasi Pengguna**
- **Registrasi** pengguna baru dengan hashing password menggunakan `bcryptjs`.
- **Login** dengan validasi username dan password.
- **Menyimpan sesi pengguna** menggunakan JWT (`jsonwebtoken`) dengan cookie.
- **Logout** untuk menghapus sesi pengguna.

### **Manajemen Product, Category, Warehouse**
- **Menambahkan, mengedit, menghapus** `product`, `category`, dan `warehouse`
- **Menampilkan stok penyimpanan produk** yang ada pada **gudang tertentu**, melalui menu halaman **Product**
- **Menampilkan semua produk** yang ada pada **kategori tertentu**, melalui menu halaman **Category**
- **Menampilkan semua produk** yang ada pada **gudang tertentu**, melalui menu halaman **Warehouse**

### **Manajemen Inbound, Outbound**
- **Menambahkan stok inbound dan outbound** yang masuk ataupun keluar
- **Menampilkan histori inbound dan outbound**
  
### **Real-Time Update & Notification**
- Perubahan data secara langsung disertai feedback notifikasi yang muncul

---
