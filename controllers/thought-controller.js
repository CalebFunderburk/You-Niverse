const { Thought } = require('../models')
const { param } = require('../routes')

const thoughtController = {

    getAllThoughts(req, res) {
        Thought.find({})
            .sort({ _id: -1 })
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => {
                console.log(err)
                res.status(400).json(err)
            })
    },

    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
            .populate({
                path: 'reactions',
                select: '-__v'
            })
            .select('-__v')
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought found with this id' })
                    return
                }
                res.json(dbThoughtData)
            })
            .catch(err => {
                console.log(err)
                res.status(400).json(err)
            })
    },

    createThought({ body }, res) {
        Thought.create(body)
            .then(({ _id }) => {
                return Thought.findOneAndUpdate(
                    { _id: param.userId },
                    { $push: { thoughts: _id } },
                    { new: true, runValidators: true }
                )
            })
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought found with this id' })
                    return
                }
                res.json(dbThoughtData)
            })
            .catch(err => res.json(err))
    },

    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
            .populate({
                path: 'reactions',
                select: '-__v'
            })
            .select('-__v')
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought found with this id' })
                    return
                }
                res.json(dbThoughtData)
            })
            .catch(err => res.status(400).json(err))
    },

    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with this id' })
                return
            }
            res.json(dbThoughtData)
        })
        .catch(err => res.status(400).json(err))
    }

}

module.exports = thoughtController