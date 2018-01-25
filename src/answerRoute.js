const sendPush = require('./utils/sendPush')
const { promisify } = require('util')
const sendPushAsync = promisify(sendPush)
const { answerToCustomer } = require('./customers')
const { addLog } = require('./logs')

function getCustomerURL({ funnelStep, _id }) {
    if (funnelStep === 'lead') return `http://new.mindsales-crm.com/leads/hot/${_id}`
    if (funnelStep === 'cold') return `http://new.mindsales-crm.com/leads/cold/${_id}`
    if (funnelStep === 'reject' || funnelStep === 'deal') return `http://new.mindsales-crm.com/closed/${_id}`
    return `http://new.mindsales-crm.com/customers/${_id}`
}

function getNotificationTitle({ funnelStep }) {
    if (funnelStep === 'lead' || funnelStep === 'cold') return 'Заполнить профиль 📝'
    return 'Открыть профиль 📋'
}

module.exports = (request, response, next) => {
    const { params: { customerNumber, managerNumber, trunkNumber } } = request
    console.log('Answer to', customerNumber, 'from', managerNumber, 'via GET and', trunkNumber)
    answerToCustomer({ customerNumber, managerNumber, trunkNumber })
        .then(({ customer, user }) => sendPushAsync({
            app_id: "76760ad6-f2f4-4742-8baf-ff9c8f6bc3f6",
            headings: { "en": getNotificationTitle(customer), "ru": getNotificationTitle(customer) },
            contents: { "en": customer.name, "ru": customer.name },
            url: getCustomerURL(customer),
            filters: [
                { "field": "tag", "key": "userId", "relation": "=", "value": user._id },
                { "field": "tag", "key": "device", "relation": "=", "value": "desktop" }
            ],
            android_visibility: 1,
            priority: 10
        }))
        .then(pushResponse => {
            addLog({
                type: 'push', what: 'пуш менеджеру',
                payload: {
                    customerNumber, managerNumber, trunkNumber, pushResponse
                }
            })
            return response.json({
                status: 'OK',
                method: 'GET',
                customerNumber,
                managerNumber,
                trunkNumber,
                pushResponse
            })
        })
        .catch(next)
}