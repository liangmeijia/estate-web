import Vue from "vue"
import Vuex from "vuex"
import router ,{resetRouter}from "../router"
import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex)

function addNewRouter(menus) {
    console.log("---------原始菜单---------",menus)
    let routes=router.options.routes
    console.log("---------路由---------",routes)
    routes.forEach(routeItem=>{
        if(routeItem.path === "/Index"){
            menus.forEach(menu=>{
                // if(menu.menuCode){
                //
                // }
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
// function addNewRouter(menus,menuTree) {
//     console.log("原始菜单数据:", menus);
//
//     // 构建路由树
//     // let menuTree = buildMenuTree(menus);
//
//     console.log("构建的菜单树:", menuTree);
//
//     // 获取当前路由配置
//     let routes = router.options.routes;
//     console.log("动态路由:", routes);
//
//     routes.forEach(routeItem => {
//         if (routeItem.path === "/Index") {
//             // 将生成的菜单树添加到对应的父路由下
//             menuTree.forEach(menu => {
//                 let newRoute = createRoute(menu);
//                 routeItem.children.push(newRoute);
//             });
//         }
//     });
//
//     resetRouter(); // 重置路由，确保新路由生效
//     router.addRoutes(routes); // 动态添加新路由
// }
/**
 * 构建菜单树
 * @param {Array} menus 菜单数据
 * @returns {Array} 菜单树
 */
function buildMenuTree(menus) {
    const menuMap = {};
    const menuTree = [];

    // 初始化菜单映射表
    menus.forEach(menu => {
        menuMap[menu.menuCode] = { ...menu, children: [] };
    });

    // 构建树形结构
    menus.forEach(menu => {
        if (Number(menu.menuLevel) === 1) {
            // 一级菜单
            menuTree.push(menuMap[menu.menuCode]);
        } else if (Number(menu.menuLevel) > 1) {
            // 二级或更深层级菜单，挂载到父级
            const parent = menuMap[menu.menuParentCode];
            if (parent) {
                parent.children.push(menuMap[menu.menuCode]);
            }
        }
    });

    return menuTree;
}

/**
 * 创建路由
 * @param {Object} menu 菜单对象
 * @returns {Object} 路由对象
 */
// function createRoute(menu) {
//     return {
//         path: "/" + menu.menuClick,
//         name: menu.menuClick,
//         meta: {
//             title: menu.menuName,
//         },
//         component: () => import("../components/" + menu.menuComponent),
//         children: menu.children.map(child => createRoute(child)) // 递归生成子路由
//     };
// }
const store = new Vuex.Store({
    state: {
        menus: [],
        menuTree:[]
    },
    mutations: {
        setMenu(state,menus) {
            state.menus = menus;
            state.menuTree = buildMenuTree(menus);
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
        },
        getMenuTree(state){
            return state.menuTree;
        }
    },
    plugins:[createPersistedState()]
});

export default store;