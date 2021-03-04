/* promise 形式 getSetting */
export const getSetting=()=>{
    return new Promise((resolve,reject)=>{
        wx.getSetting({
            success: (result)=>{
                resolve(result);
            },
            fail: (err)=>{
                reject(err);
            },
        });
    })
}

/* promise 形式 chooseAddress */
export const chooseAddress=()=>{
    return new Promise((resolve,reject)=>{
        wx.chooseAddress({
            success: (result)=>{
                resolve(result);
            },
            fail: (err)=>{
                reject(err);
            },
        });
    })
}

/* promise 形式 openSetting */
export const openSetting=()=>{
    return new Promise((resolve,reject)=>{
        wx.openSetting({
            success: (result)=>{
                resolve(result);
            },
            fail: (err)=>{
                reject(err);
            }
        });
    })
}
/**
 * promise 形式 showModal
 * @param {object} param0 
 */
export const showModal=({content})=>{
    return new Promise((resolve,reject)=>{
        wx.showModal({
            title: '提示',
            content: content,
            success :(res)=> {
/*               if (res.confirm) {
                cart.splice(index);
                this.setCart(cart);
              } else if (res.cancel) {
                console.log('用户点击取消')
              } */
              resolve(res);
            },
            fail:(err)=>{
                reject(err);
            }
          })

    })
}

/**
 * promise 形式 showToast
 * @param {object} param0 
 */
export const showToast=({title})=>{
    return new Promise((resolve,reject)=>{
        wx.showToast({
            title: title,
            icon: 'none',
            success :(res)=> {
              resolve(res);
            },
            fail:(err)=>{
                reject(err);
            }
          })

    })
}
/**
 * 
 * promise 形式 login
 */
export const login=()=>{
    return new Promise((resolve,reject)=>{
        wx.login({
            timeout:10000,
            success: (result)=>{
              resolve(result);
            },
            fail:(err)=>{
                reject(err);
            }
          })

    })
}
/**
 * promise 形式的微信支付
 * @param {object} pay 支付所必要的参数
 */
export const requestPayment=(pay)=>{
    return new Promise((resolve,reject)=>{

        wx.requestPayment({
            //解构参数
            ...pay,
            success: (result)=>{
                resolve(result)
            },
            fail: ()=>{
                reject(err)
            }
        });

    })
}

