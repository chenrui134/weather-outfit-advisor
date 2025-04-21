const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // 只允许 GET 请求
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    // 从查询参数中获取城市信息
    const { lat, lon, lang = 'zh_cn' } = event.queryStringParameters || {};

    if (!lat || !lon) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required parameters: lat, lon' })
      };
    }

    // 从环境变量获取 API 密钥
    const apiKey = process.env.OPENWEATHER_API_KEY;
    
    // 调用 OpenWeatherMap API
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=${lang}`
    );
    
    const data = await response.json();

    // 返回天气数据
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300' // 缓存5分钟
      },
      body: JSON.stringify(data)
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
}; 