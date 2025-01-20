// // local-print-service.ts
// import express from 'express';
// import { createServer } from 'http';
// import { Server } from 'socket.io';
// import { printer as thermalPrinter } from 'node-thermal-printer';
// import { PrinterTypes } from 'node-thermal-printer';
// import cors from 'cors';

// const app = express();
// const httpServer = createServer(app);
// const io = new Server(httpServer, {
//   cors: {
//     origin: "https://your-cloud-server.com", // 替换为你的云服务器地址
//     methods: ["GET", "POST"]
//   }
// });

// app.use(cors());
// app.use(express.json());

// // 配置打印机
// const printer = new thermalPrinter({
//   type: PrinterTypes.EPSON, // 根据实际打印机类型修改
//   interface: 'printer:YOUR_PRINTER_NAME', // 替换为实际打印机名称
//   options: {
//     timeout: 5000
//   },
//   width: 48, // 根据打印机纸张宽度调整
//   characterSet: 'CHINA'
// });

// // WebSocket 连接处理
// io.on('connection', (socket) => {
//   console.log('Client connected');

//   // 监听打印请求
//   socket.on('print-barcode', async (data) => {
//     try {
//       const { imageData } = data;
//       await printBarcode(imageData);
//       socket.emit('print-result', { success: true });
//     } catch (error) {
//       console.error('Print error:', error);
//       socket.emit('print-result', { success: false, error: error.message });
//     }
//   });

//   socket.on('disconnect', () => {
//     console.log('Client disconnected');
//   });
// });

// // 打印函数
// async function printBarcode(imageData: string) {
//   try {
//     // 移除 Base64 头部
//     const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
//     const imageBuffer = Buffer.from(base64Data, 'base64');

//     printer.alignCenter();
//     await printer.printImage(imageBuffer);
//     await printer.cut();
    
//     const result = await printer.execute();
//     console.log('Print successful:', result);
//     return result;
//   } catch (error) {
//     console.error('Print error:', error);
//     throw error;
//   }
// }

// // HTTP 健康检查端点
// app.get('/health', (req, res) => {
//   res.json({ status: 'ok' });
// });

// // 启动服务器
// const PORT = 3030;
// httpServer.listen(PORT, () => {
//   console.log(`Local print service running on port ${PORT}`);
// });