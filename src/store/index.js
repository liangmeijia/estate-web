import Vue from "vue"
import Vuex from "vuex"
import router ,{resetRouter}from "../router"
import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex)

function addNewRouter(menus) {
    console.log(menus)
    let routes=router.options.routes
    console.log(routes)
    routes.forEach(routeItem=>{
        if(routeItem.path === "/Index"){
            menus.forEach(menu=>{
                let newRoute =   {
                    path: '/'+menu.menuClick,
                    name: menu.menuClick,
                    meta:{
                        title: menu.menuName
                    },
                    component:()=>import('../components/'+menu.menuComponent)
                }
                routeItem.children.push(newRoute)
            })
        }
    })
    resetRouter()
    router.addRoutes(routes)
}

const store = new Vuex.Store({
    state: {
        menus: []
    },
    mutations: {
        setMenu(state,menus) {
            state.menus = menus;
            addNewRouter(menus);
        },
        setRouter(state,menus) {
            //添加动态路由
            addNewRouter(menus);
        }
    },
    getters: {
        getMenu(state) {
            return state.menus;
        }
    },
    plugins:[createPersistedState()]
});

export default store;