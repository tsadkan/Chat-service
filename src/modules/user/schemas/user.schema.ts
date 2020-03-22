import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../models/user';

const SALT_WORK_FACTOR = 10;

const user = new mongoose.Schema({
    name: String,
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    admin: Boolean,
    password: { type: String, required: true },
}, { timestamps: true });

user.pre('save', function(this: User, next) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const user = this;
    if(!this.isModified('password')) return next()  

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if(err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash) {
            if(err) return next(err);

            user.password = hash;
            next();
        })
    })
})

user.methods.comparePassword = async function (candidatePassword, user: User) {

    return await bcrypt.compare(candidatePassword, user.password);
};

/**
 * Serializes user to send throw the JWT token
 */
user.methods.serialize = function(user) {
    return {
        _id: user._id,
        username: user.username,
        email: user.email
    };
}

export const UserSchema = user;