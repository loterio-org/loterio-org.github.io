const clock = ['/', '-', '\\', '|'];
const loadingText = ['Loading', 'Loading.', 'Loading..','Loading...'];

var loading = {};

function clockAnimation(element) {
    loadingAnimation(element, 150, clock);
}

function loadingTextAnimation(element) {
    loadingAnimation(element, 300, loadingText);
}

function loadingAnimation(element, interval, animation){
    clearInterval(loading[element.id]);
    let index = 0;
    loading[element.id] = setInterval(() => {
        if(index >= animation.length) index = 0;
        element.innerHTML = animation[index++];
    }, interval)
}

function finishLoadingAnimation(element){
    clearInterval(loading[element.id]);
    if (loading.length == 0) loading = {};
    element.innerHTML = '';
}


export{clockAnimation, loadingTextAnimation, finishLoadingAnimation}