const connection = require('../config/connection');
const { User, Thought, Reaction } = require('../models');

const usersData = [
    {
        username: 'poncho',
        email: 'poncho@me.com',
        thoughts: [],
        friends: ['665989eea2a1b376f190e997']
    },
    {
        username: 'milad',
        email: 'milad@me.com',
        thoughts: [],
        friends: ['665989eea2a1b376f190e998'
        ]
    }
];

const thoughtsData = [
    {
        thoughtText: 'This is a sample thought',
        username: 'poncho',
        reactions: ['665990ecbc67b30ee1acc037']
    },
    {
        thoughtText: 'This is a sample thought',
        username: 'milad',
        reactions: ['665990ecbc67b30ee1acc035']
    }
];

const reactionsData = [
  {
    reactionBody: '¡WOOW!',
    username: 'poncho',
    createdAt: '2024-05-31T12:00:00.000Z'
  },
  {
    reactionBody: '¡COOL!',
    username: 'Milad',
    createdAt: '2024-05-31T12:00:00.000Z'
  }
];


async function seed() {
    try {
        await User.deleteMany();
        await Thought.deleteMany();
        await Reaction.deleteMany(); 

        const createdUsers = await User.create(usersData);
        const createdThoughts = await Thought.create(thoughtsData);
        const createdReactions = await Reaction.create(reactionsData);

        for (const user of createdUsers) {
            user.thoughts = createdThoughts.filter(thought => thought.username === user.username).map(thought => thought._id);
            user.reactions = createdReactions.filter(reaction => reaction.username === user.username).map(reaction => reaction._id);
            await user.save();
        }

        console.log('Data seeded successfully');
    } catch (err) {
        console.error('Error seeding data:', err);
    } finally {
        connection.close();
    }
}

module.exports = seed;
