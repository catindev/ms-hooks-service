const toObjectId = require('mongoose').Types.ObjectId
const { Account, Trunk, User, Customer, Call } = require('./schema')
const CustomError = require('./utils/error')
const namer = require('./utils/namer')
const formatNumber = require('./utils/formatNumber')
const { addLog } = require('./logs')
const sendPush = require('./utils/sendPush')
const { promisify } = require('util')
const sendPushAsync = promisify(sendPush)

async function incomingCustomer({ customerNumber, trunkNumber }) {
    trunkNumber = '+' + trunkNumber
    customerNumber = '+' + customerNumber

    const trunk = await Trunk.findOne({ phone: trunkNumber, active: true })
        .populate('account')
        .exec()

    if (!trunk || trunk === null)
        throw new CustomError(`Транк ${trunkNumber} не зарегистрирован либо отключен`, 400)

    const existingCustomer = await Customer.findOne({
        account: trunk.account._id, phones: customerNumber
    })

    if (existingCustomer) return existingCustomer

    const newCustomer = new Customer({
        account: trunk.account._id,
        phones: [customerNumber],
        trunk: trunk._id
    })

    return await newCustomer.save()
}

async function answerToCustomer({ customerNumber, managerNumber, trunkNumber }) {
    trunkNumber = '+' + trunkNumber
    customerNumber = '+' + customerNumber
    managerNumber = '+' + managerNumber

    const trunk = await Trunk.findOne({ phone: trunkNumber, active: true })
        .populate('account')
        .exec()

    if (!trunk || trunk === null)
        throw new CustomError(`Транк ${trunkNumber} не зарегистрирован либо отключен`, 400)

    const customer = await Customer.findOne({ account: trunk.account._id, phones: customerNumber })
    if (!customer || customer === null)
        throw new CustomError(`Не могу назначить менеджера — клиент ${customerNumber} не найден`, 400)

    const user = await User.findOne({ account: trunk.account._id, phones: managerNumber })
    if (!user || user === null)
        throw new CustomError(`Не могу назначить менеджера — менеджер ${managerNumber} не найден`, 400)

    if (!customer.user) await Customer.update({ _id: customer._id }, { user: user._id })

    return { user, customer }
}

module.exports = { incomingCustomer, answerToCustomer }