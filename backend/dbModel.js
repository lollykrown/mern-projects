import mongoose from 'mongoose';

const instance = mongoose.Schema({
    cation:String,
    user:String,
    image: {
        data:Buffer,
        contentType:String
    },
    comment:[]
})

export default mongoose.model('posts', instance)