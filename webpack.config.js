const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: { main: './src/components/index.js' },  // Указываем правильный путь к основному JS файлу
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'assets/js/main.js',
        publicPath: '',  // Оставляем пустым, так как не требуется абсолютный путь
    },
    mode: 'development',  // Режим разработки
    devServer: {
        static: path.resolve(__dirname, './dist'),  // Путь к директории для статических файлов
        compress: true,  // Сжатие
        port: 8080,  // Порт для dev server
        open: true,  // Автоматически открывать браузер
        watchFiles: ['src/**/*.js', 'src/**/*.css'],  // Отслеживание изменений в JS и CSS файлах
        hot: true  // Включает Hot Module Replacement для CSS и JS
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader',  // Используем Babel для транспиляции JS
                exclude: /node_modules/  // Исключаем node_modules
            },
            {
                test: /\.(png|svg|jpg|gif)$/,  // Обработка изображений и шрифтов
                type: 'asset/resource',
                generator: {
                    filename: 'assets/images/[name].[hash][ext]',  // Определяем, где сохранять файлы
                }
            },
            {
                test: /\.woff(2)?|eot|ttf|otf$/,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/fonts/[name].[hash][ext]',  // Определяем, где сохранять файлы
                }
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,  // Извлечение CSS в отдельный файл
                    'css-loader',
                    'postcss-loader'
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',  // Путь к шаблону HTML файла
            filename: 'index.html',  // Имя выходного HTML файла
            inject: 'body',  // Вставляем теги <script> в конец body
        }),
        new CleanWebpackPlugin(),  // Очистка директории dist перед каждой сборкой
        new MiniCssExtractPlugin()
    ]
};
