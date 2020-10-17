$('body').terminal(function(command){
    if (command !== '') {
        var container_id = sessionStorage.getItem("DockerID");
        var result = function () {
            var tmp = null;
            $.ajax({
                'async': false,
                'type': "POST",
                'global': false,
                'dataType': 'html',
                'url': 'terminal_command',
                'data': {'command':command, 'container_id':container_id},
                'success': function (data) {
                    tmp = data;
                }
            });
            return tmp;
        }();
        var result_final = JSON.parse(result);
        this.echo("[[gb;green;black]" + result_final.message + "]");
    }
}, {
        greetings: 'Get access to your Docker terminal',
        name: 'js_demo',
        prompt: 'Docker> '
});
