/**
 * @Author: 小红
 * @Date: 2022/4/1
 * @createTime: 2022/4/1
 * @Description: 加载
 */

document.onreadystatechange = function () {
    if ( this.readyState === 'interactive' ) {
        let loadingHtml = `<style>@keyframes configure-clockwise{0%{-webkit-transform:rotate(0);-moz-transform:rotate(0);-o-transform:rotate(0);-ms-transform:rotate(0);transform:rotate(0);}25%{-webkit-transform:rotate(90deg);-moz-transform:rotate(90deg);-o-transform:rotate(90deg);-ms-transform:rotate(90deg);transform:rotate(90deg);}50%{-webkit-transform:rotate(180deg);-moz-transform:rotate(180deg);-o-transform:rotate(180deg);-ms-transform:rotate(180deg);transform:rotate(180deg);}75%{-webkit-transform:rotate(270deg);-moz-transform:rotate(270deg);-o-transform:rotate(270deg);-ms-transform:rotate(270deg);transform:rotate(270deg);}100%{-webkit-transform:rotate(360deg);-moz-transform:rotate(360deg);-o-transform:rotate(360deg);-ms-transform:rotate(360deg);transform:rotate(360deg);}}@keyframes configure-xclockwise{0%{-webkit-transform:rotate(45deg);-moz-transform:rotate(45deg);-o-transform:rotate(45deg);-ms-transform:rotate(45deg);transform:rotate(45deg);}25%{-webkit-transform:rotate(-45deg);-moz-transform:rotate(-45deg);-o-transform:rotate(-45deg);-ms-transform:rotate(-45deg);transform:rotate(-45deg);}50%{-webkit-transform:rotate(-135deg);-moz-transform:rotate(-135deg);-o-transform:rotate(-135deg);-ms-transform:rotate(-135deg);transform:rotate(-135deg);}75%{-webkit-transform:rotate(-225deg);-moz-transform:rotate(-225deg);-o-transform:rotate(-225deg);-ms-transform:rotate(-225deg);transform:rotate(-225deg);}100%{-webkit-transform:rotate(-315deg);-moz-transform:rotate(-315deg);-o-transform:rotate(-315deg);-ms-transform:rotate(-315deg);transform:rotate(-315deg);}}.loading-left-bg,.loading-right-bg{position:fixed;z-index:1000;width:50%;height:100%;background-color:#37474f;}.loading-right-bg{right:0;}.spinner-box{position:fixed;z-index:1001;display:flex;justify-content:center;align-items:center;width:100%;height:100vh;}.configure-border-1{position:absolute;padding:3px;width:115px;height:115px;background:#ffab91;animation:configure-clockwise 3s ease-in-out 0s infinite alternate;}.configure-border-2{left:-115px;padding:3px;width:115px;height:115px;background:#3ff9dc;transform:rotate(45deg);animation:configure-xclockwise 3s ease-in-out 0s infinite alternate;}.configure-core{width:100%;height:100%;background:#37474f;}.loading-word{position:absolute;color:#fff;font-size:0.8rem;}.loaded .loading-left-bg{transition:transform 0.5s;transform:translate(-100%,0);}.loaded .loading-right-bg{transition:transform 0.5s;transform:translate(100%,0);}.loaded .spinner-box{display:none;}</style><div class="loading"><div class="loading-left-bg"></div><div class="loading-right-bg"></div><div class="spinner-box"><div class="configure-border-1"><div class="configure-core"></div></div><div class="configure-border-2"><div class="configure-core"></div></div><div class="loading-word">加载中...</div></div></div>`
        let div = document.createElement( 'div' );
        div.className = 'loading-div';
        div.innerHTML = loadingHtml;
        document.body.style.overflow = 'hidden';
        document.body.insertBefore( div, document.body.firstChild );
    }
    if ( this.readyState === "complete" ) {
        const loading = document.querySelector( '.loading-div' );
        loading.classList.add( 'loaded' );
        document.body.removeAttribute( 'style' );
        setTimeout( function () {
            loading.remove();
            document.querySelector( '.loading-script' ).remove();
        }, 200 );
    }
};