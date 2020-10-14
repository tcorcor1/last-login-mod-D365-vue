module.exports = {
    configureWebpack: {
        optimization: {
            splitChunks: false
        }
    },
    productionSourceMap: false,
    css: {
        extract: false,
    },
}