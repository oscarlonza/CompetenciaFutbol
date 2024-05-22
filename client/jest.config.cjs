module.exports = {
    testEnvironment: 'jest-environment-jsdom',
    setupFiles: ['./jest.setup.js'],
    transform: {
        "^.+\\.jsx?$": "babel-jest",
        "\\.(jpg|jpeg|png|gif|svg)$": "jest-transform-stub",
    }
}
