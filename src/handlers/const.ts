export const isEmpty2DArray = (arr: any[][]): boolean => {
    // Check if the outer array has no elements
    if (arr.length === 0) {
      return true;
    }
  
    // Check if all inner arrays are empty
    return arr.every(innerArr => innerArr.length === 0);
  };
  
export const mergeArrays = (array1: any[][], array2: any[][]): any[][] => {
    // Create a new array to store the merged data
    const mergedArray: any[][] = [];
  
    // Iterate over each inner array in array1
    array1.forEach((innerArray1: any[], index: number) => {
      // Create a new array to store the merged objects for the current inner array
      const mergedInnerArray: any[] = [];
  
      // Iterate over each object in the current inner array
      innerArray1.forEach((obj1: any) => {
        // Find the corresponding object in array2 with the same 'year'
        const obj2 = array2[index].find((item: any) => item.year === obj1.year);
  
        // If a corresponding object is found, merge the properties
        if (obj2) {
          mergedInnerArray.push({ ...obj1, ...obj2 });
        } else {
          // If no corresponding object is found, push obj1 as it is
          mergedInnerArray.push(obj1);
        }
      });
  
      // Push the mergedInnerArray to the mergedArray
      mergedArray.push(mergedInnerArray);
    });
  
    return mergedArray;
  }