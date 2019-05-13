"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var dns = __importStar(require("dns"));
var https = __importStar(require("https"));
var HttpsRequester = /** @class */ (function () {
    function HttpsRequester(host, port) {
        this.CAs = [];
        this.isCAInUse = false;
        this.host = host;
        this.port = port;
        this.hostIP = host;
    }
    HttpsRequester.prototype.get = function (path, body) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.httpsRequest(path, 'GET', body)];
            });
        });
    };
    HttpsRequester.prototype.post = function (path, body) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.httpsRequest(path, 'POST', body)];
            });
        });
    };
    HttpsRequester.prototype.put = function (path, body) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.httpsRequest(path, 'PUT', body)];
            });
        });
    };
    HttpsRequester.prototype.delete = function (path, body) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.httpsRequest(path, 'DELETE', body)];
            });
        });
    };
    HttpsRequester.prototype.useCAs = function (CAs) {
        this.isCAInUse = true;
        this.CAs = CAs;
    };
    HttpsRequester.prototype.performDnsResolve = function (onDone) {
        var _this = this;
        if (!this.host) {
            throw "Please provide a container name";
        }
        if (this.host !== this.host.toLowerCase()) {
            console.log("Warning: Your output base url contains some uppercase letters. The dns lookup may struggle with it.");
        }
        dns.lookup(this.host, function (err, address) {
            if (err !== undefined) {
                _this.hostIP = address;
                onDone(address);
            }
        });
    };
    HttpsRequester.prototype.httpsRequest = function (path, method, body) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var req = https.request(_this.getHttpsOptions(path, method), function (res) {
                            var chunks = [];
                            res.on('data', function (data) { return chunks.push(data); });
                            res.on('end', function () {
                                var resBody = Buffer.concat(chunks).toString();
                                if (res.headers['content-type'].includes('application/json')) {
                                    resBody = JSON.parse(resBody);
                                }
                                resolve(resBody);
                            });
                        });
                        req.on('error', reject);
                        if (body) {
                            req.write(body);
                        }
                        req.end();
                    })];
            });
        });
    };
    HttpsRequester.prototype.getHttpsOptions = function (path, method) {
        var options = {
            host: this.hostIP,
            path: path,
            method: method,
            port: this.port,
            rejectUnauthorized: this.isCAInUse
        };
        if (this.isCAInUse) {
            options.ca = this.CAs;
        }
        return options;
    };
    return HttpsRequester;
}());
exports.HttpsRequester = HttpsRequester;
