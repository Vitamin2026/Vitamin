const https = require('https');

// 서버 메모리에 데이터를 일시적으로 캐싱하기 위한 변수
let cachedData = null;
let cacheTime = 0;
const CACHE_DURATION = 60 * 1000; // 1분 동안은 캐시 유지

module.exports = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Cache-Control', 'no-store, max-age=0');

    const currentTime = Date.now();

    // 캐시된 데이터가 있고 1분이 지나지 않았다면 외부 요청 없이 즉시 반환
    if (cachedData && (currentTime - cacheTime < CACHE_DURATION)) {
        return res.status(200).json(cachedData);
    }

    const url = 'https://nfs.faireconomy.media/ff_calendar_thisweek.json';

    https.get(url, (apiRes) => {
        let data = '';

        apiRes.on('data', (chunk) => {
            data += chunk;
        });

        apiRes.on('end', () => {
            try {
                const jsonData = JSON.parse(data);
                
                // 성공적으로 가져오면 캐시에 저장
                cachedData = jsonData;
                cacheTime = Date.now();

                res.status(200).json(jsonData);
            } catch (e) {
                // 파싱 실패 시 이전 캐시 데이터가 있다면 비상용으로 반환
                if (cachedData) {
                    return res.status(200).json(cachedData);
                }
                res.status(500).json({ error: 'JSON parsing failed' });
            }
        });

    }).on('error', (err) => {
        // 외부 요청 에러 시 이전 캐시 데이터가 있다면 비상용으로 반환
        if (cachedData) {
            return res.status(200).json(cachedData);
        }
        res.status(500).json({ error: 'Failed to fetch external API' });
    });
};
