const CustomError = require('./utils/error')

module.exports = (request, response) => {
    const required = [ 'clientNumber', 'trunkNumber' ]
    const payloadKeys = Object.keys(request.body)
    const fields = required.filter( key => payloadKeys.indexOf(key) === -1 )

    if (fields.length > 0) 
        throw new CustomError(`Не заполнены обязательные параметры (${ fields.join(', ') })`, 400)

    response.json({ status: 200 })   
}