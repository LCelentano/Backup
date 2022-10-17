"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Builder = void 0;
class Builder {
    xpub;
    path;
    provider;
    constructor(xpub, path, provider) {
        this.xpub = xpub;
        this.path = path;
        this.provider = provider;
    }
}
exports.Builder = Builder;
