require.config({
    baseUrl: '../node_modules',
    paths: {
        app: '../www/app'
    }
})

requirejs(['app/tetris'])
