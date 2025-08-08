import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
const userScehma = new mongoose.Schema(
    {
        fullName:{
            type: String,
            required: true,
            
        },
        email:{
            type: String,
            required: true,
            unique:true,
        },
        password:{
            type: String,
            required: true,
            minlenght: 6
        },
        bio:{
            type: String,
            default:"",
        },
        avatar:{
            type: String,
            default:"",
        },
        location:{
            type: String,
            default:"",
        },
        isOnboarded:{
            type: Boolean,
            default:false,
        },
        friends:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    {timestamps:true}
)


// a prehook to becrypt the password before saving
userScehma.pre("save", async function (next){
    if(!this.isModified("password")){
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(9)
        this.password= await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        console.log("Error in becrytpitng the password")
        next(error)
    }
})
userScehma.methods.matchPassword= async function (enterdPassword) {
    const isPasswordCorrect= await bcrypt.compare(enterdPassword, this.password)
    return isPasswordCorrect
}
const User = mongoose.model('User', userScehma)
export default User