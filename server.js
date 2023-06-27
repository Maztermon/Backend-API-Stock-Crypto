const express = require('express');
const yahooFinance = require('yahoo-finance');
const app = express();
const PORT = 3000;

// Cache เพื่อเก็บข้อมูลราคาหุ้นและคริปโตเคอร์เรนซี
const cache = {};

// Middleware เพื่อเปิดให้สามารถเรียกใช้งานผ่าน CORS ได้
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// Endpoint API เพื่อรับราคาหุ้นตามสัญลักษณ์ (ticker symbol)
app.get('/stock/:symbol', async (req, res) => {
  const { symbol } = req.params;

  // ตรวจสอบว่ามีข้อมูลในแคชหรือไม่
  if (cache[symbol] && Date.now() - cache[symbol].timestamp < 60000) {
    console.log('ให้บริการราคาหุ้นจากแคช:', symbol);
    return res.json(cache[symbol].data);
  }

  try {
    // ดึงข้อมูลหุ้นจาก API Yahoo Finance
    const quote = await yahooFinance.quote({
      symbol,
      modules: ['price'],
    });

    // เก็บข้อมูลในแคช
    cache[symbol] = {
      timestamp: Date.now(),
      data: quote.price,
    };

    console.log('ดึงข้อมูลราคาหุ้นและเก็บลงแคช:', symbol);
    res.json(quote.price);
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลหุ้น:', error);
    res.status(500).json({ error: 'ไม่สามารถดึงข้อมูลหุ้นได้' });
  }
});

// Endpoint API เพื่อรับราคาคริปโตเคอร์เรนซีตามสัญลักษณ์ (ticker symbol)
app.get('/crypto/:symbol', async (req, res) => {
  const { symbol } = req.params;

  // ตรวจสอบว่ามีข้อมูลในแคชหรือไม่
  if (cache[symbol] && Date.now() - cache[symbol].timestamp < 60000) {
    console.log('ให้บริการราคาคริปโตเคอร์เรนซีจากแคช:', symbol);
    return res.json(cache[symbol].data);
  }

  try {
    // ดึงข้อมูลคริปโตเคอร์เรนซีจาก API Yahoo Finance
    const quote = await yahooFinance.quote({
      symbol,
      modules: ['price'],
    });

    // เก็บข้อมูลในแคช
    cache[symbol] = {
      timestamp: Date.now(),
      data: quote.price,
    };

    console.log('ดึงข้อมูลราคาคริปโตเคอร์เรนซีและเก็บลงแคช:', symbol);
    res.json(quote.price);
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลคริปโตเคอร์เรนซี:', error);
    res.status(500).json({ error: 'ไม่สามารถดึงข้อมูลคริปโตเคอร์เรนซีได้' });
  }
});

// เริ่มเซิร์ฟเวอร์
app.listen(PORT, () => {
  console.log(`เซิร์ฟเวอร์ทำงานที่พอร์ต ${PORT}`);
});
