// server.js
const { createServer } = require('http');
const next = require('next');
const cors = require('cors');
const { parse } = require('url');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();


app.prepare().then(() => {
    const server = createServer((req, res) => {
        // 安全头
        res.setHeader('X-Custom-Header', 'Custom Value');

        // 路由处理
        const parsedUrl = parse(req.url, true);

        // 自定义中间件
        function customMiddleware(req, res, next) {
            // 自定义请求处理逻辑
            console.log('Request received:', req.url);
            next();
        }

        // 性能监控
        const startTime = Date.now();

        // 请求处理
        handle(req, res, parsedUrl);

        // 请求耗时日志
        res.on('finish', () => {
            const duration = Date.now() - startTime;
            console.log(`Request to ${req.url} took ${duration}ms`);
        });
    });

    // WebSocket 支持
    const io = require('socket.io')(server);
    io.on('connection', (socket) => {
        console.log('New WebSocket connection');
        socket.on('custom-event', (data) => {
            // 处理自定义 WebSocket 事件
        });
    });
    // 启动服务器
    server.listen(3000, () => {
        console.log('Server running on http://localhost:3000');
    });
});