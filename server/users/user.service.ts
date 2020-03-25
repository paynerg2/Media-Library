import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';

import User from '../users/user.model';
import { IUser } from './user.interface';
import {
    duplicateEmail,
    duplicateUsername,
    userNotFound
} from '../../client/src/lib/messages/user.errorMessages';
import { logger } from '../_helpers/logger';

const authenticate = async ({ username, password }: UserParams) => {
    let user = await User.findOne({ username });
    if (user && bcrypt.compareSync(password, user.hash)) {
        const { hash, ...userWithoutHash } = user.toObject();
        const secret: jwt.Secret = process.env.SECRET as jwt.Secret;
        const token = jwt.sign({ sub: user.id }, secret);
        return { ...userWithoutHash, token };
    }
};

const getAll = async (): Promise<IUser[]> => {
    // Return all users without hashed passwords
    return await User.find().select('-hash');
};

const getById = async (id: string): Promise<IUser | null> => {
    try {
        return await User.findById(id).select('-hash');
    } catch (err) {
        logger.error(`${err} + ${userNotFound}`);
        throw Error(userNotFound);
    }
};

const create = async (userParam: UserParams) => {
    // Check if username or email already exists
    const usernameExists = await User.findOne({ username: userParam.username });
    if (usernameExists) {
        logger.error(
            `Error in create service method: ${duplicateUsername} | username: ${userParam.username}`
        );
        throw Error(duplicateUsername);
    }
    const emailExists = await User.findOne({ email: userParam.email });
    if (emailExists) {
        logger.error(
            `Error in create service method: ${duplicateEmail} | email: ${userParam.email}`
        );
        throw Error(duplicateEmail);
    }

    const userParamWithoutPassword = {
        username: userParam.username,
        email: userParam.email,
        createdDate: userParam.createdDate
    };

    let user: IUser = new User(userParamWithoutPassword);

    // Hash password
    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }

    await user.save();
};

const update = async (id: string, userParam: UserParams) => {
    let user;
    try {
        user = await User.findById(id);
    } catch (err) {
        logger.error(`${err} + ${userNotFound}`);
        throw Error(userNotFound);
    }

    if (!user) {
        logger.error(`Error in update service method: ${userNotFound}`);
        throw new Error(userNotFound);
    }

    // Username checks
    let updatingUsername: boolean = false;
    if (userParam.username) {
        updatingUsername = user.username !== userParam.username;
    }
    let userNameAlreadyExists = null;
    if (updatingUsername) {
        userNameAlreadyExists = await User.findOne({
            username: userParam.username
        });
    }
    if (updatingUsername && userNameAlreadyExists) {
        logger.error(
            `Error in update service method: ${duplicateUsername} | username: ${userParam.username}`
        );
        throw Error(duplicateUsername);
    }

    // Email checks
    let updatingEmail;
    if (userParam.email) {
        updatingEmail = user.email !== userParam.email;
    }
    let emailAlreadyExists;
    if (updatingEmail) {
        emailAlreadyExists = await User.findOne({ email: userParam.email });
    }
    if (updatingEmail && emailAlreadyExists) {
        logger.error(
            `Error in update service method: ${duplicateEmail} | email: ${userParam.email}`
        );
        throw Error(duplicateEmail);
    }

    // Hash password if updating
    let { password, ...userParamWithoutPassword } = userParam;
    if (password) {
        user.hash = bcrypt.hashSync(password, 10);
    }

    Object.assign(user, userParamWithoutPassword);
    await user.save();
};

const _delete = async (id: string) => {
    await User.findByIdAndRemove(id);
};

// Interfaces
interface UserParams {
    username: string;
    email: string;
    createdDate: Date;
    password: string;
}

export interface IUserService {
    authenticate: (userParam: UserParams) => any;
    getAll: () => Promise<IUser[]>;
    getById: (id: string) => Promise<IUser | null>;
    create: (userParam: UserParams) => void;
    update: (id: string, userParam: UserParams) => void;
    delete: (id: string) => void;
}

export const userService: IUserService = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete
};
