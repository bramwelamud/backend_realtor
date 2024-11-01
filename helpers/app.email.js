'use strict';
const nodemailer = require('nodemailer');
const moment=require('moment');
const dotenv = require('dotenv').config();
const { format } = require('path');

const Email = function (email) {
	this.email_bbc = email.email_bbc;
	this.email_to = email.email_to;
	this.email_subject = email.email_subject;
	this.email_body = email.email_body;
};

const emailConfig = {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD
};
let emailTemplateOnTheWay=function(routeMap,routeMapElement){
    
    return `<p><span style="font-size:24px"><strong>Vamos de camino a su entrega</strong></span></p>
    <p>&nbsp;</p>
    <p>Estimado(a) cliente(a), <strong> ${routeMapElement.person_contact}</strong></p>
    <p>En este momento estamos de camino a su domicilio para entregarle su pedido.&nbsp; Los datos del pedido son los siguientes:</p>
    <p><strong>Hora estimada de Llegada :</strong>&nbsp; ${routeMapElement.eta_duration}</p>
    <p><strong>Pedido GLP:</strong>&nbsp; ${routeMapElement.request_no}</p>
    <p><strong>Fecha:</strong>&nbsp; &nbsp; ${moment(routeMapElement.eta_time).format('DD.MM.YYYY').toString()}</p>
    <p><strong>Destino:</strong> ${routeMapElement.name}</p>
    <p><strong>Direcci&oacute;n:</strong> ${routeMapElement.address}</p>
    <p><strong>Unidad:</strong> ${routeMap.vehicle_ficha}</p>
    <p><strong>Chofer:</strong> ${routeMap.driver_fname}</p>
    <p><strong>Enlace de Seguimiento:</strong> ${routeMapElement.url_message}</p>
    <p><strong>&iexcl;Ahora tenemos m&aacute;s canales de pagos totalmente en l&iacute;nea disponibles para mejorar su experiencia del servicio! </strong><br />
    Recuerde realizar el pago antes del vencimiento de su factura para evitar cargos y retrasos en la entrega de su pr&oacute;xima orden.</p>
    <p><br />
    <strong>Canales de pago: </strong><br />
    &bull; Utilice nuestro Call Center para pagar con Tarjeta de Cr&eacute;dito. Registre su tarjeta para el cobro automatizado de sus facturas<br />
    &bull; Banca en l&iacute;nea y ventanilla de los bancos: Popular, BHDLeon y Scotiabank<br />
    &bull; Todas nuestras unidades de transporte de combustible y mensajeros de cobros<br />
    &bull; Transferencias bancarias, comunic&aacute;ndose con nuestro Call Center para obtener el n&uacute;mero de cuenta<br />
    &bull; El APP PROPAGAS, tanto para pagos como para solicitud de pedidos de GLP</p>
    <p>Cont&aacute;ctenos al (809) 364-1000 opci&oacute;n 1 (WhatsApp disponible), o al correo electr&oacute;nico: <a href="mailto:servicioalcliente@propagas.do">servicioalcliente@propagas.do</a><br />
    Descargue nuestra aplicaci&oacute;n m&oacute;vil Propagas, disponible para Android y IOS</p>`;
}
let emailTemplateLandlordWelcome=function(itemEmail){ 
    return `<p>Dear (${itemEmail}),</p>
    <p>On behalf of the realtor, we are excited to welcome you as one of our verified landlords! As a member, you now have the ability to post all of your rental listings on our platform for free.</p>
    
    <p>Before you can begin using our tenant rental search and posting area, we kindly ask that you complete the registration process. Once your registration is completed and approved, you&#39;ll have full access to our range of services, including the ability to post and manage your rental listings and search for potential tenants.</p>
    <p>We understand that finding quality tenants can be a time-consuming and a difficult process. That&#39;s why we have created a platform where landlords and tenants can connect quickly and easily. By joining our community, you&#39;ll be able to streamline the process of approving your tenants&#39; applications and expand your rental business.</p>
    
    <p>Our team is dedicated to providing our members with the resources they need to succeed. We offer a wealth of knowledge and experience in the rental industry, and we are always available to answer any questions or offer guidance.</p>
    <p>Thank you for joining the World Association Tenant Bureau community. We look forward to working with you and helping you achieve your rental business goals.</p>
    
    <p>&nbsp;</p>
    <p>Best regards,</p>
    <p>Staff and Agents</p>
    <p>&nbsp;</p>
    <p>The World Association Tenant Bureau Team<br />
    Toronto, Canada Office +1 (647) 846-4720</p>
    <p>The&nbsp;ONLY&nbsp;World Association Tenant Bureau. Where you search for your applicant before renting and warn other landlords of bad tenants. Let&rsquo;s work together to eliminate or greatly reduce fraudulent tenants. Let&#39;s work together and help each other &ldquo;Get to Know your Tenant&rdquo;!</p>
    <p>&nbsp;</p>
    <p>GET TO KNOW YOUR TENANT&nbsp;</p>`;
}


let chooseTemplateEmail=function (templateId,routeMap,routeMapElement){
    let resMessageTxt='';
    switch (templateId) {
        case 1:
            resMessageTxt=emailTemplateOnTheWay(routeMap,routeMapElement);
            break;
    
        default:
            break;
    }
   return resMessageTxt;
}

let sendEmailServices = function (emailBodyDT) {
	return new Promise(function (resolve, reject) {
        let transporter = nodemailer.createTransport({
            host: emailConfig.host,
            port: emailConfig.port,
            auth: {
                user: emailConfig.user,
                pass: emailConfig.password
            }
        })
        let message = {
            from: emailConfig.user,
            to: emailBodyDT.email_to,
            // bcc: emailBodyDT.email_bbc,
            subject: emailBodyDT.email_subject, 
            html: emailBodyDT.email_body 
        };
        transporter.sendMail(message, function (err, info) {
            if (err) {
                resolve({status:'error',message:err});
            } else {
                resolve({status:'ok',message:'Message sent!'});
                // console.log(info);
            }
        });
    });
}

let testSendEmailServices = function (mailConfig,emailBodyDT) {
	return new Promise(function (resolve, reject) {
        let transporter = nodemailer.createTransport({
            host: mailConfig.host,
            port: mailConfig.port,
            auth: {
                user: mailConfig.user,
                pass: mailConfig.password
            }
        })
        let message = {
            from: mailConfig.user,
            to: emailBodyDT.email_to,
            bcc: emailBodyDT.email_bbc,
            subject: emailBodyDT.email_subject, 
            html: emailBodyDT.email_body 
        };
        transporter.sendMail(message, function (err, info) {
            if (err) {
                resolve({status:'error',message:err});
            } else {
                resolve({status:'ok',message:'Message sent!'});
            }
        });
    });
}

Email.testSendEmail = (emailBodyQuery, result) => {
	testSendEmailServices(emailConfig,emailBodyQuery).then(function (resposneEmail) {
        result(null,resposneEmail);
    });
}
Email.doSendEmail = (emailBodyQuery, result) => {
	sendEmailServices(emailBodyQuery).then(function (resposneEmail) {
        result(null,resposneEmail);
    });
}

Email.sendEmail = (emailBodyQuery,mapRoute,mapRouteElem,TemplateId, result) => {
    emailBodyQuery.email_body=chooseTemplateEmail(TemplateId,mapRoute,mapRouteElem)
	sendEmailServices(emailBodyQuery).then(function (resposneEmail) {
        result(null,resposneEmail);
    });
}

module.exports = Email;