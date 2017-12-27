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

    const trunk = await Trunk.findOne({ 
        phone: formatNumber(trunkNumber, false),
        active: true
    })
        .populate('account')
        .exec()

    if (!trunk || trunk === null) 
        throw new CustomError(`Транк ${ trunkNumber } не зарегистрирован либо отключен`, 400)

    if (record && !managerNumber) 
        throw new CustomError(`Не указан номер менеджера для отвеченного звонка`, 400)

    const account = trunk.account._id

    const user = await User.findOne({ account, phones: formatNumber(managerNumber, false) })

    let customer = await Customer.findOne({ account, phones: formatNumber(customerNumber, false) })
    if (!customer || customer === null) {
        const newCustomer = new Customer({ 
            account, 
            phones: [customerNumber], 
            trunk: trunk._id,
            user: user && record ? user._id : undefined
        })
        customer = await newCustomer.save()
    }

    console.log('is set user for', customerNumber, !customer.user && user && record)

    if (!customer.user && user && record) {
        await Customer.update({ _id: customer._id }, { user: user._id })
    }

    const newCall = new Call({
        date: new Date(),
        account,
        trunk: trunk._id,
        customer: customer._id,
        user: user? user._id : undefined,
        answeredBy: user? user._id : undefined,
        record,
        duration: {
          waiting: waitingDuration,
          conversation: conversationDuration
        },
        isCallback
    })

    // const setActivity = await Customer.update(
    //     { _id: customer._id }, 
    //     { 
    //         lastUpdate: new Date(), 
    //         lastActivity: record? 'входящий звонок' : 'пропущенный'
    //     })

    console.log('Call is OK')

    return await newCall.save()
}