import axios from 'axios';
import { MessageBox } from 'element-ui';
import md5 from 'blueimp-md5';
// import {
//     AIGUILLE_FABRIC
// } from '~compJs/const';
// ajax请求封装
// axios.defaults.baseURL = process.env.HOST ? 'http://' + process.env.HOST + ':' + process.env.PORT : '';
axios.defaults.headers.common['Token'] = sessionStorage.getItem('token') || ''; // 设置请求头token
// 精简版ajax
class $v {
    static get(url, json, success) {
        // get请求中判断传参除了pageInfo（params也除外）字段外其他字段中是否为对象类型，是就改成post请求
        let isPost = false;
        for (let i in json) {
            if (i !== 'pageInfo' && i !== 'params' && i !== 'headers' && json[i].constructor === Object) {
                isPost = true;
            }
        }
        if (isPost) { // 转成post请求，并控制台输出警告
            console.log(`%c '${url}':当前地址为get请求,因为入参属性中有json对象,所以转为post请求。`, 'background-color: #fffbe5; color: #5c3c00; border: 1px #fff5c2 solid');
            $v.post(url, json, success);
            return;
        }
        // 判断结束
        // 判断传参
        let config = {};
        if (typeof json === 'object') {
            if (json.params) {
                config = json;
            } else {
                config.params = json;
            }
            config.params = $v.commonParam({
                method: 'get',
                data: config.params
            });
        }
        if (typeof (json) === 'function') {
            success = json;
            config.params = $v.commonParam({
                method: 'get',
                data: config.params
            });
        }
        // 发送请求
        return axios.get(url, config).then((d) => {
            // 调用处理结果函数
            $v.resultHandle(d, success, url);
        }).catch((catchError) => {
            $v.resultHandle(catchError, success, url);
        })
    }
    static post(url, json, success) {
        // 判断传参
        let data = {};
        let config = {};
        if (typeof (json) === 'object') {
            if (json.data) {
                data = json.data;
                delete json.data;
                config = json;
            } else {
                data = json;
            }
        }
        if (typeof (json) === 'function') {
            success = json;
        }
        // 发送请求
        return axios.post($v.commonParam({
            method: 'post',
            url: url
        }), $v.commonParam({
            method: 'post',
            data: data
        }), config).then((d) => {
            // 调用处理结果函数
            $v.resultHandle(d, success, url);
        }).catch((catchError) => {
            $v.resultHandle(catchError, success, url);
        })
    }
    // 设置出入公共参数
    static commonParam({
        method,
        data,
        url
    }) {
        if (data) {
            let obj = data;
            if (method === 'get') {
                // get请求时，入参属性值为数组时转成字符传入，入参属性名为pageInfo时，转成点值传入
                for (let i in obj) {
                    if (obj[i].constructor === Array) {
                        obj[i] = String(obj[i]);
                    }
                }
                if (obj.pageInfo) {
                    for (let i in obj.pageInfo) {
                        obj[`pageInfo.${i}`] = obj.pageInfo[i];
                    }
                    delete obj.pageInfo;
                }
            }
            // 生成MD5
            const key = md5(JSON.stringify(obj));
            obj.key = key;
            return obj;
        }
        if (url) {
            return url;
        }
    }
    // 处理ajax请求成功结果
    static resultHandle(d, success, url) {
        // 系统错误提示
        if (d.response && [400, 401].indexOf(Number(d.response.status)) === -1) {
            PromptBox.common({
                title: '提示',
                message: '系统错误',
                moreMessage: `url: ${url} </br> message: ${d.message}`,
                type: 'error'
            })
            // 判断去掉loading
            // let elm = document.querySelector('.el-loading-mask.is-fullscreen');
            // if (elm) {
            //     elm.parentNode.removeChild(elm);
            // }
            if (window.vm && window.vm.$loading) {
                window.vm.$loading().close();
            }
            return;
        }
        // 页面错误提示
        if (d.message && d.response === undefined) {
            PromptBox.common({
                title: '提示',
                message: '页面错误',
                moreMessage: `url: ${url} </br> message: ${d.message}`,
                type: 'error'
            })
            // 控制台输出具体错误内容
            console.error(d);
            // 判断去掉loading
            // let elm = document.querySelector('.el-loading-mask.is-fullscreen');
            // if (elm) {
            //     elm.parentNode.removeChild(elm);
            // }
            if (window.vm && window.vm.$loading) {
                window.vm.$loading().close();
            }
            return;
        }
        // 登录超时，跳转到登录页面
        if (d.response && d.response.status === 401) {
            // 清除本地缓存
            sessionStorage.clear();
            location.href = 'login.html';
        }
        let data = null;
        let headers = null;
        let isOk = '';
        if (d.response) {
            // console.log('fail------------------');
            // console.log(d.response);
            data = d.response.data;
            headers = d.response.headers;
            headers.status = d.response.status;
            isOk = false;
        } else {
            // console.log('success------------------');
            // console.log(d);
            data = d.data;
            headers = d.headers;
            headers.status = d.status;
            isOk = true;
        }
        // 新规范，200状态码就是成功，直接返回数据（因为以前返回数据结构有data，所以返回需要加上）
        if (success) {
            // success({
            //     data,
            //     headers,
            //     isOk,
            //     url
            // })
            success(data)
        }
    }
}

