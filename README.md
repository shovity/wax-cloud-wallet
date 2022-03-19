## wax-cloud-wallet

# Nodejs client for wax cloud wallet https://wallet.wax.io
# Wallet must enable 2 factor authentication

```javascript
const wcw = require('wax-cloud-wallet')

const client = wcw.create('youremail@gmail.com', 'yourpassword', 'your 2pa secrect key')

const result = client.transact(
    {
        actions: [{
            account: 'eosio.token',
            name: 'transfer',
            authorization: [{
                actor: client.wallet,
                permission: 'active',
            }],
            data: {
                from: client.wallet,
                to: 'eosio',
                quantity: '0.00000001 WAX',
                memo: '',
            },
        }]
    },
    {
        blocksBehind: 3,
        expireSeconds: 1200,
    },
)
```