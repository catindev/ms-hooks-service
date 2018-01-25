const sendPush = require('./utils/sendPush')
const { promisify } = require('util')
const sendPushAsync = promisify(sendPush)
const { incomingCustomer } = require('./customers')
const { addLog } = require('./logs')

/*
Входящий, новый формат
Заголовок "Имя клиента 📞"
Контент "Менеджер — Имя менеджера"
*/

function getCustomerURL({ funnelStep, _id }) {
    if (funnelStep === 'lead') return `http://new.mindsales-crm.com/leads/hot/${_id}`
    if (funnelStep === 'cold') return `http://new.mindsales-crm.com/leads/cold/${_id}`
    if (funnelStep === 'reject' || funnelStep === 'deal') return `http://new.mindsales-crm.com/closed/${_id}`
    return `http://new.mindsales-crm.com/customers/${_id}`
}

module.exports = (request, response, next) => {
    const { params: { customerNumber, trunkNumber } } = request

    console.log('Incoming from', customerNumber, 'to', trunkNumber, 'via GET')

    incomingCustomer({ customerNumber, trunkNumber })
        .then(customer => sendPushAsync({
            app_id: "af48135c-d059-404b-a898-3a77d883158a",
            headings: { "en": "Входящий звонок", "ru": "Входящий звонок" },
            contents: { "en": customer.name, "ru": customer.name },
            url: getCustomerURL(customer),
            filters: [
                { "field": "tag", "key": "accountId", "relation": "=", "value": customer.account },
                { "field": "tag", "key": "device", "relation": "=", "value": "mobile" }
            ],
            android_visibility: 1,
            priority: 10
        }))
        .then(pushResponse => {
            addLog({
                type: 'push', what: 'пуш на группу',
                payload: { customerNumber, trunkNumber, pushResponse }
            })
            return response.json({
                status: 'OK',
                method: 'GET',
                customerNumber,
                trunkNumber,
                pushResponse
            })
        })
        .catch(next)
}