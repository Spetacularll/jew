import axios from "./axios";
export const getProductByBarcode = async (barcode) => {
    try {
        
        barcode = barcode.replace(/^1234/, '7693');
        console.log(barcode);
        const response = await axios.get("/api/products/barcode", { params: { barcode } });
        console.log('response:', response);
        return response.data;
    } catch (error) {
        console.error('获取产品失败:', error);
        throw error;
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

export const reinboundProduct = async (product) => {
    try {
        const response = await axios.post("/api/products/reinbound", product);
        return response.data;
    } catch (error) {
        console.error('入库产品失败:', error);
        throw error;
    }
};