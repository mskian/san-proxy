function saveOptions() {
    const apiurl = document.querySelector('#apiurl').value;
    var re = /^([a-z0-9\-]+\.)+[a-z0-9]+\:[1-9][0-9]+$/i;
    if (apiurl == 0) {
        const apiurl = document.getElementById('save');
        apiurl.innerHTML = '<b>Socks Porxy IP and Port is Missing</b>';
    } else if (!re.test(apiurl)) {
        console.log('Enter a Valid IP');
        const apiurl = document.getElementById('save');
        apiurl.innerHTML = '<b>Enter a Valid IP with Port</b>';
        return false;
    } else {
        chrome.storage.sync.set({
            apiurl
        }, () => {
            restoreOptions();
            const apiurl = document.getElementById('save');
            apiurl.classList.add('loading');
            setTimeout(() => {
                apiurl.classList.remove('loading');
                apiurl.innerHTML = '<b>Settings Saved<b>';
            }, 1000);
            setTimeout(() => {
                chrome.extension.getBackgroundPage().window.location.reload();
                window.location.reload();
            }, 2000);
        });
    }
}

function clear() {
    document.getElementById('apiurl').value = '';
    const connect = document.getElementById('connection');
    connect.innerHTML = '<P><b>Disbaling the proxy Connection...<b><p>';
    setTimeout(() => {
        chrome.storage.sync.get(['apiurl'], function(result) {
            console.log('Current Value is ' + result.apiurl);
        });
        chrome.storage.sync.remove('apiurl');
        var config = {
            mode: "direct",
        }
        chrome.proxy.settings.set({
                value: config,
                scope: 'regular'
            },
            function() {});
        chrome.extension.getBackgroundPage().window.location.reload();
        window.location.reload();
    }, 2000);
}

function restoreOptions() {
    chrome.storage.sync.get({
        apiurl: []
    }, result => {
        if (document.getElementById('apiurl') != null) {
            document.getElementById('apiurl').value = result.apiurl;
        }
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
var el = document.getElementById('save');
if (el) {
    el.addEventListener('click', saveOptions);
}
var gc = document.getElementById('form');
if (gc) {
    gc.addEventListener('submit', ev => {
        ev.preventDefault();
        saveOptions();
        document.getElementById('apiurl').focus();
    });
}

if (document.getElementById('clear') != null) {
    document.getElementById('clear').addEventListener('click', clear);
}