// این سرویس شبیه‌ساز پرداخت است؛ هیچ تراکنش بانکی انجام نمی‌دهد.
export const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
export async function simulatePayment(){await wait(2800);return {success:true,reference:`DEMO-${Date.now()}`};}
export function makeOrder({items,address,subtotal,discount,total}){return {id:`DK-${Date.now()}`,createdAt:new Date().toISOString(),status:'processing',items:items.map(({product,qty})=>({id:product.id,titleFa:product.titleFa,titleEn:product.titleEn,image:product.image,qty,price:product.price,oldPrice:product.oldPrice})),address,subtotal,discount,total};}
