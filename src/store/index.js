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
                if (menu.menuCode && menu.menuCode.startsWith('A')) {
                    // 如果 menuCode 以 'A' 开头为下拉一级菜单不生成路由，跳过此次循环
                    return; // continue 效果
                }
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

const store = new Vuex.Store({
    state: {
        menus: [],
        menuTree:[],
        selectedUserId: null
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
        },
        setSelectedUserId(state, id) {
            //保存选择的用户id,用于用户详情查看
            state.selectedUserId = id;
        }
    },
    getters: {
        getMenu(state) {
            return state.menus;
        },
        getMenuTree(state){
            return state.menuTree;
        },
        getSelectedUserId(state){
            return state.selectedUserId;
        }
    },
    plugins:[createPersistedState()]
});

export default store;