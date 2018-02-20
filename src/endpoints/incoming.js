const toObjectId = require('mongoose').Types.ObjectId
const { Account, Trunk, User, Customer, Call, Contact } = require('../schema')
const CustomError = require('../utils/error')
const getCustomerURL = require('../utils/getCustomerURL')
const { addLog } = require('../logs')

// Route GET /incoming/:customerNumber/:trunkNumber
module.exports = async (request, response, next) => {
    let { params: { customerNumber, trunkNumber } } = request

    console.log('Incoming from', customerNumber, 'to', trunkNumber, 'via GET')

    trunkNumber = '+' + trunkNumber
    customerNumber = '+' + customerNumber

    const trunk = await Trunk.findOne({ phone: trunkNumber, active: true })
        .populate('account')
        .exec()

    if (!trunk || trunk === null)
        throw new CustomError(`Транк ${trunkNumber} не зарегистрирован либо отключен`, 400)

    const existingContact = await Contact.findOne({
        account: trunk.account._id, phone: customerNumber
    }).populate({
        path: 'customer', model: 'Customer',
        populate: [
            { path: 'user', model: 'User' },
            { path: 'trunk', model: 'Trunk' },
        ]
    }).lean().exec()

    if (existingContact) {
        const { customer: { funnelStep, _id, user, name } } = existingContact
        const pushContent = {
            title: name,
            text: user ? user.name : trunk.name,
            url: getCustomerURL({ funnelStep, _id })
        }

        console.log('Push content', pushContent)
        return response.json(pushContent)
    }

    const newCustomer = new Customer({
        account: trunk.account._id,
        phones: [customerNumber],
        trunk: trunk._id
    })

    const createdCustomer = await newCustomer.save()
    const { funnelStep, _id } = createdCustomer

    const newContact = new Contact({
        account: trunk.account._id,
        customer: _id,
        phone: customerNumber,
        name: 'Телефон'
    })

    const createdContact = await newContact.save()

    createdCustomer.contacts.push(createdContact)
    await createdCustomer.save()

    const pushContent = {
        title: 'Новый клиент',
        text: trunk.name,
        url: getCustomerURL({ funnelStep, _id })
    }

    addLog({
        type: 'incoming',
        what: 'входящий звонок',
        payload: {
            customerNumber, trunkNumber, pushContent
        }
    })

    response.json(pushContent)
}