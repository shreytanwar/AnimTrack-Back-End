const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const listSchema = new Schema({
    list_name:{
        type: String
    },
    list:[{
        mal_id:{
            type: Number      
        }
    }]
});

module.exports ={
    ListModel : mongoose.model("List", listSchema),
    ListSchema: listSchema
  };
