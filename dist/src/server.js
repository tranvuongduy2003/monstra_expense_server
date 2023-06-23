"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const helmet_1 = __importDefault(require("helmet"));
const error_exception_1 = require("../error-handler/error-exception");
const error_handler_1 = require("../error-handler/error-handler");
const firebase_adminsdk_json_1 = __importDefault(require("../firebase-adminsdk.json"));
const serviceAccount = firebase_adminsdk_json_1.default;
dotenv_1.default.config();
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(serviceAccount),
    databaseURL: `https://${firebase_adminsdk_json_1.default.project_id}.firebaseio.com`,
});
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use(error_handler_1.errorHandler);
app.get("/", (req, res, next) => {
    res.status(200).json({ data: "Hello" });
});
app.post("/send-group-message", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, body, token } = req.body;
    const message = {
        token,
        notification: {
            title: title,
            body: body,
        },
    };
    try {
        const response = yield firebase_admin_1.default.messaging().send(message);
        console.log("Successfully sent message:", response);
    }
    catch (error) {
        throw new error_exception_1.ErrorException("400", error);
    }
}));
app.listen(process.env.PORT, () => {
    console.log(`Application started on port ${process.env.PORT}!`);
});
