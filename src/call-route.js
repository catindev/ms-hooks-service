const CustomError = require('./utils/error')
const registerCall = require('./call')

module.exports = (request, response, next) => {
    const required = ['customerNumber', 'trunkNumber', 'waitingDuration']
    const payloadKeys = Object.keys(request.body)
    const fields = required.filter(key => payloadKeys.indexOf(key) === -1)

    if (fields.length > 0) throw new CustomError(
        `Не заполнены обязательные параметры: ${ fields.join(', ') }`,
        400
    )

    request.path === '/callback' && (request.body.isCallback = true)    

    registerCall(request.body)
        .then( call => response.json({ status: 200, call }))
        .catch(next)    
}