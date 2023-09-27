const dotenv = require('dotenv')
const User = require('../models/User')
const Plan = require('../models/Plan')
dotenv.config()

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)

const stripeSession = async (planId) => {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: planId,
          quantity: 1
        }
      ],
      success_url: process.env.FRONT_END_HOST + '/success',
      cancel_url: process.env.FRONT_END_HOST + '/cancel'
    })
    return session
  } catch (e) {
    return e
  }
}

const getStripeSession = async (req, res) => {
  const { planId } = req.body

  try {
    const session = await stripeSession(planId)
    const user = await User.findOne({ _id: req.userId })

    user.session = session.id
    await user.save()

    return res.status(200).json({ session })
  } catch (error) {
    res.status(500).send(error)
  }
}

const checkPaid = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.userId })
    const session = await stripe.checkout.sessions.retrieve(user.session)

    if (session.payment_status === 'paid') {
      try {
        const plan = await Plan.findOne({ price: session.amount_total / 100 })

        user.diskSpace = plan.value.diskSpace
        user.plan = plan._id
        user.session = ''
        await user.save()

        res.status(200).json({
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            diskSpace: user.diskSpace,
            usedSpace: user.usedSpace,
            avatarUrl: user.avatarUrl,
            plan: user.plan
          }
        })
      } catch (error) {
        return res.status(500).json({ message: 'Something went wrong!' })
      }
    } else {
      return res.status(500).json({ message: 'Payment failed' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Payment failed' })
  }
}

module.exports = { checkPaid, getStripeSession }