class PromptBox {
    static success({
        title,
        message,
        moreMessage,
        res,
        type
    }) {
        type = 'success';
        return PromptBox.common({
            title: title || '提示',
            message: message || (res ? res.msg ? res.msg : '请求成功' : '请求成功'),
            moreMessage: moreMessage || '',
            type
        })
    }
    static fail({
        title,
        message,
        moreMessage,
        res,
        type
    }) {
        type = 'error';
        return PromptBox.common({
            title: title || '提示',
            message: message || (res ? res.msg ? res.msg : '请求失败' : '请求失败'),
            moreMessage: moreMessage || '',
            type
        })
    }
    static common({
        title,
        message,
        moreMessage,
        type,
        showCancelButton,
        showConfirmButton,
        cancelButtonText,
        confirmButtonText,
        callback
    }) {
        // <button class="el-button el-button--primary el-button--small">更多 <i class="el-icon-caret-bottom"></i></button>
        return MessageBox({
            customClass: 'common_prompt_box_style',
            dangerouslyUseHTMLString: true,
            modal: false,
            // type,
            title: title,
            message: `
                <style>
                    .el-message-box__wrapper[aria-label="${title}"]{
                        background-color: rgba(0,0,0,.5);
                        z-index: 9999 !important;
                    }
                </style>
                <div class="msg_box">
                    <div class="el-message-box__status el-icon-${type}"></div>
                    <div class="msg_content">${message}</div>
                    <i class="switch_btn el-icon-arrow-down" style="${moreMessage ? '' : 'display: none;'}" onclick="
                        if(this.className.indexOf('el-icon-arrow-down') >= 0) {
                            this.className = 'switch_btn el-icon-arrow-up';
                            this.parentNode.nextElementSibling.style.height = 'auto';
                        }else {
                            this.className = 'switch_btn el-icon-arrow-down';
                            this.parentNode.nextElementSibling.style.height = 0;
                        }
                    "></i>
                </div>
                <div class="more_msg_box collapse-transition">${moreMessage}</div>
            `,
            showCancelButton: showCancelButton || false,
            showConfirmButton: showConfirmButton || false,
            cancelButtonText: cancelButtonText || '',
            confirmButtonText: confirmButtonText || '',
            callback
        }).catch(() => {})
    }
}


// 图片转为base64
class imgSrcTo {
    // img为传入img标签dom对象，getData为回调函数返回base64串
    static base64(img, getData) {
        let canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, img.width, img.height);
        getData(canvas.toDataURL())
    }
}


