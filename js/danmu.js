var DAN_MU_APP = {};
var dan_mus = [{"text": "hahahaha", "id":"1", "color": "red", "size": "0", "position": "0"},
    {"text": "233333", "id":"2", "color": "red", "size": "0", "position": "2"}, {
        "text": "poi",
        "id": "13",
        "color": "red",
        "size": "1",
        "position": "1"
    },
    {"text": "2333", "id":"3", "color": "#FFFFFF ", "size": "0", "position": "0"}, {
        "text": "XXX真好",
        "id":"4",
        "color": "#FFFFFF ",
        "size": "0",
        "position": "2"
    }, {"text": "你个傻叉", "id":"5", "color": "red", "size": "0", "position": "0"},
    {"text": "233333", "id":"6", "color": "red", "size": "0", "position": "2"}, {
        "text": "切",
        "id":"7",
        "color": "red",
        "size": "1",
        "position": "1"
    },
    {"text": "2333", "id":"8", "color": "#FFFFFF ", "size": "0", "position": "0"}, {
        "text": "每一他",
        "id":"14",
        "color": "#FFFFFF ",
        "size": "0",
        "position": "2"
    }, {"text": "人生哈", "id":"9", "color": "red", "size": "0", "position": "0"},
    {"text": "233333", "id":"15", "color": "red", "size": "0", "position": "2"}, {
        "text": "asdfe",
        "id":"10",
        "color": "red",
        "size": "1",
        "position": "1"
    },
    {"text": "2333", "id":"11", "color": "#FFFFFF ", "size": "0", "position": "0"}, {
        "text": "asdfafeqewtqg",
        "id":"12",
        "color": "#FFFFFF ",
        "size": "0",
        "position": "2"
    }];

DAN_MU_APP.cache_comment = [];
DAN_MU_APP.refreshId = -1;

DAN_MU_APP.getCommentsFromServer = function() {
    return dan_mus;
};

DAN_MU_APP.getSelfInput = function(e) {
    var input = $("#comment_input");
    if (e.which !== 13 || !input.val().trim()) { // ENTER_KEY = 13
        return;
    }

    var comment = {};
    comment.text = input.val().trim();
    comment.position = Math.floor(Math.random() * 3);

    DAN_MU_APP.cache_comment.push(comment);
    input.val('');
};

$("#comment_input").on("keypress", function(e) {
    DAN_MU_APP.getSelfInput(e);
});

$(".switch_button").on("click", function() {
    if($(this).position().top === 0) {
        $(this).text("BULLET OFF");
        $(this).css({
            "background-color": "gray",
            "color": "black",
            "top": 180
        });
        DAN_MU_APP.start_dan_mu();
    }
    else {
        $(this).text("BULLET ON");
        $(this).css({
            "background-color": "greenyellow",
            "color": "red",
            "top": 0
        });
        DAN_MU_APP.stop_dan_mu();
    }
});

function start() {
    var commentForShow = DAN_MU_APP.getCommentsFromServer();
    if (DAN_MU_APP.cache_comment.length !== 0) {
        commentForShow.push(DAN_MU_APP.cache_comment.pop())
    }
    var data = commentForShow.pop();
    if (data !== undefined) {
        var span = "<span style=\"position:absolute;transform:translate(0," + data.position * 50 + "px);animation:my_move 10s linear 1;\">" + data.text + "</span>";
        var danMuParent = $("#dan_mu_parent");
        $(span).appendTo(danMuParent);
        danMuParent.on('webkitAnimationEnd oanimationend msAnimationEnd animationend', "span", function () {
            this.remove();
        });
    }
}

DAN_MU_APP.start_dan_mu = function() {
    $("#dan_mu_parent").removeAttr("hidden");
    DAN_MU_APP.refreshId = setInterval(function () {
        start();
    }, 1000);
};

DAN_MU_APP.stop_dan_mu = function() {
    var parent = $("#dan_mu_parent");
    parent.find("span").remove();
    parent.attr("hidden", "hidden");
    clearInterval(DAN_MU_APP.refreshId);
};
