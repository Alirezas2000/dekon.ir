// سرویس آزمایشی حساب‌ها. در نسخه نهایی تمام عملیات باید در بک‌اند انجام شوند.
// توجه: ذخیره رمز عبور در مرورگر ناامن است؛ از رمز واقعی استفاده نکنید.
const KEY='dekon-demo-users';
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY))||[]}catch{return []}};
export const normalizePhone=phone=>String(phone).replace(/[۰-۹]/g,c=>String('۰۱۲۳۴۵۶۷۸۹'.indexOf(c))).replace(/[٠-٩]/g,c=>String('٠١٢٣٤٥٦٧٨٩'.indexOf(c))).replace(/\s|-/g,'');
export function register({firstName,lastName,phone,password}){
 const users=read();phone=normalizePhone(phone);
 if(users.some(x=>x.phone===phone))throw Error('exists');
 const user={id:crypto.randomUUID(),firstName:firstName.trim(),lastName:lastName.trim(),phone};
 users.push({...user,password});localStorage.setItem(KEY,JSON.stringify(users));return user;
}
export function signIn({phone,password}){
 const match=read().find(x=>x.phone===normalizePhone(phone)&&x.password===password);
 if(!match)throw Error('invalid');const {password:_,...user}=match;return user;
}
// ویرایش پروفایل با شناسه ثابت انجام می‌شود تا تاریخچه حساب محفوظ بماند.
export function updateDemoProfile(userId,{firstName,lastName,phone}){
 const users=read();const index=users.findIndex(x=>x.id===userId);
 if(index<0)throw Error('not-found');
 phone=normalizePhone(phone);
 if(!/^09\d{9}$/.test(phone))throw Error('phone');
 if(!firstName.trim()||!lastName.trim())throw Error('name');
 if(users.some(x=>x.phone===phone&&x.id!==userId))throw Error('exists');
 const updated={...users[index],firstName:firstName.trim(),lastName:lastName.trim(),phone};
 users[index]=updated;localStorage.setItem(KEY,JSON.stringify(users));
 const {password:_,...safeUser}=updated;return safeUser;
}
