import {model, Schema} from 'mongoose'

const StateSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    }
})

export default model("State", StateSchema)