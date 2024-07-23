import {Schema,model,models} from "mongoose";

const MovieSchema = new Schema({
    MovieName:{
        type:String,
        required:true,
    },
    MovieYear:{
        type:Number,
        required:true,
    },
    MovieGenre:{
        type:String,
        required:true,
    },
    MovieStars:{
        type:Number,
        required:true,
    },
    MovieDirector:{
        type:String,
        required:true,
    },
    MovieDescription:{
        type:String,
        required:true,
    },
    MovieFileName:{
        type:String,
        required:true,
    },
    MovieSmallImage:{
        type:String,
        required:true,
    },
    MovieDuration:{
        type:Number,
        required:true,
    },
    MovieScreenshots:{
        type:Array,
        required:true,
    },
    MovieCountry:{
        type:String,
        required:true,
    },
});

const Movie = models.Movie || model("Movie",MovieSchema);

export default Movie;