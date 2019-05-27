const {
    io
} = require('../server');
const {
    Usuarios
} = require('../classes/usuarios');

const {
    crearMensaje
} = require('../utils/utils')

let usuarios = new Usuarios();

io.on('connection', (client) => {

    client.on('entrarChat', (usuario, callback) => {

        if (!usuario.nombre || !usuario.sala) {
            return callback({
                error: true,
                mensaje: 'EL nombre/sala es necesario'
            })
        }
        
        client.join(usuario.sala);

        let personas = usuarios.agregarPersona(client.id, usuario.nombre,usuario.sala);

        client.broadcast.to(usuario.sala).emit('listaPersonas', usuarios.getPersonasPorSala(usuario.sala));
        callback(usuarios.getPersonasPorSala(usuario.sala))
        // console.log(personas);
    });

    client.on('crearMensaje', (data) => {
        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.emit('crearMensaje', mensaje);
    })

    //Mensajes privados 
    client.on('mensajePrivado', data => {
        if (data.para) {
            let persona = usuarios.getPersona(client.id);
            client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
        }

    })

    client.on('disconnect', () => {
        let personaBorrada = usuarios.borrarPersona(client.id);
        console.log('Persona borrada: ', personaBorrada);

        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} abandono el chat`))
        client.broadcast.to(personaBorrada.sala).emit('listaPersonas', usuarios.getPersonasPorSala(personaBorrada.sala))
    });
});