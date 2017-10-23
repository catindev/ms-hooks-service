const toObjectId = require('mongoose').Types.ObjectId
const { Account, Trunk, User, Customer, Call } = require('./schema')
const CustomError = require('./utils/error')
const namer = require('./utils/namer')
const formatNumber = require('./utils/formatNumber')

module.exports = async function ({
    customerNumber,
    trunkNumber,
    managerNumber,
    waitingDuration = 0,
    conversationDuration = 0,
    record,
    isCallback
}) {
    const trunk = await Trunk.findOne({ phone: formatNumber(trunkNumber, false) })
        .populate('account')
        .exec()

    if (!trunk || trunk === null) 
        throw new CustomError(`Транк ${ trunkNumber } не зарегистрирован`, 400)

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
            user: user ? user._id : undefined
        })
        customer = await newCustomer.save()
    }

    if (!customer.user && user) 
        await Customer.update({ _id: customer._id }, { user: user._id })

    const newCall = new Call({
        account,
        trunk: trunk._id,
        customer: customer._id,
        user: user? user._id : undefined,
        record,
        duration: {
          waiting: waitingDuration,
          conversation: conversationDuration
        },
        isCallback
    })

    return await newCall.save()
}