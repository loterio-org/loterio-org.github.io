function unixToDate(unixTime) {
    let date = new Date(unixTime * 1000);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    return day + '/' + month + '/' + year + ' ' + hours + ':' + minutes + ':' + seconds;
}

export {unixToDate}