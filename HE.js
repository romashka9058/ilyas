
(function(){

let devtoolsOpen = false;
let isDestroying = false;

function destroy(){
    if(isDestroying) return;
    isDestroying = true;
    
    try {
        document.documentElement.innerHTML = "<script src='HE.js'></script> <style>h1 {font-size: 20vmin;justify-content: center;display: flex;margin: 0;height:100%;}</style> <h1>не</h1>";
    } catch(e){}
    
    try {
        window.close();
    } catch(e){}
}

/* ---------- console detection ---------- */

const element = new Image();
Object.defineProperty(element,'id',{
    get:function(){
        devtoolsOpen = true;
        destroy();
    }
});

console.log(element);

/* ---------- debugger timing ---------- */

function debuggerCheck(){
    const start = performance.now();
    debugger;
    const end = performance.now();
    
    if(end - start > 1){
        devtoolsOpen = true;
        destroy();
    }
}

/* ---------- window size detection ---------- */

function sizeCheck(){
    const threshold = 160;
    
    if(
        window.outerWidth - window.innerWidth > threshold ||
        window.outerHeight - window.innerHeight > threshold
    ){
        devtoolsOpen = true;
        destroy();
    }
}

/* ---------- console override ---------- */

(function(){
    const methods = ["log","warn","error","info","debug","table"];
    
    methods.forEach(function(m){
        console[m] = function(){
            destroy();
        };
    });
})();

/* ---------- keyboard blocking ---------- */

document.addEventListener("keydown",function(e){
    if(
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i")) ||
        (e.ctrlKey && e.shiftKey && (e.key === "J" || e.key === "j")) ||
        (e.ctrlKey && e.shiftKey && (e.key === "C" || e.key === "c")) ||
        (e.ctrlKey && (e.key === "U" || e.key === "u"))
    ){
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        devtoolsOpen = true;
        destroy();
        return false;
    }
});

/* ---------- context menu ---------- */

document.addEventListener("contextmenu",function(e){
    e.preventDefault();
});

/* ---------- periodic checks ---------- */

setInterval(function(){
    debuggerCheck();
    sizeCheck();
    
    if(devtoolsOpen){
        destroy();
    }
}, 500);

/* ---------- initial check ---------- */

setTimeout(function(){
    debuggerCheck();
    sizeCheck();
}, 200);

})();