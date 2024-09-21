const partition = async (
    arr: number[],
    setArray: React.Dispatch<React.SetStateAction<number[]>>,
    speed: number,
    signal: AbortSignal,
    setActiveBars: React.Dispatch<React.SetStateAction<number[]>>,
    low: number,
    high: number
  ): Promise<number> => {
  
    let pivot = arr[low];
    let i = low;
    let j = high;
    setActiveBars([i, j]); // Highlight the bars being compared
    await new Promise((resolve) => setTimeout(resolve, 500 - speed));
  
    while (i < j) {
      if (signal.aborted) {
        setActiveBars([]);
        return -1;
      }
      while (arr[i] <= pivot && i < high) {
        if (signal.aborted) {
          setActiveBars([]);
          return -1;
        }
        setActiveBars([i, j]); // Highlight the bars being compared
        await new Promise((resolve) => setTimeout(resolve, 500 - speed));
        i++;
      }
      while (arr[j] > pivot && j > low) {
        if (signal.aborted) {
          setActiveBars([]);
          return -1;
        }
        setActiveBars([i, j]); // Highlight the bars being compared
        await new Promise((resolve) => setTimeout(resolve, 500 - speed));
        j--;
      }
      if (i < j) {
        if (signal.aborted) {
          setActiveBars([]);
          return -1;
        }
        [arr[j], arr[i]] = [arr[i], arr[j]];
        setArray([...arr]);
        setActiveBars([i, j]); // Highlight the bars being compared
        await new Promise((resolve) => setTimeout(resolve, 500 - speed));
      }
    }
    if (signal.aborted) {
      setActiveBars([]);
      return -1;
    }
    [arr[low], arr[j]] = [arr[j], arr[low]];
    setArray([...arr]);
    setActiveBars([low, j]); // Highlight the bars being compared
    await new Promise((resolve) => setTimeout(resolve, 500 - speed));
    setActiveBars([]);
    return j;
  };
  
  export const quickSort = async (
    arr: number[],
    setArray: React.Dispatch<React.SetStateAction<number[]>>,
    speed: number,
    signal: AbortSignal,
    setActiveBars: React.Dispatch<React.SetStateAction<number[]>>,
    low = 0,
    high = arr.length - 1
  ): Promise<boolean> => {
    if (signal.aborted) {
      setActiveBars([]);
      return false;
    }
    if (low < high) {
      let pi = await partition(arr, setArray, speed, signal, setActiveBars, low, high);
      if (pi === -1) return false;
  
      let leftSort = await quickSort(arr, setArray, speed, signal, setActiveBars, low, pi - 1);
      if (!leftSort) return false;
  
      let rightSort = await quickSort(arr, setArray, speed, signal, setActiveBars, pi + 1, high);
      if (!rightSort) return false;
  
      return true;
    }
    return true;
  };
  