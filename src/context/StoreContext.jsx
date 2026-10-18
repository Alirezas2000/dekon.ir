import {createContext,useContext,useEffect,useMemo,useState} from 'react';
import {getProductById} from '../services/products';
import {updateDemoProfile} from '../services/auth';
const StoreContext=createContext(null);
// داده‌های نمایشی در localStorage نگهداری می‌شوند. در نسخه واقعی این توابع به API منتقل خواهند شد.
const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}};
export function StoreProvider({children}){
 const [user,setUser]=useState(()=>read('dekon-session',null));
 const login=userData=>{setUser(userData);localStorage.setItem('dekon-session',JSON.stringify(userData))};
 // پس از ویرایش، هم حساب آزمایشی و هم نشست فعال به‌روزرسانی می‌شوند.
 const updateProfile=fields=>{if(!user)throw Error('not-found');const updated=updateDemoProfile(user.id,fields);login(updated);return updated};
 const logout=()=>{setUser(null);localStorage.removeItem('dekon-session');setCart([])};
 const [theme,setTheme]=useState(()=>read('dekon-theme','light'));
 const [lang,setLang]=useState(()=>read('dekon-lang','fa'));
 const [cart,setCart]=useState(()=>read('dekon-cart',[]));
 const [orders,setOrders]=useState(()=>read('dekon-orders',[]));
 const [favorites,setFavorites]=useState(()=>read('dekon-favorites',[]));
 useEffect(()=>{document.documentElement.classList.toggle('dark',theme==='dark');localStorage.setItem('dekon-theme',JSON.stringify(theme))},[theme]);
 useEffect(()=>{document.documentElement.lang=lang;document.documentElement.dir=lang==='fa'?'rtl':'ltr';localStorage.setItem('dekon-lang',JSON.stringify(lang))},[lang]);
 useEffect(()=>localStorage.setItem('dekon-cart',JSON.stringify(cart)),[cart]);
 useEffect(()=>localStorage.setItem('dekon-orders',JSON.stringify(orders)),[orders]);
 useEffect(()=>localStorage.setItem('dekon-favorites',JSON.stringify(favorites)),[favorites]);
 // تعداد را محدود به موجودی می‌کنیم؛ این کنترل در بک‌اند هم باید تکرار شود.
 const setQuantity=async(id,qty)=>{const product=await getProductById(id);if(!product)return;setCart(old=>qty<=0?old.filter(x=>String(x.id)!==String(id)):old.some(x=>String(x.id)===String(id))?old.map(x=>String(x.id)===String(id)?{...x,qty:Math.min(Math.max(1,qty),product.stock)}:x):[...old,{id,qty:Math.min(Math.max(1,qty),product.stock)}])};
 const addToCart=(id,qty=1)=>setCart(old=>{const item=old.find(x=>String(x.id)===String(id));return item?old.map(x=>String(x.id)===String(id)?{...x,qty:x.qty+qty}:x):[...old,{id,qty}]});
 const removeFromCart=id=>setCart(old=>old.filter(x=>String(x.id)!==String(id)));
 const toggleFavorite=id=>setFavorites(old=>old.includes(id)?old.filter(x=>x!==id):[...old,id]);
 const placeOrder=(order)=>{setOrders(old=>[order,...old]);setCart([])};
 const value=useMemo(()=>({user,login,logout,updateProfile,theme,setTheme,lang,setLang,cart,orders,addToCart,setQuantity,removeFromCart,placeOrder,favorites,toggleFavorite,cartCount:cart.reduce((s,x)=>s+x.qty,0)}),[user,theme,lang,cart,orders,favorites]);
 return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
export const useStore=()=>useContext(StoreContext);
