const { incomingCustomer } = require('./customers')

module.exports = (request, response, next) => {
    const { params: { customerNumber, trunkNumber } } = request

    console.log('Incoming from', customerNumber, 'to', trunkNumber, 'via GET')

    incomingCustomer({ customerNumber, trunkNumber })
        .then(dataForPush => response.json(dataForPush))
        .catch(next)
}