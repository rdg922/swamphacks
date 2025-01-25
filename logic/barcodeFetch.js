export const getBarcodeData = async (barcode) => {
    const url = `https://world.openfoodfacts.net/api/v2/product/${barcode}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Response status: ${response.status}`);

        const data = await response.json();

        if (!data.status || data.status !== 1) throw new Error('Could not find barcode.');

        let nova_data = null;
        if (data.product.nova_group && data.product.nova_groups_markers && data.product.nova_groups_markers[data.product.nova_group]) {
            const nd_list = [];
            for (const item of data.product.nova_groups_markers[data.product.nova_group]) {
                if (!item.length) continue;
                if (item[0] === 'ingredients') nd_list.push(item[1].split(':')[1]);
            }
            nova_data = nd_list.join(', ')
        }
        
        return {
            'id': data.code,
            'name': data.product.product_name,
            'image_url': data.product.image_front_url,
            'nutriscore_data': data.product.nutriscore_data,
            'nutriscore_grade': data.product.nutriscore_grade,
            'ecoscore_data': data.product.ecoscore_data,
            'ecoscore_grade': data.product.ecoscore_grade,
            'fat_level': data.product.nutrient_levels.fat,
            'saturated_fat_level': data.product.nutrient_levels['saturated-fat'],
            'salt_level': data.product.nutrient_levels.salt,
            'sugar_level': data.product.nutrient_levels.sugars,
            'nova_grade': data.product.nova_group,
            'nova_data': nova_data
        };
    } catch (error) {
        console.error(error.message);
        return null;
    }
}