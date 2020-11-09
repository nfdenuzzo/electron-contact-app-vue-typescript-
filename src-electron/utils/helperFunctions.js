/* eslint-disable */ 
export function parseStringData(data) {
  try {
    let parsedData = [];
    // file might be empty so no need to JSON.parse(data) just return empty data
    if (data) {
      parsedData = JSON.parse(data);
    }
    return { success: true, data: parsedData };
  } catch (err) {
    return { success: false, data: [] };
  }
}
