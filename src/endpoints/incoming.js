const toObjectId = require('mongoose').Types.ObjectId
const { Account, Trunk, User, Customer, Call, Contact, Breadcrumb } = require('../schema')
const CustomError = require('../utils/error')
const getCustomerURL = require('../utils/getCustomerURL')
const { addLog } = require('../logs')

// Route GET /incoming/:customerNumber/:trunkNumber
module.exports = async (request, response, next) => {
    let { params: { customerNumber, trunkNumber } } = request

    console.log('Incoming from', customerNumber, 'to', trunkNumber, 'via GET')

    trunkNumber = '+' + trunkNumber
    customerNumber = '+' + customerNumber

    addLog({
        type: 'incoming',
        what: 'входящий звонок',
        payload: { customerNumber, trunkNumber }
    })

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
        console.log('Push response for existing customer.')
        return response.json({
            title: name,
            text: user ? user.name : trunk.name,
            customer_id: existingContact.customer._id,
            url: getCustomerURL({ funnelStep, _id })
        })
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
        name: 'Основной'
    })

    const createdContact = await newContact.save()

    createdCustomer.contacts.push(createdContact)
    await createdCustomer.save()

    const newBreadcrumb = new Breadcrumb({
        date: new Date(),
        account: trunk.account._id,
        customer: createdCustomer._id,
        type: 'created',
        trunk: trunk._id
    })
    const createdBreadcrumb = await newBreadcrumb.save()

    console.log('Push response for new customer.')
    response.json({
        title: 'Новый клиент',
        text: trunk.name,
        customer_id: createdCustomer._id,
        url: getCustomerURL({ funnelStep, _id })
    })
}