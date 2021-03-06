const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const cors = require('cors')({origin: true});
const crypto = require('crypto-js');

admin.initializeApp();

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'guillermop.aragon@gmail.com',
        pass: 'hgflrjrvdhertzpu'
    }
});

exports.reservaConfirmacion = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
        const datos = (req.body.reserva).replace(/\s/g, "+");
        const json = JSON.parse(JSON.parse(crypto.AES.decrypt(datos.toString(), 'Pi7@').toString(crypto.enc.Utf8)));
        const entrada = new Date(json.fechas.entrada);
        const salida = new Date(json.fechas.salida);
        const mailOptions = {
            from: 'Campingnet <guillermop.aragon@gmail.com>',
            to: json.persona.email,
            subject: 'Confirmación de reserva',
            html:
            `<div style="float: left; display: inline;">
                <p>Gracias por realizar la reserva, ${json.persona.nombre}</p>
                <p>Como se le indicó al acabar la reserva, el ID de su reserva es:  ${json.datosReserva.idReserva}</p>
                <p>La fecha de su reserva es desde ${entrada.getDate()}-${entrada.getMonth()+1}-${entrada.getFullYear()} hasta ${salida.getDate()}-${salida.getMonth()+1}-${salida.getFullYear()}</p>
                <p>El alojamiento escogido es un/a ${json.datosReserva.alojamiento}</p>
                <p>El total a pagar al salir del camping será ${json.datosReserva.precioTotalFinal}€</p>
                <br>
                <p>Gerencia del camping Naúfrago</p>
            </div>
            <div style="float: right; display: inline;">
                <img src="https://raw.githubusercontent.com/tryn0/Campingnet/master/src/assets/images/logotipo-camping.png" alt="Logotipo del camping naúfrago">
            </div>`,
        };
        return transporter.sendMail(mailOptions, (err, info) => {
            if(err) {
                return res.send(err.toString());
            }
            return res.status(200).send('1');
        });
    });
});

exports.registroConfirmacion = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
        const datos = (req.body.registro).replace(/\s/g, "+");
        const json = JSON.parse(JSON.parse(crypto.AES.decrypt(datos.toString(), 'Pi7@').toString(crypto.enc.Utf8)));
        const mailOptions = {
            from: 'Campingnet <guillermop.aragon@gmail.com>',
            to: json.persona.email,
            subject: 'Confirmación de registro',
            html:
            `<div>
                <p>${json.persona.nombre} gracias por registrarse, esperamos que disfrute del camping.</p>
                <p>Si tiene cualquier duda, por favor contacte con nosotros a través de <a href="http://34.206.59.221:4200/contacto">esta página de contacto.</a></p>
                <p>Gerencia del camping Naúfrago</p>
            </div>
            <div>
                <img src="https://raw.githubusercontent.com/tryn0/Campingnet/master/src/assets/images/logotipo-camping.png" alt="Logotipo del camping naúfrago">
            </div>`,
        };
        return transporter.sendMail(mailOptions, (err, info) => {
            if(err) {
                return res.send(err.toString());
            }
            return res.status(200).send('1');
        });
    });
});

exports.contacto = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
        const datos = (req.body.contacto).replace(/\s/g, "+");
        const json = JSON.parse(JSON.parse(crypto.AES.decrypt(datos.toString(), 'Pi7@').toString(crypto.enc.Utf8)));
        const mailOptions = {
            from: `${json.persona.nombre} <${json.persona.email}>`,
            to: 'guillermop.aragon@gmail.com',
            subject: `Contacto de ${json.persona.nombre}`,
            html:
            `<div>
                <p>La persona que contactó es: ${json.persona.nombre}</p>
                <p>Con teléfono móvil: ${json.persona.telefono}</p>
                <p>Y el mensaje es:</p>
                <p>${json.datos.mensaje}</p>
            </div>`,
        };
        return transporter.sendMail(mailOptions, (err, info) => {
            if(err) {
                return res.send(err.toString());
            }
            return res.status(200).send('1');
        });
    });
});