let username = "utk";
let password = "123456";
var lastInner = ".dashboard-page";
var windowCur = false;
var onWaitId = null;


$(document).ready(function() {
    $(".marvel-device").hide();

    $(".popup-smoke").hide();
    $(".window-popup-smoke").hide();
    $(".window-popup-btn").hide();
    $(".window-popup-info").hide();

    $(".window").hide();
    $(".inside-content").hide();
    $(".main-page").hide();
    $(".loading-page").hide();
    $(".buy-page").hide();
    $(".sell-page").hide();

    currentTime();

    $(".dashboard-button").addClass("button-active");

    $(document).keyup(function(event) {
        if (event.keyCode == 13) { // enter
            $(".marvel-device").fadeIn("normal");
        } else if (event.keyCode == 27) {
            $(".marvel-device").fadeOut("normal");
        }
    });

    $(".popup-smoke").click(function(event) {
        if (event.target.classList[0] == "popup-smoke") {
            $(".popup-smoke").fadeOut("fast");
        }
    });

    $(".window-popup-smoke").click(function(event) {
        if (event.target.classList[0] == "window-popup-smoke") {
            $(".window-popup-smoke").fadeOut("fast");
            setTimeout(function() {
                $(".window-popup-btn").hide();
                $(".window-popup-info").hide();
            }, 500);
        }
    });
});

function closeButton() {
    $(".marvel-device").fadeOut("normal");
    $.post("http://utk_smugglerjob/laptopClose", JSON.stringify({}));
    setTimeout(function() {
        $(".window").hide();
        $(".inside-content").hide();
        $(".main-page").hide();
        $(".loading-page").hide();
    }, 1000)
};

function openWindow() {
    if (windowCur == false) {
        windowCur = true;
        $(".inside-content").show();
        $(".window").show(10);
    } else if (windowCur == true) {
        windowCur = "min";
        $(".window").hide(200);
    } else if (windowCur == "min") {
        windowCur = true;
        $(".window").show(200);
    }
    
};

function minWindow() {
    if (windowCur == "min") {
        windowCur = true;
        $(".window").show(200);
    } else if (windowCur == true) {
        windowCur = "min";
        $(".window").hide(200);
    }
};

function closeWindow() {
    windowCur = false;
    $(".window").hide(10);
    lastInner = ".dashboard-page";
    setTimeout(function() {
        $(".main-page").hide();
        $(".inside-content").show();
        $(".dashboard-page").show();
        $(".buy-page").hide();
        $(".sell-page").hide();
        $(".dashboard-button").addClass("button-active");
        $(".buy-button").removeClass("button-active");
        $(".sell-button").removeClass("button-active");

    }, 200);
    $(".password-input").val("");
};

function loginButton() {
    if ($(".username-input")[0].value.length > 0) {
        if ($(".password-input")[0].value.length > 0) {
            var user = $(".username-input")[0].value;
            var pass = $(".password-input")[0].value;
            //$.post("http://utk_smugglerjob/loginAttempt", JSON.stringify({username: user, password: pass}));

            if (user == username) {
                if (pass == password) {
                    window.postMessage({msg: "loginOutcome", outcome: 0}, window)
                } else {
                    window.postMessage({msg: "loginOutcome", outcome: 2}, window)
                }
            } else {
                window.postMessage({msg: "loginOutcome", outcome: 1}, window)
            }
        } else {
            popupAlert("You need to enter your password.");
        }
    } else {
        popupAlert("You need to enter your username.");
    } /* 
    $(".inside-content").fadeOut("normal");
    $(".main-page").fadeIn("normal");
    */
};

function popupClose() {
    $(".popup-smoke").fadeOut("fast");
};

function cancelButton() {
    $(".window-popup-smoke").fadeOut("fast");
    setTimeout(function() {
        $(".window-popup-btn").hide();
        $(".window-popup-info").hide();
    }, 500);
};

function confirmButton() {
    $(".window-popup-smoke").fadeOut("fast");
    if (onWaitId == "sell") {
        $.post("http://utk_smugglerjob/ConfrimSell", JSON.stringify()) // start sell event here!
        onWaitId = null;
    } else if (onWaitId != null) {
        $.post("http://utk_smugglerjob/ConfirmBuy", JSON.stringify({name: onWaitId})) // start buy event here!
        onWaitId = null;
    } else {
        popupAlert("Network error! Please try again later.");
        onWaitId = null;
    }
    
}

