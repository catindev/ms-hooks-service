const toObjectId = require('mongoose').Types.ObjectId
const { Account, Trunk, User, Customer, Call, Contact, Breadcrumb } = require('../schema')
const CustomError = require('../utils/error')
const { addLog } = require('../logs')

// const formatNumber = require('../utils/formatNumber')
const formatNumber = (number, strictMode) => `+${number}`

// Route POST /callback
module.exports = async (request, response, next) => {
    const required = ['customerNumber', 'trunkNumber']
    const payloadKeys = Object.keys(request.body)
    const fields = required.filter(key => payloadKeys.indexOf(key) === -1)

    if (fields.length > 0) throw new CustomError(
        `Не заполнены обязательные параметры: ${fields.join(', ')}`,
        400
    )

    const isCallback = true, direction = '→'
    const {
        customerNumber,
        trunkNumber,
        managerNumber,
        waitingDuration = 0,
        conversationDuration = 0,
        record
    } = request.body

    if (record) {
        console.log('End of success call:')
        console.log(direction, '    from', customerNumber, 'to', managerNumber, 'via', trunkNumber)
    } else {
        console.log('End of missing call:')
        console.log(direction, '    from', customerNumber, 'via', trunkNumber)
    }

    const trunk = await Trunk.findOne({
        phone: formatNumber(trunkNumber, false),
        active: true
    })
        .populate('account')
        .exec()

    if (!trunk || trunk === null)
        throw new CustomError(`Не могу сохранить звонок. Транк ${trunkNumber} не зарегистрирован либо отключен`, 400)

    if (record && !managerNumber)
        throw new CustomError(`Не могу сохранить звонок. Не указан номер менеджера для отвеченного звонка`, 400)

    const account = trunk.account._id

    const user = await User.findOne({ account, phones: formatNumber(managerNumber, false) })

    const contact = await Contact.findOne({
        account: trunk.account._id, phone: formatNumber(customerNumber)
    }).populate({
        path: 'customer', model: 'Customer',
        populate: { path: 'user', model: 'User' }
    }).lean().exec()

    if (!contact || contact === null)
        throw new CustomError(`Не могу сохранить звонок. Клиент ${customerNumber} не найден`, 400)

    const newCallData = {
        date: new Date(),
        account,
        trunk: trunk._id,
        customer: contact.customer._id,
        duration: {
            waiting: waitingDuration,
            conversation: conversationDuration
        },
        isCallback,
        contact: contact._id
    }

    if (record) {
        if (!contact.user || contact.user === null) {
            await Customer.update({ _id: contact.customer._id }, { user: user._id })
            const newBreadcrumb = new Breadcrumb({
                date: new Date(), account,
                customer: contact.customer._id,
                user: user._id,
                type: 'assigned'
            })
            const createdBreadcrumb = await newBreadcrumb.save()
        }

        newCallData.record = record

        if (contact.customer.user) newCallData.user = contact.customer.user._id
        else newCallData.user = user._id

        if (user) newCallData.answeredBy = user._id
    }

    const newCall = new Call(newCallData)
    const createdCall = await newCall.save()

    console.log('New call saved')
    console.log('______________')

    const newBreadcrumbData = {
        date: new Date(),
        account,
        customer: contact.customer._id,
        type: 'callback',
        call: createdCall._id
    }
    if (createdCall.user) newBreadcrumbData.user = createdCall.user
    const newBreadcrumb = new Breadcrumb(newBreadcrumbData)
    const createdBreadcrumb = await newBreadcrumb.save()

    addLog({
        type: record ? 'endofcallback' : 'missingcallback',
        what: record ? 'коллбек завершён' : 'пропущенный исходящий',
        payload: {
            customerNumber,
            trunkNumber,
            managerNumber,
            waitingDuration,
            conversationDuration,
            record,
        }
    })

    response.json({ status: 200, call: createdCall })
}