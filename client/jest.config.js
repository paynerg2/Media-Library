module.exports = {
    roots: ['<rootDir>/src'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    testEnvironment: 'node',
    setupFiles: ['jest-localstorage-mock'],
    collectCoverage: true
};
