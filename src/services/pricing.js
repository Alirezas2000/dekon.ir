// قیمت نهایی = جمع قیمت‌های تخفیف‌خورده × تعداد؛ تخفیف از اختلاف قیمت قدیم و جدید محاسبه می‌شود.
export function summarize(items){return items.reduce((s,{product,qty})=>({subtotal:s.subtotal+product.oldPrice*qty,discount:s.discount+Math.max(0,product.oldPrice-product.price)*qty,total:s.total+product.price*qty,count:s.count+qty}),{subtotal:0,discount:0,total:0,count:0})}
export const money=(value,lang='fa')=>new Intl.NumberFormat(lang==='fa'?'fa-IR':'en-US').format(value);
