const { User } = require('../models')

const userController = {
    getAllUsers(req, res) {
        User.find({})
            .populate({
                path: 'thoughts',
                select: '-__v'
            })
            .select('-__v')
            .sort({ _id: -1 })
            .then(userDb => res.json(userDb))
            .catch(err => {
                console.log(err)
                res.status(400).json(err)
            })
    },

    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
            .populate({
                path: 'thoughts',
                select: '-__v'
            })
            .select('-__v')
            .sort({ _id: -1 })
            .then(userDb => {
                if (!userDb) {
                    res.status(400).json({ message: 'No user found with this id!' })
                    return
                }
                res.json(userDb)
            })
            .catch(err => {
                console.log(err)
                res.status(400).json(err)
            })
    },

    createUser({ body }, res) {
        User.create(body)
            .then(userDb => res.json(userDb))
            .catch(err => res.json(err))
    },

    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
            .then(userDb => {
                if (!userDb) {
                    res.status(400).json({ message: 'No user found with this id!' })
                    return
                }
                res.json(userDb)
            })
            .catch(err => res.status(400).json(err))
    },

    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
            .then(userDb => {
                if (!userDb) {
                    res.status(400).json({ message: 'No user found with this id!' })
                    return
                }
                res.json(userDb)
            })
            .catch(err => res.status(400).json(err))
    },

    addFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $push: { friends: params.friendId }},
            { new: true, runValidators: true }
        )
            .then(userDb => {
                if (!userDb) {
                    res.status(400).json({ message: 'No user found with this id!' })
                    return
                }
                res.json(userDb)
            })
            .catch(err => res.status(400).json(err))
    },

    deleteFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $pull: { friends: params.friendId }},
            { new: true, runValidators: true }
        )
            .then(userDb => {
                if (!userDb) {
                    res.status(400).json({ message: 'No user found with this id!' })
                    return
                }
                res.json(userDb)
            })
            .catch(err => res.status(400).json(err))
    }
}

module.exports = userController