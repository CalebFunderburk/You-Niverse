const { Schema, model } = require('mongoose')

const UserSchema = new Schema ({
    username: {
        type: String,
        unique: true,
        required: 'Please provide a username',
        trim: true
    },
    email: { 
        type: String,
        unique: true,
        required: 'Please provide an email',
        trim: true,
        lowercase: true,
        match: [/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/, 'Please provide a valid email']
    },
    thoughts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Thought'
        }
    ],
    // Check about self-referencing
    // validate: [(newText) => newText.length <= 280]
    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
},
{
    toJSON: {
        virtuals: true,
        getters: true
    },
    id: false
})

UserSchema.virtual('friendCount').get(function() {
    return this.friends.length
})

const User = model('User', UserSchema)

module.exports = User