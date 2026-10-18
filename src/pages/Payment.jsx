import {useEffect,useRef,useState} from 'react';
import {Link,useLocation,useNavigate} from 'react-router-dom';
import {CreditCard,LockKeyhole} from 'lucide-react';
import {useStore} from '../context/StoreContext';
import {getProducts} from '../services/products';
import {money,summarize} from '../services/pricing';
import {makeOrder,simulatePayment} from '../services/checkout';
export default function Payment(){
 const {lang,cart,placeOrder}=useStore(),fa=lang==='fa',navigate=useNavigate(),location=useLocation();
 const [products,setProducts]=useState([]),[processing,setProcessing]=useState(false);const started=useRef(false);
 useEffect(()=>{getProducts().then(setProducts)},[]);
 const items=cart.map(item=>({qty:item.qty,product:products.find(p=>String(p.id)===String(item.id))})).filter(x=>x.product),sum=summarize(items);
 const address=location.state?.address;
 // پرداخت فقط شبیه‌سازی است. در نسخه واقعی سفارش را بک‌اند بعد از تأیید درگاه ثبت می‌کند.
 const pay=async()=>{if(started.current||!address||!items.length||items.length!==cart.length)return;started.current=true;setProcessing(true);try{const result=await simulatePayment();if(result.success){const order=makeOrder({items,address,...sum});placeOrder(order);navigate(`/payment/success/${order.id}`,{replace:true})}}catch{setProcessing(false);started.current=false}};
 return <div className="container-main flex min-h-[65vh] items-center justify-center py-12"><div className="w-full max-w-lg rounded-[30px] border border-slate-200 p-8 text-center shadow-xl dark:border-white/10"><div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary"><CreditCard size={34}/></div><h1 className="text-2xl font-black">{fa?'درگاه پرداخت آزمایشی':'Demo payment gateway'}</h1><p className="mt-3 text-sm text-coral">{fa?'هیچ مبلغی دریافت نمی‌شود و اطلاعات کارت لازم نیست.':'No money is charged. No card details required.'}</p>{!address||!cart.length?<Link to="/cart" className="mt-8 block text-primary">{fa?'بازگشت به سبد خرید':'Return to cart'}</Link>:<><div className="my-8 rounded-2xl bg-slate-50 p-5 text-2xl font-black text-primary dark:bg-white/5">{money(sum.total,lang)} <span className="text-sm">{fa?'تومان':'Toman'}</span></div><button disabled={processing||items.length!==cart.length} onClick={pay} className="w-full rounded-2xl bg-primary py-4 font-bold text-white disabled:opacity-60">{processing?(fa?'در حال پردازش پرداخت...':'Processing payment...'):(fa?'پرداخت موفق آزمایشی':'Simulate successful payment')}</button><p className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-500"><LockKeyhole size={15}/>{fa?'نمایش آموزشی؛ بدون اتصال بانکی':'Demo only — no banking integration'}</p></>}</div></div>
}
