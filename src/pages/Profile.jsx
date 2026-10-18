import {useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import {UserRound,Package,ChevronDown,Pencil,CheckCircle2,LogOut} from 'lucide-react';
import {useStore} from '../context/StoreContext';
import {money} from '../services/pricing';

// اطلاعات نمایشی فرم از نشست کاربر خوانده می‌شود و پس از ذخیره فوراً به‌روز می‌شود.
export default function Profile(){
 const {lang,orders,user,updateProfile,logout}=useStore();const fa=lang==='fa';
 const [expanded,setExpanded]=useState(null),[editing,setEditing]=useState(false),[error,setError]=useState(''),[success,setSuccess]=useState(false);
 const [form,setForm]=useState({firstName:user?.firstName||'',lastName:user?.lastName||'',phone:user?.phone||''});
 useEffect(()=>{setForm({firstName:user?.firstName||'',lastName:user?.lastName||'',phone:user?.phone||''})},[user]);
 function save(e){e.preventDefault();setError('');setSuccess(false);try{updateProfile(form);setEditing(false);setSuccess(true)}catch(err){setError(err.message==='exists'?(fa?'این شماره قبلاً ثبت شده است.':'This number is already registered.'):err.message==='phone'?(fa?'شماره موبایل باید ۱۱ رقم و با 09 شروع شود.':'Enter an 11-digit mobile number starting with 09.'):fa?'اطلاعات را بررسی کن.':'Please check the information.')}}
 const myOrders=orders.filter(o=>!o.userId||o.userId===user?.id);
 return <div className="container-main min-h-[65vh] py-10">
  <h1 className="mb-7 text-3xl font-black">{fa?'پروفایل من':'My profile'}</h1>
  <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
   <div className="flex flex-wrap items-center justify-between gap-4">
    <div className="flex items-center gap-4"><div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary/10"><UserRound size={30} className="text-primary"/></div><div><h2 className="text-xl font-black">{[user?.firstName,user?.lastName].filter(Boolean).join(' ')|| (fa?'کاربر دکون':'Dekon user')}</h2><p className="mt-1 text-sm text-slate-500" dir="ltr">{user?.phone}</p></div></div>
    <button type="button" onClick={()=>{setEditing(x=>!x);setError('');setSuccess(false)}} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white"><Pencil size={17}/>{editing?(fa?'انصراف':'Cancel'):(fa?'ویرایش پروفایل':'Edit profile')}</button>
   </div>
   {success&&<p role="status" className="mt-5 flex items-center gap-2 text-sm font-bold text-emerald-600"><CheckCircle2 size={18}/>{fa?'اطلاعات حساب با موفقیت ذخیره شد.':'Profile updated successfully.'}</p>}
   {editing&&<form onSubmit={save} className="mt-7 grid gap-4 border-t border-slate-200 pt-6 dark:border-white/10 sm:grid-cols-2">
    {[['firstName',fa?'نام':'First name'],['lastName',fa?'نام خانوادگی':'Last name'],['phone',fa?'شماره موبایل':'Mobile number']].map(([key,label])=><label key={key} className="grid gap-2 text-sm font-bold">{label}<input required dir={key==='phone'?'ltr':undefined} inputMode={key==='phone'?'tel':undefined} value={form[key]} onChange={e=>setForm(v=>({...v,[key]:e.target.value}))} className="rounded-xl border border-slate-200 bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-white/20"/></label>)}
    {error&&<p role="alert" className="text-sm text-red-500 sm:col-span-2">{error}</p>}
    <div className="sm:col-span-2"><button className="rounded-xl bg-primary px-6 py-3 font-bold text-white">{fa?'ذخیره تغییرات':'Save changes'}</button></div>
   </form>}
  </section>
  <div className="mb-7 flex flex-wrap items-center justify-between gap-4"><h2 className="flex items-center gap-2 text-xl font-black"><Package className="text-primary"/>{fa?'سفارش‌های من':'My orders'}</h2><button onClick={logout} className="flex items-center gap-2 text-sm font-semibold text-red-500"><LogOut size={17}/>{fa?'خروج از حساب':'Sign out'}</button></div>
  {!myOrders.length?<div className="rounded-3xl border border-slate-200 p-10 text-center dark:border-white/10"><p className="mb-5">{fa?'هنوز سفارشی ثبت نکرده‌ای':'No orders yet'}</p><Link to="/shop" className="text-primary">{fa?'مشاهده محصولات':'Browse products'}</Link></div>:<div className="space-y-4">{myOrders.map(order=><article key={order.id} className="rounded-3xl border border-slate-200 p-5 dark:border-white/10"><button className="flex w-full items-center justify-between gap-3 text-start" onClick={()=>setExpanded(expanded===order.id?null:order.id)}><div><p className="font-bold" dir="ltr">{order.id}</p><p className="mt-2 text-xs text-slate-500">{new Date(order.createdAt).toLocaleString(fa?'fa-IR':'en-US')}</p></div><div className="flex items-center gap-3"><span className="rounded-xl bg-amber-500/10 px-3 py-2 text-xs font-bold text-amber-600">{fa?'در حال پردازش (نمایشی)':'Processing (demo)'}</span><ChevronDown size={18}/></div></button>{expanded===order.id&&<div className="mt-5 border-t border-slate-200 pt-5 dark:border-white/10"><div className="space-y-3">{order.items.map(item=><div key={item.id} className="flex items-center gap-3"><img src={item.image} alt="" className="h-16 w-16 rounded-xl object-cover"/><div className="flex-1 text-sm">{fa?item.titleFa:item.titleEn}<p className="text-slate-500">{money(item.qty,lang)} × {money(item.price,lang)}</p></div></div>)}</div><p className="mt-5 text-sm">{fa?'گیرنده':'Recipient'}: {order.address.fullName}</p><p className="mt-2 text-sm text-slate-500">{order.address.province}، {order.address.city}، {order.address.street}</p><p className="mt-4 font-black text-primary">{fa?'مبلغ پرداختی آزمایشی':'Demo paid amount'}: {money(order.total,lang)} {fa?'تومان':'Toman'}</p></div>}</article>)}</div>}
 </div>
}
