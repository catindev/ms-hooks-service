const { answerToCustomer } = require('./customers')

module.exports = (request, response, next) => {
    const { params: { customerNumber, managerNumber, trunkNumber } } = request

    console.log('Answer to', customerNumber, 'from', managerNumber, 'via GET and', trunkNumber)

    answerToCustomer({ customerNumber, managerNumber, trunkNumber })
        .then(data => response.json(data))
        .catch(next)
}