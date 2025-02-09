import * as additives from '../additives.json';

function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
  );
}

export const offToDict = (data) => {
  let nova_ingredients = null;
  let nova_additives = null;
  if (data.product.nova_group && data.product.nova_groups_markers && data.product.nova_groups_markers[data.product.nova_group]) {
    const nd_list = [];
    const na_list = [];
    for (const item of data.product.nova_groups_markers[data.product.nova_group]) {
      if (!item.length) continue;
      'a'.to
      if (item[0] === 'ingredients') nd_list.push(toTitleCase(item[1].split(':')[1]));
      else if (item[1] in additives) na_list.push(toTitleCase(additives[item[1]]))
    }
    nova_additives = na_list;
    nova_ingredients = nd_list;
  }

  return {
    'id': data.code,
    'name': data.product.product_name_en_imported || data.product.product_name,
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
    'nova_ingredients': nova_ingredients,
    'nova_additives': nova_additives,
    'co2': data?.product?.ecoscore_data ? data?.product?.ecoscore_data?.agribalyse?.co2_total : null
  };
}

export const getBarcodeData = async (barcode) => {
  const url = `https://world.openfoodfacts.net/api/v2/product/${barcode}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Response status: ${response.status}`);

    const data = await response.json();

    if (!data.status || data.status !== 1) throw new Error('Could not find barcode.');

    return offToDict(data);
  } catch (error) {
    console.error(error.message);
    return null;
  }
}
