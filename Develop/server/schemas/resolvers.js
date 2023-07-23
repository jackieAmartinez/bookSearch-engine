const { User, Book } = require("../models");
const { signToken } = require("../utils/auth");
const { AuthenticationError } = require("apollo-server-express");

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {

                const userData = await User.findOne({ _id: context.user._id })
                    .select("-__v -password")
                console.log(userData);
                return userData;
            }

            throw new AuthenticationError("Not logged in");
        },
    },
    Mutation: {
        createUser: async (parent, { username, email, password }, context) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);

            return { token, user };
        },
        loginUser: async (parent, { email, password }, context) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError(
                    "No user found with this email address"
                );
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError("Incorrect password");
            }

            const token = signToken(user);
            return { token, user };
        },
        saveBook: async (parent, { input }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: input } },
                    { new: true }
                ).populate('savedBooks');

                return updatedUser;
            }

            throw new AuthenticationError("You need to be logged in!");
        },
        deleteBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId } } },
                    { new: true }
                ).populate('savedBooks');

                return updatedUser;
            }

            throw new AuthenticationError("You need to be logged in!");
        },
    },
};

module.exports = resolvers;

// const { User } = require('../models');
// const { signToken } = require('../utils/auth');
// const { AuthenticationError } = require('apollo-server-express');

// module.exports ={
//     Query: {
//         me: async function(parent, args, context) {
//             const foundUser = await User.findOne({
//                 _id: context.user._id
//             });

//             if (!foundUser) {
//                 throw new AuthenticationError('Cannot find a user with this id!')
//             }

//             return(foundUser);
//             },
//     },

//     Mutation: {
//         createUser: async function(parent, args, context) {
//             const user = await User.create(args);

//             if (!user) {
//                 throw new AuthenticationError('Something is wrong!')
//             }
//             const token = signToken(user);
//             return({ token, user: user.toObject() });
//         },
//           // login a user, sign a token, and send it back (to client/src/components/LoginForm.js)
//           // {body} is destructured req.body
//         loginUser: async function(parent, args, context) {
//             const user = await User.findOne({ $or: [{ username: args.username }, { email: args.email }] });
//             if (!user) {
//                 throw new AuthenticationError("Cant Find User!")
//             }

//             const correctPw = await user.isCorrectPassword(args.password);

//             if (!correctPw) {
//                 throw new AuthenticationError('Wrong Password!')
//             }
//             const token = signToken(user);
//             return ({ token, user: user.toObject() });
//         },
//           // save a book to a user's `savedBooks` field by adding it to the set (to prevent duplicates)
//           // user comes from `req.user` created in the auth middleware function
//         saveBook: async function(parent, args, context) {
//             if(!context.user) {
//                 throw new AuthenticationError('You need to be logged in!')
//             }
//             try {
//                 const updatedUser = await User.findOneAndUpdate(
//                     { _id: context.user._id },
//                     { $addToSet: { savedBooks: args.input } },
//                     { new: true, runValidators: true }
//             );
//                 return (updatedUser);
//             } catch (err) {
//                 console.log(err);
//                 throw new AuthenticationError('Something is wrong!')
//             }
//         },
//           // remove a book from `savedBooks`
//         deleteBook: async function(parent, args, context) {
//             if(!context.user) {
//                 throw new AuthenticationError('You need to be logged in!')
//             }
//             const updatedUser = await User.findOneAndUpdate(
//                 { _id: context.user._id },
//                 { $pull: { savedBooks: { bookId: args.bookId } } },
//                 { new: true }
//             );
//             if (!updatedUser) {
//                 throw new AuthenticationError('Something is wrong!')
//             }
//             return  (updatedUser);
//         },
//     },

// }