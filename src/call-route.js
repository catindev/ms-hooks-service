module.exports = (request, response) => {
    const required = [ 'clientNumber', 'trunkNumber' ]
    const payloadKeys = Object.keys(request.body)
    const fields = required.filter( key => payloadKeys.indexOf(key) === -1 )

    if (fields.length > 0) return response.status(400).json({ 
        status:400, message: 'required fields are missing', fields
    })  

    response.json({ status: 200 })   
}