const mongoose=require('mongoose');
const mongoURI='mongodb://localhost:27017/inotebook';

connectToMongo=()=>{
    mongoose.connect(mongoURI,()=>{
        console.log('connect success');
    })  
}
module.exports=connectToMongo;
