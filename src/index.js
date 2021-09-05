const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

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
    "APP_USR-6410586645251716-081310-931fec56178dcba5529ae799e8a2be91-807106888",
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
const nodemailer = require("nodemailer");

app.post("/api/send-email", (req, res) => {
  var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "capassoelias@gmail.com", // generated ethereal user
      pass: "qamuldedygvfggsl", // generated ethereal password
    },
  });

  transporter.sendMail(
    {
      from: '"Tienda virtual 👻" <capassoelias@gmail.com>', // sender address
      to: "capassoelias@gmail.com", // list of receivers
      subject: "Nueva orden ✔", // Subject line
      html: `<h2>Recibiste una nueva orden!</h2>
            <br><br>
            <h3>Datos de contacto:</h3>
            <br>
            <ul> 
              <li> Nombre y apellido: ${req.body.order.customer.lastname}, ${req.body.order.customer.firstname} </li> 
              <li> Dirección: ${req.body.order.customer.address1} </li>
              <li> País: ${req.body.order.customer.city} </li>
              <li> Ciudad: ${req.body.order.customer.city} </li>
              <li> Código postal: ${req.body.order.customer.zip} </li>
              <li> Email: ${req.body.order.customer.email} </li>
              <li> Teléfono: ${req.body.order.customer.phone} </li>
            </ul>
            <br><br>
            <b>Ingresá al siguiente enlace para ver todas tus ordenes: </b> 
            <a href='http://chinita.com.ar/account/orders'>CLICK AQUI</a>`, // html body
    },
    (error, info) => {
      if (error) {
        res.status(500).send(error.message);
      } else {
        console.log("Email enviado!");
        res.send(true);
      }
    }
  );
});
