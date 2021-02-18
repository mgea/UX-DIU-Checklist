$(document).ready(function() {

    // For button width animation we need a set max-width
	$('.buy-banner--wrapper--is-folded').find('.buy-banner--button').css({
		'maxWidth' : $('.buy-banner--wrapper--is-folded').find('.buy-banner--button').outerWidth()
	});
    
    // slideup / down the banner
    $('#buy-banner-toggle').on('click', function(e) {
        $('#buy-banner').toggleClass('buy-banner--wrapper--is-folded buy-banner--wrapper--is-unfolded');
        e.preventDefault();
    });

    $(":checkbox").labelauty({
        label: false
    });
    $("#print").on('click', function() {
        ga('send', 'event', 'print', 'click', 'print');
        window.print();
    });
    $("#reset").on('click', function() {
        ga('send', 'event', 'reset', 'click', 'reset');
        $('input:checkbox').each(function() {
            $(this).prop('checked', false);
        });
        if (useGarlic) {
            $("#checklist-form").garlic('destroy');
        }
    });
    $("#footer a").on('click', function(e) {
        var elm = e.currentTarget;
        ga('send', 'event', 'footer', $(elm).attr('id'));
    });
    $("input:checkbox").on('change', function(e) {
        var cb = $(this);
        var id = cb.attr('id');
        var isChecked = cb.is(':checked');
        ga('send', 'event', {
            'eventCategory': 'checkbox',
            'eventAction': isChecked ? 'set' : 'clear',
            'eventLabel': id
        });
    });

    $('.open-popup-link').magnificPopup({
        type: 'inline',
        midClick: true,
        callbacks: {
            open: function() {
                ga('send', 'event', 'popup', 'open', $(this.content).attr('id'));
                if ($(this)[0].currItem.src === "#delete-modal") {
                    $('body').on('keydown', function(e) {
                        var code = e.keyCode || e.which;
                        if (code == 13) { //Enter keycode
                            $("#confirm-delete").trigger("click");
                        }
                    });
                }
            },
            close: function() {
                ga('send', 'event', 'popup', 'close', $(this.content).attr('id'));
                if ($(this)[0].currItem.src === "#delete-modal") {
                    $('body').off('keydown');
                }
            }
        }
    });
});

var useGarlic = false;

//realtime api
var defaultTitle = "UXchecklist";
var checkboxes = {};
var view = null;
var controller = null;

var log = (document.location.hostname == "localhost" && Function.prototype.bind) ?
    Function.prototype.bind.call(console.log, console) :
    function() {};

var renameProject = function(newTitle) {
    ga('send', 'event', 'rename', 'rename', 'rename');
    controller.rename(newTitle, function(newTitle) {
        controller.start(newTitle);
    });
};

