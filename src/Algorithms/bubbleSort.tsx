export const bubbleSort = async (
    array: number[],
    setArray: React.Dispatch<React.SetStateAction<number[]>>,
    speed: number,
    signal: AbortSignal,
    setActiveBars: React.Dispatch<React.SetStateAction<number[]>>
  ): Promise<boolean> => {
  
    let arr = array.slice();
    for (let i = 0; i < arr.length; i++) {
      let swapped = false;
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (signal.aborted) {
          setActiveBars([]); 
          return false;
        }
  
        setActiveBars([j, j + 1]); // Highlight the bars being compared
        await new Promise((resolve) => setTimeout(resolve, 500 - speed));
  
        if (arr[j] > arr[j + 1]) {
          swapped = true;
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
          await new Promise((resolve) => setTimeout(resolve, 500 - speed));
        }
  
        setActiveBars([]); 
      }
  
      if (!swapped) {
        setActiveBars([]);
        return true;
      }
    }
  
    return true;
  };
  