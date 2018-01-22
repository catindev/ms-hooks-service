const toObjectId = require('mongoose').Types.ObjectId
const { Account, Trunk, User, Customer, Call } = require('./schema')
const CustomError = require('./utils/error')
const namer = require('./utils/namer')
const formatNumber = require('./utils/formatNumber')
const { addLog } = require('./logs')

module.exports = async function ({
    customerNumber,
    trunkNumber,
    managerNumber,
    waitingDuration = 0,
    conversationDuration = 0,
    record,
    isCallback
}) {

    console.log('Hook', {
        customerNumber,
        trunkNumber,
        managerNumber,
        waitingDuration,
        conversationDuration,
        record,
        isCallback
    })

    addLog({
        type: 'incoming', what: 'входящий звонок',
        payload: {
            customerNumber,
            trunkNumber,
            managerNumber,
            waitingDuration,
            conversationDuration,
            record,
        }
    })

    console.log(':D', trunkNumber)

    const trunk = await Trunk.findOne({
        phone: '+' + trunkNumber,
        active: true
    })
        .populate('account')
        .exec()

    if (!trunk || trunk === null)
        throw new CustomError(`Транк ${trunkNumber} не зарегистрирован либо отключен`, 400)

    if (record && !managerNumber)
        throw new CustomError(`Не указан номер менеджера для отвеченного звонка`, 400)

    const account = trunk.account._id

    const user = await User.findOne({ account, phones: '+' + managerNumber })

    let customer = await Customer.findOne({ account, phones: '+' + customerNumber })
    if (!customer || customer === null) {
        const newCustomerData = {
            account,
            phones: [customerNumber],
            trunk: trunk._id,
            user: user && record ? user._id : undefined
        }
        if (user && record) newCustomerData.user = user._id
        const newCustomer = new Customer(newCustomerData)
        customer = await newCustomer.save()
    }

    if (!customer.user && user && record) {
        console.log('is set user for', customerNumber, true)
        await Customer.update({ _id: customer._id }, { user: user._id })
    } else console.log('is set user for', customerNumber, false)

    const newCallData = {
        date: new Date(),
        account,
        trunk: trunk._id,
        customer: customer._id,
        duration: {
            waiting: waitingDuration,
            conversation: conversationDuration
        },
        isCallback
    }

    if (record) newCallData.record = record
    if (user || customer.user) newCallData.user = user ? user._id : customer.user
    console.log('DEBUG: user || customer.user', user || customer.user)
    if (user) newCallData.answeredBy = user._id

    console.log('Saving call with user', newCallData.user)

    const newCall = new Call(newCallData)
    console.log('Call is OK')

    return await newCall.save()
}