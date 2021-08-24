import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        cartList: []
    },
    mutations: {
        addCart (state, payload) {
            return new Promise((resolve, reject) => {
                let oldProduct = null;
                for (let item of state.cartList) {
                    if (item.iid == payload.iid) {
                        oldProduct = item;
                    }
                }
                if (oldProduct) {
                    oldProduct.count += 1
                    // reject('当前的商品数量+1')
                } else {
                    payload.checked = true
                    payload.count = 1
                    state.cartList.push(payload)
                    // resolve('添加了新的商品')
                }
                // resolve('当前的商品数量+1')
            })

        }

    },
    getters
})

export default store