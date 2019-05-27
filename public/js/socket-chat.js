var socket = io();

var params = new URLSearchParams(window.location.search)



if (!params.has('nombre') || !params.has('sala') ) {
    window.location = 'index.html';
    throw new Error('El nombre y sala son necesarios.')
}

var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
}

//Conectado al servidor
socket.on('connect', function () {
    console.log('Conectado al servidor');
    socket.emit('entrarChat', usuario, function (resp) {
        console.log('Usiarios conectados', resp);
    });
})

//Escucha de eventos entre servidor y cliente
socket.on('disconnect', function () {
    console.log('Se perdio la conexion con el servidor');
})

// socket.emit('crearMensaje', function (mensaje) {
//     console.log(mensaje);
// })

socket.on('crearMensaje', function (mensaje) {
    console.log(mensaje);
})


socket.on('mensajePrivado', function (mensaje) {
    console.log('Mensaje privado: ',mensaje);
})



socket.on('crearMelistaPersonansaje', function (personas) {
    console.log(personas);
})