// 检测当前浏览器端
class CurrBrowser {
    static get() {
        var browser = {
            versions: (function () {
                var u = navigator.userAgent;
                // var app = navigator.appVersion;
                return { // 移动终端浏览器版本信息
                    trident: u.indexOf('Trident') > -1, // IE内核
                    presto: u.indexOf('Presto') > -1, // opera内核
                    webKit: u.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
                    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1, // 火狐内核
                    mobile: !!u.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
                    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
                    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, // android终端或uc浏览器
                    iPhone: u.indexOf('iPhone') > -1, // 是否为iPhone或者QQHD浏览器
                    iPad: u.indexOf('iPad') > -1, // 是否iPad
                    webApp: u.indexOf('Safari') === -1 // 是否web应该程序，没有头部与底部
                };
            })(),
            language: (navigator.browserLanguage || navigator.language).toLowerCase()
        }
        if (browser.versions.mobile) { // 判断是否是移动设备打开。browser代码在下面
            // return 'mobile';
            var ua = navigator.userAgent.toLowerCase(); // 获取判断用的对象
            if (ua.match(/MicroMessenger/i) === 'micromessenger') {
                // 在微信中打开
                return 'WX';
            }
            if (ua.match(/WeiBo/i) === 'weibo') {
                // 在新浪微博客户端打开
            }
            if (ua.match(/QQ/i) === 'qq') {
                // 在QQ空间打开
            }
            if (browser.versions.ios) {
                // 是否在IOS浏览器打开
                return 'WAP';
            }
            if (browser.versions.android) {
                // 是否在安卓浏览器打开
                return 'WAP';
            }
            return 'APP';
        } else {
            // 否则就是PC浏览器打开
            return 'PC';
        }
    }
    static getpc() {
        var sys = {};
        var ua = navigator.userAgent.toLowerCase();
        var s;
        // (s = ua.match(/edge\/([\d.]+)/)) ? sys.edge = s[1]:
        //     (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? sys.ie = s[1] :
        //     (s = ua.match(/msie ([\d.]+)/)) ? sys.ie = s[1] :
        //     (s = ua.match(/firefox\/([\d.]+)/)) ? sys.firefox = s[1] :
        //     (s = ua.match(/chrome\/([\d.]+)/)) ? sys.chrome = s[1] :
        //     (s = ua.match(/opera.([\d.]+)/)) ? sys.opera = s[1] :
        //     (s = ua.match(/version\/([\d.]+).*safari/)) ? sys.safari = s[1] : 0;
        if (sys.edge) {
            return {
                broswer: 'Edge',
                version: sys.edge
            }
        };
        if (sys.ie) {
            return {
                broswer: 'IE',
                version: sys.ie
            }
        };
        if (sys.firefox) {
            return {
                broswer: 'Firefox',
                version: sys.firefox
            }
        };
        if (sys.chrome) {
            return {
                broswer: 'Chrome',
                version: sys.chrome
            }
        };
        if (sys.opera) {
            return {
                broswer: 'Opera',
                version: sys.opera
            }
        };
        if (sys.safari) {
            return {
                broswer: 'Safari',
                version: sys.safari
            }
        };
        return {
            broswer: '',
            version: '0'
        };
    }
}


// 根据年份、月份判断当前月的天数
let CountDay = (month, year) => {
    var dayNum = 0;
    switch (month) {
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:
        dayNum = 31;
        break;
    case 4:
    case 6:
    case 9:
    case 11:
        dayNum = 30;
        break;
    case 2:
        if (/^\d+$/.test(year / 100)) {
            if (/^\d+$/.test(year / 400)) {
                dayNum = 29;
            } else {
                dayNum = 28;
            }
        } else {
            if (/^\d+$/.test(year / 4)) {
                dayNum = 29;
            } else {
                dayNum = 28;
            }
        }
        break;
    }
    return dayNum;
}


// 根据树结构查找对应数据
class TreeData {
    /*
     * data: 遍历的数据
     * labelVal: 匹配内容
     * label: 匹配内容的key字段
     * children: 子集的key字段
     * treeStr: 字段匹配内容的连接的字符串，不传则使用label为匹配
     * callback: 匹配成功后的回调函数
     * currTree: 匹配内容的连接的字符串
     * totalArr: 总数据
     * */
    static get({
        data,
        labelVal,
        label,
        children,
        treeStr,
        callback
    }, currTree = '', totalArr = []) {
        if (!data) {
            return;
        }
        if (totalArr.length === 0) {
            totalArr = data;
        }
        data.map((item) => {
            if (item[label] === labelVal) {
                // 当前最顶层父级所有数据
                let currTotalObj = {};
                // 当前最顶层父级匹配的内容
                let tree = '';
                if (currTree === '') {
                    tree = String(item[treeStr || label]);
                } else {
                    tree = currTree;
                }
                totalArr.map((item2) => {
                    if (item2[treeStr || label] === tree.split('$&&$')[0]) {
                        currTotalObj = item2;
                    }
                })
                // 成功后返回数据: 当前对应的对象、当前同级的所有数据（数组返回）、当前最顶层父级所有数据、匹配内容的连接的字符串
                if (callback) {
                    callback(item, data, currTotalObj, currTree + item[treeStr || label]);
                }
            } else {
                let trees = currTree + item[treeStr || label] + '$&&$';
                TreeData.get({
                    data: item[children],
                    labelVal,
                    label,
                    children,
                    treeStr,
                    callback
                }, trees, totalArr);
            }
        })
    }
}


// 获取url中的参数
class GetUrlPara {
    static get(name) {
        // 构造一个含有目标参数的正则表达式对象
        let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
        // 匹配目标参数
        let r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURIComponent(r[2]);
        // 返回参数值
        return null;
    }
}


