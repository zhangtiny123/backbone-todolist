var DAN_MU_APP = {};
DAN_MU_APP.timestamp = null;
DAN_MU_APP.dan_mus = [];
DAN_MU_APP.interval_for_barrage_appear = -1;
DAN_MU_APP.interval_for_fetch_data = -1;
DAN_MU_APP.cache_comment = [];

DAN_MU_APP.getSelfInput = function(e) {
    var input = $("#comment_input");
    if (e.which !== 13 || !input.val().trim()) { // ENTER_KEY = 13
        return;
    }

    var comment = {};
    comment.content = input.val().trim();
    comment.position = Math.floor(Math.random() * 3);
    comment.color = $("[name='font-color']")[0].value.trim() || "#ffffff";
    comment.font_size = $("[name='font-size']")[0].value.trim() || "0";
    DAN_MU_APP.cache_comment.push(comment);
    input.val('');
    saveBarrageData();
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
    if (DAN_MU_APP.cache_comment.length !== 0) {
        DAN_MU_APP.dan_mus.push(DAN_MU_APP.cache_comment.pop())
    }
    var data = DAN_MU_APP.dan_mus.pop();
    if (data !== undefined) {
        if(data.size == "1"){
            data.size ="25";
        }else{data.size="15";}
        var span = "<span style=\"position:absolute;color:"+data.color+";font-size:"+data.size+"px;transform:translate(0," + data.position * 50 + "px);animation:my_move 10s linear 1;\">" + data.content + "</span>";
        var danMuParent = $("#dan_mu_parent");
        $(span).appendTo(danMuParent);
        danMuParent.on('webkitAnimationEnd oanimationend msAnimationEnd animationend', "span", function () {
            this.remove();
        });
    }
}

function getBarrageData() {
    //var url = 'http://10.29.2.253:8080/casaDS/barrage/get_barrages.ds?listingId='+$("#emailListingIdFragment")[0].value+"&timestamp"+DAN_MU_APP.timestamp;
    var url = 'http://10.29.2.253:8080/casaDS/barrage/get_barrages.ds?listingId=22000053';
    $.ajax({
        type: 'GET',
        url: url,
        async: false,
        dataType: 'jsonp',
        jsonpCallback: 'jsonCallback',
        contentType: "application/json",
        success: function (response) {
            DAN_MU_APP.timestamp = response.timestamp;
            DAN_MU_APP.dan_mus = response.results.concat(DAN_MU_APP.dan_mus);
        }

    });
}

function saveBarrageData() {
    var url = 'http://10.29.2.253:8080/casaDS/barrage/add_barrage.ds?listingId='+$("#emailListingIdFragment")[0].value+"&dataType=1&content="+DAN_MU_APP.cache_comment[0].text+"&position="+DAN_MU_APP.cache_comment[0].position+"&color"+DAN_MU_APP.cache_comment[0].color+"&size"+DAN_MU_APP.cache_comment[0].font_size;
    $.ajax({
        type: 'GET',
        url: url,
        async: false,
        dataType: 'jsonp',
        jsonpCallback: 'jsonCallback',
        contentType: "application/json",
        success: function (result) {
            DAN_MU_APP.dan_mus = DAN_MU_APP.dan_mus.concat(result.results);
        }
    });
}

DAN_MU_APP.start_dan_mu = function() {
    $("#dan_mu_parent").removeAttr("hidden");
    getBarrageData();
    DAN_MU_APP.interval_for_barrage_appear = setInterval(function () {
        start();
    }, 1000);
    DAN_MU_APP.interval_for_fetch_data = setInterval(function () {
        getBarrageData();
    }, 10000);
};

DAN_MU_APP.stop_dan_mu = function() {
    var parent = $("#dan_mu_parent");
    parent.find("span").remove();
    parent.attr("hidden", "hidden");
    clearInterval(DAN_MU_APP.interval_for_barrage_appear);
    clearInterval(DAN_MU_APP.interval_for_fetch_data);
};
