const toObjectId = require('mongoose').Types.ObjectId
const { Account, Trunk, User, Customer, Call, Contact, Breadcrumb } = require('../schema')
const CustomError = require('../utils/error')
const getCustomerURL = require('../utils/getCustomerURL')
const { addLog } = require('../logs')

// Route GET /answer/:customerNumber/:managerNumber/:trunkNumber
module.exports = async (request, response, next) => {
    let { params: { customerNumber, managerNumber, trunkNumber } } = request

    console.log('Answer to', customerNumber, 'from', managerNumber, 'via', trunkNumber)

    trunkNumber = '+' + trunkNumber
    customerNumber = '+' + customerNumber
    managerNumber = '+' + managerNumber

    const trunk = await Trunk.findOne({ phone: trunkNumber, active: true })
        .populate('account')
        .exec()

    if (!trunk || trunk === null)
        throw new CustomError(`Транк ${trunkNumber} не зарегистрирован либо отключен`, 400)

    const contact = await Contact.findOne({
        account: trunk.account._id, phone: customerNumber
    }).populate({
        path: 'customer', model: 'Customer',
        populate: [
            { path: 'user', model: 'User' },
            { path: 'trunk', model: 'Trunk' }
        ]
    }).lean().exec()

    if (!contact || contact === null)
        throw new CustomError(`Не могу назначить менеджера — клиент ${customerNumber} не найден`, 400)

    const user = await User.findOne({
        account: trunk.account._id, phones: managerNumber
    })

    if (!user || user === null)
        throw new CustomError(`Не могу назначить менеджера — менеджер ${managerNumber} не найден`, 400)

    if (!contact.customer.user) {
        await Customer.update({ _id: contact.customer._id }, { user: user._id })

        const newBreadcrumb = new Breadcrumb({
            date: new Date(),
            account: trunk.account._id,
            customer: contact.customer._id,
            user: user._id,
            type: 'assigned'
        })
        const createdBreadcrumb = await newBreadcrumb.save()
    }

    addLog({
        type: 'answer',
        what: 'менеджер ответил',
        payload: { customerNumber, managerNumber, trunkNumber }
    })

    // response.json({ user, customer: contact.customer })
    response.json({ status: 200 })
}