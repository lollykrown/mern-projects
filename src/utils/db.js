const mongoose = require("mongoose");

const connectToDb = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGOURI, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    console.log(`Connected to database ${connection.connections[0].name}`);
  } catch (err) {
    console.error(err);
  }
};

//DB config
// mongoose.connect(process.env.URL, {
//     useNewUrlParser:true,
//     useCreateIndex:true,
//     useUnifiedTopology:true
// })
// mongoose.connection.once('open', ()=> {
//     console.log('db connected')
    
//     const changeStream = mongoose.connection.collection('posts').watch();

//     changeStream.on('change', (change) => {
//         console.log('change triggered on pusher')
//         console.log(change);
//         console.log('end of change');

//         if (change.operationType === 'insert') {
//             console.log('Triggering Pusher **IMG UPLOAD***')

//             const postDetails = change.fullDocument;
//             pusher.trigger('posts', 'inserted', {
//                 user: postDetails.user,
//                 capton: postDetails.caption,
//                 image: postDetails.image
//             })
//         } else {
//             console.log('unknown trigger from pusher')
//         }
//     })
// })


module.exports = connectToDb;
