"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const checkAuth = (req, res, next) => {
    var _a;
    const token = req.cookies.token || ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]);
    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided, authorization denied' });
    }
    try {
        // Decode the token and verify it
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Attach only the decoded token info to req.User
        req.User = {
            id: decoded.id,
            username: decoded.username,
            email: decoded.email,
        };
        next();
    }
    catch (err) {
        res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};
exports.checkAuth = checkAuth;
exports.default = exports.checkAuth;
