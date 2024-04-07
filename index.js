require('./env/env.js')
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const logger = require("./utils/winston");
var http = require("http");
const db = require("./api/models");
const { I18n } = require("i18n");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const Fs = require("fs");
const Path = require("path");
const _  = require("lodash");
const app = express();
const Models = require("./api/models");
const appConstant =require("./appConstant.js");


global.defaultLanguageId = process.env.defaultLanguageId;
global.defaultLanguage = process.env.defaultLanguageCode;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.NODE_ENV === "test" ? process.env.TEST_PORT : process.env.NODE_PORT || 8080;

const i18n = new I18n({
    locales: ["en", "de"],
    defaultLocale: "en",
    directory: Path.join(__dirname, "locales"),
});

var corsOptions = {
    origin: "*",
};
app.use(cors(corsOptions));
let routes = [],
    swaggerRoutesFiles = [];
let routerPath = process.cwd() + "/api/router";
Fs.readdirSync(routerPath).filter(function (file) {
    let routers_data = require(routerPath + `/${file}`);
    swaggerRoutesFiles.push("./router/" + file.toString());
    routes.push(routers_data);
});



const server = http.createServer(app);
server.listen(PORT, async () => {
    try {
        process.env.NODE_ENV === "test"
            ? await db.sequelize.sync({ force: true })
            : await db.sequelize.sync({ force: false }); 
            logger.info(`Database Connected Successfully`);
            logger.info(`Server is running on port http://localhost:${PORT}.`);
    } catch (error) {
        console.log("Error in Connecting Database", error.toString());
        process.exit(1);
    }
});
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
    res.status(appConstant.STATUS_CODE.OK).send({ message : "Home Page" });
});

app.use(async (req,res,next) =>{
    if( !_.has(req.headers, "lang") ) {
        req.headers.lang = process.env.defaultLanguaueCode || "eng";
    }
    let languageCode = req.headers.lang;
    // Language Setting to user
    let language = await Models.Language.findOne({ where: { code: languageCode }, attributes:["id"] });
    req.lang =  language ? language.id : ( process.env.defaultLanguageId || 1 ) ; 
    next();
});
app.use("/api", routes);