function dashboardButton() {
    if (lastInner != ".dashboard-page") {
        $(".dashboard-button").addClass("button-active");
        $(".buy-button").removeClass("button-active");
        $(".sell-button").removeClass("button-active");
        $(lastInner).fadeOut("fast");
        $(".dashboard-page").fadeIn("fast");
        lastInner = ".dashboard-page";
    }
};

function buyButton() {
    if (lastInner != ".buy-page") {
        $(".buy-button").addClass("button-active");
        $(".dashboard-button").removeClass("button-active");
        $(".sell-button").removeClass("button-active");
        $(lastInner).fadeOut("fast");
        $(".buy-page").fadeIn("fast");
        lastInner = ".buy-page";
    }
};

function sellButton() {
    if (lastInner != ".sell-page") {
        $(".sell-button").addClass("button-active");
        $(".dashboard-button").removeClass("button-active");
        $(".buy-button").removeClass("button-active");
        $(lastInner).fadeOut("fast");
        $(".sell-page").fadeIn("fast");
        lastInner = ".sell-page";
    }
}

function buyGood(id) {
    onWaitId = id;
    $(".window-popup-btn").show();
    $(".window-popup-smoke").fadeIn("fast");
};

function sellGoods() {
    onWaitId = "sell";
    $(".window-popup-btn").show();
    $(".window-popup-smoke").fadeIn("fast");
}

function currentTime() {
    var date = new Date();
    var hour = date.getHours();
    var min = date.getMinutes();
    var month = date.getMonth();
    var monthDay = date.getDate();
    var year = date.getFullYear();
    hour = updateTime(hour);
    min = updateTime(min);
    document.getElementById("date").innerText = updateTime(monthDay) + "/" + updateTime(month) + "/" + year + " " + hour + ":" + min;
    setTimeout(function() { currentTime() }, 60000);
};

function updateTime(k) {
    if (k < 10) {
        return "0" + k;
    }
    else {
        return k;
    }
};

function popupAlert(header) {
    $("#window-popup-header").html(header);
    $(".window-popup-info").show();
    $(".window-popup-smoke").fadeIn("fast");
};

// start of lua listeners

window.addEventListener('message', function(event) {
    if (event.data == "showLaptop") {
        $(".marvel-device").fadeIn("fast");
    } else if (event.data.msg == "loginOutcome") {
        if (event.data.outcome == 0) {
            $(".loading-page").fadeIn("normal");
            $(".inside-content").fadeOut("normal");
            setTimeout(function() {
                $(".loading-page").fadeOut("normal");
                $(".main-page").fadeIn("normal");
            }, 3000)
        } else if (event.data.outcome == 1) {
            popupAlert("Wrong username!");
        } else {
            popupAlert("Wrong password!");
        }   
    } else if (event.data.msg == "build") {
        $("#inside-username").html(event.data.obj.username);
        $(".wh-text").html(event.data.obj.warehouse_name);
        document.getElementById("capacity").style.background = 'linear-gradient(to right, green 0%, green ' + event.data.obj.capacity + '%, #e9e9e9 ' + event.data.obj.capacity + '%, #e9e9e9 100%)';
        document.getElementById("profit").style.background = 'linear-gradient(to right, green 0%, green ' + event.data.obj.profit + '%, #e9e9e9 ' + event.data.obj.profit + '%, #e9e9e9 100%)';
        $("#total-earnings").html("$" + event.data.obj.total_earnings);
        $("#total-sales").html(event.data.obj.total_sales);
        for (i = 1; i < 10; i++) {
            $("#g-" + i).html("$" + event.data.obj.prices[i]);
        };
        $("#total-worth-value").html("$" + event.data.obj.total_worth);
        $("#total-bonus-value").html("$" + event.data.obj.total_bonus);
        $("#max-slot-h3").html(event.data.obj.max_slot);
        $("#used-slot-h3").html(event.data.obj.used_slot);
        $("#empty-slot-h3").html(event.data.obj.empty_slot);
        $(".items-list").empty();
        for (n = 0; n < (event.data.obj.max_slot); n++) {
            if (n == event.data.obj.max_slot) {
                $(".items-list").append($('<h3>Slot ' + (n+1) + ': </h3><h3 id="i-' + (n+1) + '">' + event.data.obj.slots[n] + '</h3><br><br>'));
            } else {
                $(".items-list").append($('<h3>Slot ' + (n+1) + ': </h3><h3 id="i-' + (n+1) + '">' + event.data.obj.slots[n] + '</h3><br>'));
            };
        };
    }
});