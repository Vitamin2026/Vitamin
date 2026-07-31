const https = require('https');

module.exports = (req, res) => {
    // CORS 허용 및 캐시 방지 설정
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Cache-Control', 'no-store, max-age=0');

    const url = 'https://nfs.faireconomy.media/ff_calendar_thisweek.json';

    https.get(url, (apiRes) => {
        let data = '';

        apiRes.on('data', (chunk) => {
            data += chunk;
        });

        apiRes.on('end', () => {
            try {
                const jsonData = JSON.parse(data);
                res.status(200).json(jsonData);
            } catch (e) {
                res.status(500).json({ error: 'JSON parsing failed' });
            }
        });

    }).on('error', (err) => {
        res.status(500).json({ error: 'Failed to fetch external API' });
    });
};
