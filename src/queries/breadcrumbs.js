const toObjectId = require('mongoose').Types.ObjectId
const { Breadcrumb } = require('../schema')

async function createBreadcrumb({ userID, customerID, data }) {
    if (typeof userID === 'string') userID = toObjectId(userID)
    if (typeof customerID === 'string') customerID = toObjectId(customerID)

    const { account: { _id } } = await User
        .findOne({ _id: userID })
        .populate('account')
        .exec()

    const newBreadcrumb = new Breadcrumb(Object.assign({}, data, {
        account: _id,
        customer: customerID,
        user: userID
    }))
    const createdBreadcrumb = await newBreadcrumb.save()

    return await Customer.findOneAndUpdate(
        { _id: customerID },
        { $push: { breadcrumbs: createdBreadcrumb._id } },
        { new: true }
    )
}

module.exports = { createBreadcrumb }