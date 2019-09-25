
$("#send_username").on('click', function (e) {
    e.preventDefault();
    var socket = io.connect('http://localhost:8000')
    var message = $("#message-to-send");
    var username = $("#username");
    $('.login_form').hide();
    $('.container').show();
    $('#name').empty();
    $('#name').append("<h5><img src='/images/user_chat.jpg' alt='avatar' class='user'/>" + username.val() + "</h5>");
    socket.emit('username', { username: username.val() })
    socket.emit('online');

    $('.chat-message').submit(function () {
        socket.emit('chat message', {
            message: message.val()
        });
        message.val('');
        return false;
    });

    socket.on('chat message', function (msg) {
        console.log(username.val());
        if (msg.username == username.val()) {
            $('#messages').append('<div class= "box sb1 round"><b>me:</b> ' + msg.message + '<p class="time">' + moment().format('MMM Do YYYY, h:mm:ss a') + '</p></div><br>');
        } else {
            $('#messages').append('<div class= "speech sb"><b>' + msg.username + ":</b> " + msg.message + '<p class="time">' + moment().format('MMM Do YYYY, h:mm:ss a') + '</p></div><br>');
        }
    });

    message.bind("keypress", function () {
        socket.emit('typing');
    })

    socket.on('typing', function (msg, err) {
        console.log(err);
        $('#typing').html(msg.username + " is typing a message...");
        setTimeout(function () {
            $("#typing").html('');
        }, 3000);
    })

    socket.on('username', function (data) {
        $('.online_box').empty();
        $('.online_box').append("<h3><img src='/images/users.png' alt='avatar' class='users'/>USERS</h3>");
        for (var user in data) {
            var isOnline = data[user].online
            if (isOnline) {
                $('.online_box').append('<div class= "online">' + user + " is online" + '</div>');
            }
            else {
                $('.online_box').append('<div class= "not_online">' + user + " is offline" + '</div>');
            }
        }
    });
    socket.on('online', function (msg) {
        if (msg.username != username.val()) {
            $('#messages').append('<div class= "join_chat">' + msg.username + " " + msg.message + '</div>');
        }
    })
    // socket.on('not_online', function (msg) {
    //     if (msg.username != username.val()) {
    //         $('#messages').append('<div class= "join_chat">' + msg.username + " left the group chat" + '</div>');
    //     }
    // })



});