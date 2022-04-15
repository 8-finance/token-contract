const debug = require('debug');


export function logMethod(): any {
    console.log("first(): factory evaluated");
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const ol = descriptor.value;
        descriptor.value = function () {
            debug('eth_net:' + target.constructor.name)(propertyKey, arguments);
            return ol.apply(this, arguments);
        };
        console.log("first(): called");
    };
}
