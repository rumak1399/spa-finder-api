import {model, Schema} from 'mongoose'

const CitySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    stateId: {
        type: Schema.Types.ObjectId,
        required: true
    }
})

export default model("City", CitySchema)