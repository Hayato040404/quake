// index.js
const express = require('express');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// 静的ファイルを提供するディレクトリを設定
app.use(express.static(path.join(__dirname, 'public')));

// 地震データを取得し、クライアントに送信
app.get('/api/earthquakes', async (req, res) => {
    try {
        const quakeApiUrl = `https://quake.one/api/list.json`;
        const response = await fetch(quakeApiUrl);
        if (!response.ok) throw new Error('Failed to fetch earthquake data');
        const quakeList = await response.json();
        res.json(quakeList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching earthquake data' });
    }
});

// 地震詳細データを取得し、クライアントに送信
app.get('/api/earthquakes/:eventId/details', async (req, res) => {
    const { eventId } = req.params;
    try {
        const detailsUrl = `http://files.quake.one/${eventId}/largeScalePoints.json`;
        const response = await fetch(detailsUrl);
        if (!response.ok) throw new Error('Failed to fetch earthquake details');
        const detailsData = await response.json();
        res.json(detailsData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching earthquake details' });
    }
});

// サーバーを開始
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
