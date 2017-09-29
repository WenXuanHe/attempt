import {find} from '../model/todo';

const resolvers = {

    Query: {
        passenger: (_, args) => {
            return find(args);
        }
    }
};

export default resolvers;
