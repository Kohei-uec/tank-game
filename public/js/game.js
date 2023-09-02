//js for game.html page

//戻るボタンを禁止
//一度ページをアクティブにする必要あり
window.addEventListener("popstate", function (e) {
    history.pushState(null, null, null);
    return;
});
history.pushState(null, null, null);