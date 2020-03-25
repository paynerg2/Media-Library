module.exports = {
    roots: ['<rootDir>/server'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    testEnvironment: 'node',
    setupFiles: ['jest-localstorage-mock'],
    collectCoverage: true
};
