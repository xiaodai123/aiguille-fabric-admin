const { getPath } = require('./utils');
const publicjs = require('./public');
module.exports = {
    dev: {
        path: getPath(publicjs.outputPath.dev), // 通过HtmlWebpackPlugin插件生成的html文件存放在这个目录下面
        chunkFilename: '[name].chunk.js',
        filename: 'js/[name].js',
        publicPath: '/aiguille-fabric-admin/',
        port: 9088,
        host: '127.0.0.1',
        devtool: 'cheap-module-eval-source-map',
        cssSourceMap: true,
        cacheBusting: true, // 一个配合devtool的配置，当给文件名插入新的hash导致清楚缓存时是否生成souce maps，默认在开发环境下为true
        proxyTable: {
            '/aiguille_fabric': {
                target: 'http://221.226.40.56:18121',
                changeOrigin: true,
                secure: false,
                pathRewrite: { '^/aiguille_fabric' : '/' }
            }
        },
        autoOpenBrowser: true,
        poll: false
    },
    prod: {
        // path: getPath(publicjs.outputPath.prod),
        path: publicjs.outputPath.prod,
        chunkFilename: '[name].[chunkhash:8].min.js',
        filename: 'js/[name][chunkhash:8].js',
        publicPath: '/aiguille-fabric-admin/',
        devtool: '#source-map',
        productionSourceMap: true,
        productionGzip: true,
        productionGzipExtensions: ['js', 'css'],
        bundleAnalyzerReport: true
    },
    build: {
        useEslint: true,
        filePath: {
            login: {
                js: './src/app/login.js',
                html: './src/app/login.html'
                // css: './src/assets/css/login.scss'
            },
            aifAdmin: {
                js: './src/app/aifAdmin.js',
                html: './src/app/aifAdmin.html'
                // css: './src/assets/css/login.scss'
            }
        }
    }
}