$().ready(function() {
    var setTitles = function(titles, selectedTitle, fileId, e) {
        log(titles);
        log(selectedTitle);
        log(fileId);
        var newTitle = defaultTitle;
        var titleCounter = 0;
        var titleTest = function(title, _) {
            return title.toLowerCase() == newTitle.toLowerCase();
        };
        while (titles.some(titleTest)) {
            newTitle = defaultTitle + (++titleCounter);
        }
        log(newTitle);
        $("#project h1").text(selectedTitle);
        $(e).empty();
        $(titles).each(function(_, title) {
            var selected = title == selectedTitle ? "selected" : "";
            $(e).append("<li class='" + selected + "'><a href='javascript:void(0)' data-title='" + title + "'>" + title + "</a></li>");
        });
        $(e).append("<li><a id='newPrj' data-title='" + newTitle + "'href='javascript:void(0)'>+ New Project</a></li>");

        $('a', e).click(function() {
            ga('send', 'event', 'file', 'change', 'file');
            var title = $(this).attr('data-title');
            $(".st-content").trigger("click");
            if (title === newTitle) {
                $('input:checkbox').each(function() {
                    $(this).prop('checked', false);
                });
            }
            controller.start(title);
        });

        gapi.load('drive-share', function() {
            var shareClient = new gapi.drive.share.ShareClient('<YOUR_APP_ID>');
            shareClient.setItemIds([fileId]);
            $('#file-share').on('click', function() {
                ga('send', 'event', 'share', 'click', 'share');
                shareClient.showSettingsDialog();
            });
        });
    }

    $('#project-title').on('click', function(e) {
        ga('send', 'event', 'rename', 'click', 'show');
        var inputField = $('#rename-input');
        $('#project-title').hide();
        inputField.val($("#project-title").text());
        inputField.show();
        inputField.focus();
        inputField.select()
    });

    $('#rename-input').on('blur', function(e) {
        $('#rename-input').hide();
        $('#project-title').show();
    });

    $('#rename-input').on('keydown', function(e) {
        ga('send', 'event', 'rename', 'click', 'submit');

        var code = e.keyCode || e.which;
        if (code == 13) { //Enter keycode
            var newTitle = $(this).val();
            if (newTitle !== $("#project-title").text()) {
                $('#rename-input').hide();
                $('#project-title').show();
                $("#project-title").text(newTitle);
                renameProject(newTitle);
            } else {
                $('#rename-input').hide();
                $('#project-title').show();
            }
        }

        if (code == 27) { //Esc keycode
            $('#rename-input').hide();
            $('#project-title').show();
        }
    });

    $("#cancel-delete").on('click', function() {
        $.magnificPopup.instance.close();
    })

    $("#confirm-delete").on('click', function() {
        $.magnificPopup.instance.close();
        controller.deleteFile(null, function() {
            controller.start("", "", defaultTitle);
        });
    })

    var fileList = new Realtime.Model.FileList($('#file-list'), setTitles);
    var isFn = function(id, e) {
        return $(e).is(':checked');
    };
    var setFn = function(id, e, val) {
        $(e).prop('checked', val);
    };
    $('input:checkbox').each(function() {
        var id = $(this).attr('id');
        checkboxes[id] = new Realtime.Model.CheckBox(id, this, isFn, setFn);
    });
    view = new Realtime.View(fileList, checkboxes);
    var cb = view.checkboxes;
    log(cb);
    controller = new Realtime.Controller(view);

    var getParam = function(name) {
        var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
        return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    };

    var title = getParam('title');
    log(title);
    if (title) {
        ga('send', 'event', 'file', 'open_by_title', 'file');
    }
    var ids = getParam('ids');
    log(ids);
    if (ids) {
        ga('send', 'event', 'file', 'open_by_id', 'file');
    }
    gapi.load("auth:client,drive-realtime,drive-share", function() {
        controller.init();
        $('form').on('change', 'input:checkbox', function(ev) {
            log(ev);
            if (controller.isLoaded()) {
                controller.onCheckBoxChange($(ev.target).attr('id'));
            }
        });

        var signinSuccess = function() {
            $('#signin-do').hide();
            $('.signin-do').hide();
            $('#signin-fail').hide();
            $('#signin-success').show();
            $("#reset").on('click', function() {
                controller.save();
            });
            $('#sharebox').appendTo('#signin-success');
            $('#supportUs').appendTo('#signin-success');
            $('#header').removeClass('loading');
        };

        var signinFailed = function() {
            $('#signin-fail').show();
            $('#header').removeClass('loading');
            $("#checklist-form").garlic();
            useGarlic = true;
            log("Local storage enabled");
        };

        controller.auth(true,
            signinSuccess,
            function() {
                $('#signin-do').show();
                $('.signin-do').show();
                $('#header').removeClass('loading');
                $("#checklist-form").garlic();
                useGarlic = true;
                log("Local storage enabled");
            },
            title,
            ids,
            defaultTitle
        );

        $('#signin').on('click', function() {
            controller.auth(false, signinSuccess, signinFailed, title, ids, defaultTitle);
        });
    });
});