import {useEffect,useState} from 'react';
import {Link,useParams} from 'react-router-dom';
import {ArrowLeft,ArrowRight,ShoppingBag,Star,Truck,ShieldCheck,Minus,Plus} from 'lucide-react';
import {getProductById} from '../services/products';
import {useStore} from '../context/StoreContext';

// شناسه محصول از آدرس /product/:id خوانده می‌شود؛ این کامپوننت از فایل JSON مستقیماً خبر ندارد.
export default function ProductDetail(){
 const {id}=useParams();
 const {lang,addToCart}=useStore();
 const fa=lang==='fa';
 const [product,setProduct]=useState(null);
 const [loading,setLoading]=useState(true);
 const [activeImage,setActiveImage]=useState(0);
 const [qty,setQty]=useState(1);
 const [message,setMessage]=useState('');
 // هنگام تغییر شناسه، محصول جدید را از لایه سرویس می‌گیریم؛ بعداً سرویس با API جایگزین می‌شود.
 useEffect(()=>{let alive=true;setLoading(true);setActiveImage(0);setQty(1);setMessage('');getProductById(id).then(data=>{if(alive){setProduct(data);setLoading(false)}}).catch(()=>{if(alive){setProduct(null);setLoading(false)}});return()=>{alive=false}},[id]);
 if(loading)return <div className="container-main py-24 text-center">{fa?'در حال بارگذاری...':'Loading...'}</div>;
 if(!product)return <div className="container-main py-24 text-center"><h1 className="text-2xl font-black">{fa?'محصول پیدا نشد':'Product not found'}</h1><Link to="/shop" className="mt-6 inline-block text-primary">{fa?'بازگشت به فروشگاه':'Back to shop'}</Link></div>;
 const title=fa?product.titleFa:product.titleEn;
 const images=product.images?.length?product.images:[product.image];
 const money=n=>new Intl.NumberFormat(fa?'fa-IR':'en-US').format(n);
 const discount=product.oldPrice>product.price?Math.round((1-product.price/product.oldPrice)*100):0;
 const Arrow=fa?ArrowLeft:ArrowRight;
 return <div className="container-main py-8 sm:py-12">
  <div className="mb-7 flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400"><Link to="/">{fa?'خانه':'Home'}</Link><span>/</span><Link to="/shop">{fa?'فروشگاه':'Shop'}</Link><span>/</span><span className="font-semibold text-primary">{title}</span></div>
  <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
   <div><div className="relative aspect-square overflow-hidden rounded-[28px] bg-slate-100 dark:bg-[#20243a]"><img src={images[activeImage]} alt={title} className="h-full w-full object-cover"/>{discount>0&&<span className="absolute start-5 top-5 rounded-xl bg-coral px-3 py-2 text-sm font-bold text-white">{money(discount)}%</span>}</div><div className="mt-3 grid grid-cols-4 gap-3">{images.map((img,index)=><button key={index} onClick={()=>setActiveImage(index)} aria-label={`${fa?'تصویر':'Image'} ${index+1}`} className={`aspect-square overflow-hidden rounded-2xl border-2 ${index===activeImage?'border-primary':'border-transparent'}`}><img src={img} alt={`${title} ${index+1}`} className="h-full w-full object-cover"/></button>)}</div></div>
   <div><div className="mb-3 text-xs font-bold uppercase tracking-widest text-coral">{product.brand} · {product.sku}</div><h1 className="text-2xl font-black leading-relaxed sm:text-4xl">{title}</h1><div className="mt-4 flex items-center gap-2 text-sm"><Star size={17} fill="#FF941F" color="#FF941F"/><strong>{product.rating}</strong><span className="text-slate-400">({money(product.reviews)} {fa?'نظر':'reviews'})</span></div><p className="mt-6 leading-9 text-slate-600 dark:text-slate-300">{fa?product.descriptionFa:product.descriptionEn}</p>
    <div className="mt-6 flex flex-wrap items-baseline gap-3"><strong className="text-3xl font-black text-primary">{money(product.price)} <span className="text-base">{fa?'تومان':'Toman'}</span></strong>{product.oldPrice>product.price&&<span className="text-sm text-slate-400 line-through">{money(product.oldPrice)}</span>}</div>
    <p className="mt-3 text-sm font-semibold text-emerald-600">{product.stock>0?(fa?`${money(product.stock)} عدد موجود`:`${product.stock} in stock`):(fa?'ناموجود':'Out of stock')}</p>
    <div className="mt-6 flex flex-wrap items-center gap-3"><div className="flex h-12 items-center gap-4 rounded-2xl border border-slate-200 px-3 dark:border-white/20"><button aria-label="Decrease" onClick={()=>setQty(q=>Math.max(1,q-1))}><Minus size={17}/></button><strong>{money(qty)}</strong><button aria-label="Increase" onClick={()=>setQty(q=>Math.min(product.stock,q+1))}><Plus size={17}/></button></div><button disabled={product.stock===0} onClick={()=>{addToCart(product.id,qty);setMessage(fa?'به سبد خرید اضافه شد':'Added to cart')}} className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-5 font-bold text-white hover:bg-primary-dark disabled:opacity-50"><ShoppingBag size={19}/>{fa?'افزودن به سبد خرید':'Add to cart'}</button></div>{message&&<p role="status" className="mt-3 text-sm font-semibold text-emerald-600">{message}</p>}
    <div className="mt-8 grid gap-3 rounded-2xl bg-slate-50 p-5 text-sm dark:bg-white/5"><div className="flex items-center gap-3"><Truck className="text-primary"/>{fa?'ارسال سریع (نمایشی)':'Fast delivery (demo)'}</div><div className="flex items-center gap-3"><ShieldCheck className="text-primary"/>{fa?'خرید امن (نمایشی)':'Secure checkout (demo)'}</div></div>
   </div>
  </div>
  <section className="mt-14 grid gap-8 rounded-[28px] border border-slate-100 p-6 dark:border-white/10 md:grid-cols-2"><div><h2 className="mb-5 text-xl font-black">{fa?'ویژگی‌های محصول':'Product features'}</h2><ul className="space-y-3 text-slate-600 dark:text-slate-300">{(fa?product.featuresFa:product.featuresEn)?.map((feature,index)=><li key={index} className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-accent"/>{feature}</li>)}</ul></div><div><h2 className="mb-5 text-xl font-black">{fa?'مشخصات':'Specifications'}</h2><div className="divide-y divide-slate-100 dark:divide-white/10">{product.specifications?.map((item,index)=><div key={index} className="flex justify-between gap-5 py-3 text-sm"><span className="text-slate-500">{fa?item.labelFa:item.labelEn}</span><strong>{fa?(item.valueFa??item.value):(item.valueEn??item.value)}</strong></div>)}</div></div></section>
  <Link to="/shop" className="mt-8 inline-flex items-center gap-2 font-bold text-primary"><Arrow size={18}/>{fa?'مشاهده محصولات دیگر':'Explore more products'}</Link>
 </div>;
}
