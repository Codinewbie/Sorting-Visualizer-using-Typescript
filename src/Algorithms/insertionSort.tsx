export const insertionSort = async (
    array: number[],
    setArray: React.Dispatch<React.SetStateAction<number[]>>,
    speed: number,
    signal: AbortSignal,
    setActiveBars: React.Dispatch<React.SetStateAction<number[]>>
  ): Promise<boolean> => {
    let arr = array.slice();
  
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = i + 1; j >= 0; j--) {
        if (signal.aborted) {
          setActiveBars([]);
          return false;
        }
  
        if (arr[j] < arr[j - 1]) {
          const temp = arr[j];
          arr[j] = arr[j - 1];
          arr[j - 1] = temp;
          setArray([...arr]);
  
          await new Promise((resolve) => setTimeout(resolve, 500 - speed));
          setActiveBars([j, j - 1]); // Highlight the bars being compared
          await new Promise((resolve) => setTimeout(resolve, 500 - speed));
        } else {
          setActiveBars([]);
          break;
        }
      }
    }
    setActiveBars([]);
    return true;
  };
  