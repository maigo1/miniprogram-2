let ajaxTimes=0;
export const request=(params)=>{
    ajaxTimes++;
    //显示加载中的 效果
    wx.showLoading({
        title: "加载中",
        mask: true
     
    });
    // 定义公共的yrl
    const baseUrl="https://api-hmugo-web.itheima.net/api/public/v1"
    return new Promise((resolve,reject)=>{
        wx.request({
            ...params,
            url:baseUrl+params.url,
            success:(result)=>{
               resolve(result.data.message);
            },
            fail:(err)=>{
                reject(err);
            },
            complete:()=>{
                ajaxTimes--;
                //关闭正在等待的图标
                if(ajaxTimes===0){
                    wx.hideLoading();
                }
                
            }
        });
    })
}