export const authHeader = () => {
    // Return authorization header with JWT
    const env = process.env.NODE_ENV;
    const localUser = env === 'test' ? null : localStorage.getItem('user');
    let user = localUser && JSON.parse(localUser);

    if (user && user.token) {
        return { Authorization: 'Bearer ' + user.token };
    } else {
        return {};
    }
};
