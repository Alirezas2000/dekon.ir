import {Navigate,useLocation} from 'react-router-dom';
import {useStore} from '../context/StoreContext';
// مسیر مورد درخواست را نگه می‌داریم تا پس از ورود به همان صفحه برگردیم.
export function RequireAuth({children}){
 const {user}=useStore();const location=useLocation();
 if(!user)return <Navigate to="/auth" replace state={{from:location.pathname+location.search,reason:'protected'}}/>;
 return children;
}
