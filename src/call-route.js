const CustomError = require('./utils/error')
const registerCall = require('./call')

module.exports = (request, response, next) => {
    const required = ['clientNumber', 'trunkNumber']
    const payloadKeys = Object.keys(request.body)
    const fields = required.filter(key => payloadKeys.indexOf(key) === -1)

    if (fields.length > 0) throw new CustomError(
        `Не заполнены обязательные параметры: ${ fields.join(', ') }`,
        400
    )

    registerCall(request.body)
        .then( result => {
            console.log('register call', result)
            response.json({ status: 200 })
        })
        .catch(next)    
}