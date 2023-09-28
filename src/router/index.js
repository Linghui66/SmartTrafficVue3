import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path:"/",
      component: () => import("../views/logon/LogOnView.vue")
    },
    {
      path:"/login",
      name:"login",
      component: () => import("../views/logon/LogOnView.vue")
    },
    {
      path:"/home",
      name:"home",
      component: () => import("../views/home/HomeView.vue"),
      beforeEnter: (to, from) => {
        if(!localStorage.getItem('token')){
            return {
                name:"login"
            }
        }
    }
    },
]
})
// router.beforeEach(async (to,from,next)=>{
    // var auth =localStorage.getItem('token');
    // if(to.path=='/home'){
    //   if(auth){
        // router.push("/home")
    //   }else{
        // next()
    //   }
    // }else{
    //   if(auth){
        // next();
    //   }else{
        // router.push("/login")
    //   }
    // }
//   })
export default router
