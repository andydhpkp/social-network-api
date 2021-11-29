const { Thought, User } = require('../models')

const thoughtController = {
    getAllThoughts(req, res) {
        Thought.find({})
            .select('-__v')
            .sort({ _id: -1 })
            .then(thoughtDb => res.json(thoughtDb))
            .catch(err => {
                console.log(err)
                res.status(400).json(err)
            })
    },

    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
            .select('-__v')
            .sort({ _id: -1 })
            .then(thoughtDb => {
                if (!thoughtDb) {
                    res.status(400).json({ message: 'No thought found with this id!' })
                    return
                }
                res.json(thoughtDb)
            })
            .catch(err => {
                console.log(err)
                res.status(400).json(err)
            })
    },

    createThought({ body }, res) {
        Thought.create(body)
            .then(({ _id }) => {
                return User.findOneAndUpdate(
                    { _id: body.userId },
                    { $push: { thoughts: _id }},
                    { new: true }
                )
            })
            .then(userDb => {
                if (!userDb) {
                    res.status(400).json({ message: 'No user found with this id!' })
                    return
                }
                res.json(userDb)
            })
            .catch(err => res.status(400).json(err))
    },

    updateThoughById({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
            .then(thoughtDb => {
                if (!thoughtDb) {
                    res.status(400).json({ message: 'No thought found with this id!' })
                    return
                }
                res.json(thoughtDb)
            })
            .catch(err => res.status(400).json(err))
    },

    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
            .then(thoughtDb => {
                if (!thoughtDb) {
                    res.status(400).json({ message: 'No thought found with this id!' })
                    return
                }
                res.json(thoughtDb)
            })
            .catch(err => res.status(400).json(err))
    },

    createReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body }},
            { new: true, runValidators: true }
        )
            .then(thoughtDb => {
                if (!thoughtDb) {
                    res.status(400).json({ message: 'No thought found with this id!' })
                    return
                }
                res.json(thoughtDb)
            })
            .catch(err => res.status(400).json(err))
    },

    deleteReaction({ params }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId }}},
            { new: true }
        )
            .then(thoughtDb => res.json(thoughtDb))
            .catch(err => res.json(err))
    }
}

module.exports = thoughtController