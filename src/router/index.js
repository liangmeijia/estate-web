import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter)

const routes=[
    {
        path:'/',
        name:'login',
        component:()=>import('../components/Login')
    },
    {
        path:'/Register',
        name:'register',
        component:()=>import('../components/Register')
    },
    {
        path:'/Index',
        name:'index',
        component:()=>import('../components/Index'),
        children:[
            {
                path:'/Home',
                name:'home',
                meta:{
                    title:'首页'
                },
                component:()=>import('../components/Home')
            }
        ]
    }
]

const router=new VueRouter({
    mode:'history',
    routes
})
export function resetRouter(){
    router.matcher= new VueRouter({
        mode:'history',
        routes:[]
    }).matcher
}
const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(to){
    return VueRouterPush.call(this,to).catch(err=>err)
}
export default router;