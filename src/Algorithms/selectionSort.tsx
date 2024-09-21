export const selectionSort = async (
    array: number[],
    setArray: React.Dispatch<React.SetStateAction<number[]>>,
    speed: number,
    signal: AbortSignal,
    setActiveBars: React.Dispatch<React.SetStateAction<number[]>>
  ): Promise<boolean> => {
    let arr = array.slice();
    
    for (let i = 0; i < arr.length - 1; i++) {
      let mini = arr[i];
      let ind = i;
  
      for (let j = i + 1; j < arr.length; j++) {
        if (signal.aborted) {
          setActiveBars([]);
          return false;
        }
  
        setActiveBars([ind, j]); // Highlight the bars being compared
        await new Promise((resolve) => setTimeout(resolve, 500 - speed));
  
        if (mini > arr[j]) {
          mini = arr[j];
          ind = j;
        }
      }
  
      let temp = arr[ind];
      arr[ind] = arr[i];
      arr[i] = temp;
  
      setArray([...arr]);
      await new Promise((resolve) => setTimeout(resolve, 500 - speed));
      setActiveBars([]); // Remove the highlights
    }
  
    return true;
  };
  