// 日期转换
class DateFormat {
    static get(val) {
        let y = val.getFullYear();
        let m = ('0' + (val.getMonth() + 1)).substr(-2);
        let d = ('0' + val.getDate()).substr(-2);
        return `${y}-${m}-${d}`;
    }
    static getFull(val) {
        let date = DateFormat.get(val);
        // 获取小时数(0-23)
        let hou = ('0' + val.getHours()).substr(-2);
        // 获取分钟数(0-59)
        let min = ('0' + val.getMinutes()).substr(-2);
        // 获取秒数(0-59)
        let sec = ('0' + val.getSeconds()).substr(-2);
        return `${date} ${hou}:${min}:${sec}`
    }
    static getBeginMonth(val) {
        let y = val.getFullYear();
        let m = ('0' + (val.getMonth() + 1)).substr(-2);
        return `${y}-${m}-01`;
    }
}

// sessionStorage操作
class Session {
    static set(name, val) {
        sessionStorage.setItem(name, val);
    }
    static get(name) {
        return sessionStorage.getItem(name);
    }
    static remove(name) {
        sessionStorage.removeItem(name);
    }
    static clear() {
        sessionStorage.clear();
    }
}

// localStorage操作
class Local {
    static set(name, val) {
        localStorage.setItem(name, val);
    }
    static get(name) {
        return localStorage.getItem(name);
    }
    static remove(name) {
        localStorage.removeItem(name);
    }
    static clear() {
        localStorage.clear();
    }
}


// 右侧内容区滚动条回滚到顶部
class ScrollbarTo {
    static top(num) {
        let bar = ScrollbarTo.getScrollBar();
        bar.scrollTop = num || 0;
    }
    static getScrollBar() {
        return window.document.querySelector('.content_r .default_layout_scrollbar > .el-scrollbar__wrap');
    }
}


// 滚动条滑动缓冲动画效果 -- elem(滚动目标元素), direction('top'/'left'), num(滚动距离) 必传参数 -- speed(滚动速度), cb(滚动完成回调函数) 选填参数
let scrollAnimate = function (elem, direction, num, speed, cb) {
    if (!elem || !direction || !String(num)) {
        return false;
    }
    // 首字母大写
    direction = direction.toLowerCase().replace(/\b[a-z]/g, word => word.toUpperCase());
    // 判断选填入参
    if (typeof speed === 'function') {
        cb = speed;
        speed = null;
    }
    let timer;
    let speeds = speed || 4;
    let isAdd = true; // 默认向右、向下滑动
    // 向左、向上滑动
    if (num < elem[`scroll${direction}`]) {
        isAdd = false;
    }
    timer = setInterval(() => {
        // 通过元素的当前srcoll值，获取下次滚动距离，产生缓冲动画
        let speed = Math.ceil((!isAdd ? elem[`scroll${direction}`] : (num - elem[`scroll${direction}`])) / speeds);
        // 获取元素下次滚动的scroll值
        let count = elem[`scroll${direction}`] + (isAdd ? speed : -speed);
        // 判断下次滚动的scroll值是否超过目标值(num值)
        if ((isAdd && count >= num) || (!isAdd && count <= num)) {
            elem[`scroll${direction}`] = num;
            clearInterval(timer);
            if (cb) {
                cb() 
            }
            return;
        }
        elem[`scroll${direction}`] += (isAdd ? speed : -speed);
        if (elem[`scroll${direction}`] === num) {
            clearInterval(timer);
            if (cb) {
                cb() 
            }
        }
    }, 30)
}
// 非空对象的属性转换，当对象为undefined
class ObjPublic {
    /**
     * 传入参数：
     *      第一种：(obj,keys) obj:原对象 keys：根据对象获取的key值 例：（{a:'1',b:{c:{d:'2'}}},'b.c.d'）
     *      第二种: (obj,key,key,key,...) obj:原对象 key:一个key代表一个对象内响应取值key  例：（{a:'1',b:{c:{d:'2'}}},'b','c'',d'）
     */
    static notNull() {
        let length = arguments.length;
        let obj = null;
        let retObj = '';
        let keys = null;
        if (length === 2) {
            obj = arguments[0];
            keys = arguments[1].split('.');
        } else if (length > 2) {
            obj = arguments[0];
            keys = JSON.parse(JSON.stringify(arguments))
            delete keys[0]
        }
        for (let i in keys) {
            let key = keys[i]
            if (retObj == null) {
                retObj = '';
                break;
            } else {
                if (retObj === '') {
                    retObj = obj[key];
                } else {
                    retObj = retObj[key]
                }
            }
        }
        if (retObj == null) {
            retObj = '';
        }
        return retObj;
    }
}
export {
    $v,
    ObjPublic,
    PromptBox,
    CurrBrowser,
    CountDay,
    TreeData,
    GetUrlPara,
    DateFormat,
    Session,
    Local,
    imgSrcTo,
    ScrollbarTo,
    scrollAnimate
}