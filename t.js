const http = require('http');
function test(path) {
    return new Promise((resolve) => {
        http.get('http://localhost:8080' + path, (res) => {
            resolve({ path, status: res.statusCode, location: res.headers.location || 'none' });
        }).on('error', (e) => resolve({ path, error: e.message }));
    });
}
(async () => {
    for (const p of ['/api-docs', '/api-docs/', '/swagger', '/auth/github/callback', '/']) {
        console.log(await test(p));
    }
    process.exit(0);
})();
