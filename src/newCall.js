const toObjectId = require('mongoose').Types.ObjectId
const { Account, Trunk, User, Customer, Call } = require('./schema')
const CustomError = require('./utils/error')
const namer = require('./utils/namer')

module.exports = async function ({
    clientNumber,
    trunkNumber,
    redirectNumber,
    record = false,
    waitingDuration = 0,
    conversationDuration = 0,
    crmCallID = false
}) {

    const trunk = await Trunk.findOne({ phone: trunkNumber })
        .populate('account')
        .exec()
    if (!trunk || trunk === null) return false

    const account = trunk.account._id

    const user = await User.findOne({ account, phones: redirectNumber })

    let customer = await Customer.findOne({ account, phones: clientNumber })

    if (!customer || customer === null) {
        const newCustomer = new Customer({ account, phones: [clientNumber] })
        customer = await newCustomer.save()
    }

    if (!customer.user && user) Customer.update({ _id: customer._id }, { user: user._id })

    const newCall = new Call({
        account,
        trunk: trunk._id,
        customer: customer._id,
        user: user ? user._id : false,
        record,
        duration: {
          waiting: waitingDuration,
          conversation: conversationDuration
        }
    })
    crmCallID && (newCall.type = 'callback')

    return await newCall.save()
}