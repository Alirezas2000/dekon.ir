import products from '../data/products.json';
// تنها نقطه دسترسی به داده‌های محصولات؛ برای اتصال بک‌اند، فقط این توابع را به fetch تغییر بده.
// هر دو تابع Promise برمی‌گردانند تا کامپوننت‌ها با API واقعی سازگار بمانند.
export async function getProducts(){return products;}
export async function getProductById(id){return products.find(p=>p.id===Number(id))??null;}
