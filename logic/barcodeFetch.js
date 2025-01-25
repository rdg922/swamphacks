export const getBarcodeData = async (barcode) => {
    const url = `https://world.openfoodfacts.net/api/v2/product/${barcode}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Response status: ${response.status}`);

        const data = await response.json();

        if (!data.status || data.status !== 1) throw new Error('Could not find barcode.');
        
        return {
            'id': data.code,
            'name': data.product.product_name,
            'image_url': data.product.image_front_url,
            'nutriscore_data': data.product.nutriscore_data,
            'nutriscore_grade': data.product.nutriscore_grade,
            'ecoscore_data': data.product.ecoscore_data,
            'ecoscore_grade': data.product.ecoscore_grade
        };
    } catch (error) {
        console.error(error.message);
        return null;
    }
}