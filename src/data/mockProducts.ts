// src/data/mockProducts.ts
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

// Danh sách URL ảnh thật của các dòng AirPods / Tai nghe iPhone
const AIRPODS_IMAGES = [
  "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&q=80", // AirPods Pro
  "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=500&q=80", // AirPods Max
  "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=500&q=80", // AirPods 2 / 3
  "https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?w=500&q=80", // Case AirPods
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80", // Tai nghe Bluetooth
];

// Các tên dòng tai nghe Apple phổ biến
const AIRPODS_NAMES = [
  "AirPods Pro 2nd Gen",
  "AirPods Max Wireless",
  "AirPods 3 với Sạc MagSafe",
  "AirPods 2 Wiring Case",
  "Tai nghe Apple EarPods Lightning",
];

// Tạo mảng 50 sản phẩm mẫu với ảnh và tên AirPods
export const MOCK_PRODUCTS: Product[] = Array.from({ length: 50 }).map(
  (_, index) => {
    const itemIndex = index % AIRPODS_IMAGES.length;
    const namePrefix = AIRPODS_NAMES[itemIndex];

    return {
      id: `prod_${index}`,
      name: `${namePrefix} #${index + 1}`,
      price: 1290000 + index * 150000,
      image: AIRPODS_IMAGES[itemIndex],
    };
  }
);