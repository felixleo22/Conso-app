const Price = require('../models/Price');

module.exports = {
    setPrice(shop, product, newPrice, user) {
        return new Promise((resolve, reject) => {
            Price.find({ product }).where({ shop }).then((price) => {
                if (!price) {
                    reject((new Error(JSON.stringify({ type: 'error', code: 500, message: 'Internal Error' }))));
                }
                // eslint-disable-next-line no-param-reassign
                price.shop = shop;
                // eslint-disable-next-line no-param-reassign
                price.price = newPrice;
                // eslint-disable-next-line no-param-reassign
                price.updated_at = new Date();
                // eslint-disable-next-line no-param-reassign
                price.user = user;
                resolve(price);
            });
        });
    },
    newItem(shop, product, price, user) {
        return new Promise((resolve, reject) => {
            if (!shop || !product || !price || !user) {
                reject(new Error(JSON.stringify({ type: 'error', code: 401, message: 'Missing parameter' })));
            }
            const newPrice = {
                shop,
                product,
                price,
                updated_at: new Date(),
                updated_by: user,
            };
            resolve(newPrice);
        });
    },
};
