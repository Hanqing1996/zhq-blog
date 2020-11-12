// module.exports = {
//     webpack: (config, options) => {
//         const {isServer}=options
//         config.module.rules.push({
//             test: /\.(png|jpg|jpeg|gif|svg)$/,
//             use: [
//                 {
//                     loader: 'file-loader',
//                     options:{
//                         name:'[name].[contenthash].[ext]',
//                         outputPath:'static',
//                         publicPath:'_next/static'
//                     }
//                 },
//
//             ]
//         })
//         return config
//     }
// }
//

const withImages = require('next-images')
module.exports = withImages()