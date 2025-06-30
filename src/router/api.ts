import axios from "./axios";
export const getProductByBarcode = async (barcode) => {
    try {
        
        barcode = barcode.replace(/^1234/, '7693');
        // console.log(barcode);
        const response = await axios.get("/api/products/barcode", { params: { barcode } });
        // console.log('response:', response);
        return response.data;
    } catch (error) {
        console.error('获取产品失败:', error);
        throw error;
    }
};

export function updateProductTime(barcode, time) {
  return axios.put("/api/products/update-time", null, {
      params: { barcode, time }
  });
}

// 更新产品信息
export const updateProductByBarcode = async (formData) => {
    try {
      const response = await axios.put("/api/products/barcode", formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // 允许文件上传
        },
      });
      return response.data; // 返回后端的响应数据
    } catch (error) {
      return { code: 500, message: '更新失败' }; // 统一错误返回
    }
  };
export const sellProduct = async (product) => {
    try {
        const response = await axios.post("/api/products/selled", product);
        return response.data;
    } catch (error) {
        console.error('卖出产品失败:', error);
        throw error;
    }
};

export const reinboundProduct = async (barcodes) => {
  try {
      const response = await axios.post("/api/inbound/reinbounds", barcodes);
      return response.data;
  } catch (error) {
      console.error("入库产品失败:", error);
      throw error;
  }
};