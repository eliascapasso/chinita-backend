const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const nodemailer = require("nodemailer");

//Settings
app.set("port", process.env.PORT || 3000);

//Middleware
const corsOptions = { origin: "*" };
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// SDK de Mercado Pago
const mercadopago = require("mercadopago");

// Agrega credenciales
mercadopago.configure({
  access_token:
    "APP_USR-8845973082199208-083011-c6a6d3d2ca60fae951fa82e357043551-213773639",
});

app.get("/api/port", (req, res) => {
  console.log("PORT", app.get("port"));
  res.set("Content-Type", "text/html");
  res.set("Content-Type", "application/json");
  res.send(JSON.stringify(app.get("port")));
});

app.get("/api/checkout", (req, res) => {
  console.log("CHECKOUT OK!");
  res.set("Content-Type", "text/html");
  res.set("Content-Type", "application/json");
  res.send(JSON.stringify("CHECKOUT OK!"));
});

//routes
app.post("/api/checkout", (req, res) => {
  console.log("REQUEST", req.body);

  let preference = {
    back_urls: {
      success:
        "https://tienda-online-base.web.app:4200/order-complete/complete",
      failure: "https://tienda-online-base.web.app:4200/inicio",
      pending: "https://tienda-online-base.web.app:4200/order-complete/pending",
    },
    //auto_return: "approved",
    payer: {
      name: req.body.customer.firstname,
      surname: req.body.customer.lastname,
      email: req.body.customer.email,
      address: {
        street_name: req.body.customer.address1,
      },
    },
    shipments: {
      cost: parse(req.body.shippingCost),
      mode: "not_specified",
    },
    statement_descriptor: "TIENDA_VIRTUAL",
    items: [],
  };

  for (let i = 0; i < req.body.items.length; i++) {
    let item = {
      id: req.body.items[i].product.id,
      title: req.body.items[i].product.name,
      description: req.body.items[i].product.description,
      unit_price: req.body.items[i].product.price,
      quantity: req.body.items[i].amount,
      currency_id: "ARS",
      picture_url: req.body.items[i].product.imageURLs[0],
    };
    preference.items.push(item);
  }

  console.log("PREFERENCE-FIREBASE", preference);

  return mercadopago.preferences
    .create(preference)
    .then(function (response) {
      console.log("RESPONSE", preference);
      res.set("Content-Type", "text/html");
      res.set("Content-Type", "application/json");
      res.send(JSON.stringify(response.body.init_point));
    })
    .catch(function (error) {
      console.log("Hubo un error al intentar pagar");
      console.log(error);
      console.log(error.message);

      res.set("Content-Type", "application/json");
      res.send(JSON.stringify(error.message));
    });
});

//server
app.listen(app.get("port"), () => {
  console.log(`server on port ${app.get("port")}`);
});

function parse(x) {
  let parsed = parseInt(x);
  if (isNaN(parsed)) {
    return 0;
  }
  return parsed;
}

///// EMAIL ///////
app.post("/api/send-email", (req, res) => {
  var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "chinita.desarrollo@gmail.com", // generated ethereal user
      pass: "hyxxxubshtrndrep", // generated ethereal password
    },
  });

  transporter.sendMail(
    {
      from: '"Tienda virtual 👻" <chinita.desarrollo@gmail.com>', // sender address
      to: "elias_capasso@live.com", // list of receivers
      subject: "Nueva compra recibida ✔", // Subject line
      html: `<!doctype html>
      <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
      <head>
          <title>
          </title>
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style type="text/css">
              #outlook a {
                  padding: 0;
              }
      
              .ReadMsgBody {
                  width: 100%;
              }
      
              .ExternalClass {
                  width: 100%;
              }
      
              .ExternalClass * {
                  line-height: 100%;
              }
      
              body {
                  margin: 0;
                  padding: 0;
                  -webkit-text-size-adjust: 100%;
                  -ms-text-size-adjust: 100%;
              }
      
              table,
              td {
                  border-collapse: collapse;
                  mso-table-lspace: 0pt;
                  mso-table-rspace: 0pt;
              }
      
              img {
                  border: 0;
                  height: auto;
                  line-height: 100%;
                  outline: none;
                  text-decoration: none;
                  -ms-interpolation-mode: bicubic;
              }
      
              p {
                  display: block;
                  margin: 13px 0;
              }
          </style>
          <style type="text/css">
              @media only screen and (max-width:480px) {
                  @-ms-viewport {
                      width: 320px;
                  }
                  @viewport {
                      width: 320px;
                  }
              }
          </style>
          <style type="text/css">
              @media only screen and (min-width:480px) {
                  .mj-column-per-100 {
                      width: 100% !important;
                  }
              }
          </style>
          <style type="text/css">
          </style>
      </head>
      <body style="background-color:#f9f9f9;">
          <div style="background-color:#f9f9f9;">
              <div style="background:#f9f9f9;background-color:#f9f9f9;Margin:0px auto;max-width:600px;">
                  <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#f9f9f9;background-color:#f9f9f9;width:100%;">
                      <tbody>
                          <tr>
                              <td style="border-bottom:#333957 solid 5px;direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;">
                              
                              </td>
                          </tr>
                      </tbody>
                  </table>
              </div>
              <div style="background:#fff;background-color:#fff;Margin:0px auto;max-width:600px;">
      
                  <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#fff;background-color:#fff;width:100%;">
                      <tbody>
                          <tr>
                              <td style="border:#dddddd solid 1px;border-top:0px;direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;">
                                 
                                  <div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:bottom;width:100%;">
      
                                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:bottom;" width="100%">
      
                                          <tr>
                                              <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
      
                                                  <!-- <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                                                      <tbody>
                                                          <tr>
                                                              <td style="width:64px;">
      
                                                                  <img height="auto" src="./img/logo.png" style="border:0;display:block;outline:none;text-decoration:none;width:100%;" width="64" />
      
                                                              </td>
                                                          </tr>
                                                      </tbody>
                                                  </table> -->
      
                                              </td>
                                          </tr>
      
                                          <tr>
                                              <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                  <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:24px;font-weight:bold;line-height:22px;text-align:center;color:#525252;">
                                                      Recibiste una nueva compra
                                                  </div>
                                              </td>
                                          </tr>
      
                                          <tr>
                                              <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
      
                                                  <table 0="[object Object]" 1="[object Object]" 2="[object Object]" border="0" style="cellspacing:0;color:#000;font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;line-height:22px;table-layout:auto;width:100%;">
                                                      <tr style="border-bottom:1px solid #ecedee;text-align:left;">
                                                          <th style="padding: 0 15px 10px 0;">Datos del cliente</th>
                                                          <th style="padding: 0 15px;"></th>
                                                      </tr>
                                                      <tr>
                                                          <td style="padding: 5px 15px 5px 0;">Apellido(s)</td>
                                                          <td style="padding: 0 15px;">${req.body.order.customer.lastname}</td>
                                                      </tr>
                                                      <tr>
                                                          <td style="padding: 5px 15px 5px 0;">Nombre(s)</td>
                                                          <td style="padding: 0 15px;">${req.body.order.customer.firstname}</td>
                                                      </tr>
                                                      <tr>
                                                          <td style="padding: 0 15px 5px 0;">Dirección</td>
                                                          <td style="padding: 0 15px;">${req.body.order.customer.address1}</td>
                                                      </tr>
                                                      <tr>
                                                          <td style="padding: 0 15px 5px 0;">Ciudad</td>
                                                          <td style="padding: 0 15px;">${req.body.order.customer.city}</td>
                                                      </tr>
                                                      <tr>
                                                          <td style="padding: 0 15px 5px 0;">Código postal</td>
                                                          <td style="padding: 0 15px;">${req.body.order.customer.zip}</td>
                                                      </tr>
                                                      <tr>
                                                          <td style="padding: 0 15px 5px 0;">Email</td>
                                                          <td style="padding: 0 15px;">${req.body.order.customer.email}</td>
                                                      </tr>
                                                      <tr>
                                                          <td style="padding: 0 15px 5px 0;">Teléfono</td>
                                                          <td style="padding: 0 15px;">${req.body.order.customer.phone}</td>
                                                      </tr>
                                                      <tr style="border-bottom:2px solid #ecedee;text-align:left;padding:15px 0;">
                                                          
                                                      </tr>
                                                  </table>
      
                                              </td>
                                          </tr>
      
                                          <tr>
                                              <td align="center" style="font-size:0px;padding:10px 25px;padding-top:30px;padding-bottom:50px;word-break:break-word;">
                                                  <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;">
                                                      <tr>
                                                          <td align="center" bgcolor="#2F67F6" role="presentation" style="border:none;border-radius:3px;color:#ffffff;cursor:auto;padding:15px 25px;" valign="middle">
                                                              <p style="background:#2F67F6;color:#ffffff;font-family:'Helvetica Neue',Arial,sans-serif;font-size:15px;font-weight:normal;line-height:120%;Margin:0;text-decoration:none;text-transform:none;">
                                                                  <a href="http://chinita.com.ar/account/orders/order/${req.body.order.id}" target="_blank" style="color:#fff; text-decoration:none">
                                                                      Ver detalle de la orden
                                                                  </a>
                                                              </p>
                                                          </td>
                                                      </tr>
                                                  </table>
                                              </td>
                                          </tr>
      
                                          <!-- <tr>
                                              <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                  <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:20px;text-align:left;color:#525252;">
                                                      Atentamente,<br><br> Capasso Elias<br>Programador de sistemas<br>
                                                      <a href="https://www.htmlemailtemplates.net" style="color:#2F67F6">htmlemailtemplates.net</a>
                                                  </div>
                                              </td>
                                          </tr> -->
                                      </table>
                                  </div>
                              </td>
                          </tr>
                      </tbody>
                  </table>
              </div>
          </div>
      </body>
      </html>`,
    },
    (error) => {
      if (error) {
        res.status(500).send(error.message);
      } else {
        console.log("Email enviado!");
        res.send(true);
      }
    }
  );
});
