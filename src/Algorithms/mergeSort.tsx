const merge = async (
    arr: number[],
    l: number,
    m: number,
    r: number,
    setArray: React.Dispatch<React.SetStateAction<number[]>>,
    speed: number,
    signal: AbortSignal,
    setActiveBars: React.Dispatch<React.SetStateAction<number[]>>
  ): Promise<boolean> => {
    const n1 = m - l + 1;
    const n2 = r - m;
    const left: number[] = [];
    const right: number[] = [];
  
    for (let i = 0; i < n1; i++) left.push(arr[l + i]);
    for (let j = 0; j < n2; j++) right.push(arr[m + 1 + j]);
  
    let i = 0, j = 0, k = l;
  
    while (i < n1 && j < n2) {
      if (signal.aborted) {
        setActiveBars([]);
        return false;
      }
  
      setActiveBars([l + i, m + 1 + j]); // Highlight the bars being compared
      await new Promise((resolve) => setTimeout(resolve, 500 - speed));
  
      if (left[i] <= right[j]) {
        arr[k] = left[i];
        i++;
      } else {
        arr[k] = right[j];
        j++;
      }
      k++;
      setArray([...arr]);
      setActiveBars([]); // Remove the highlight
      await new Promise((resolve) => setTimeout(resolve, 500 - speed));
    }
  
    while (i < n1) {
      if (signal.aborted) {
        setActiveBars([]);
        return false;
      }
      setActiveBars([l + i]);
      arr[k] = left[i];
      i++;
      k++;
      setArray([...arr]);
      setActiveBars([]); // Remove the highlight
      await new Promise((resolve) => setTimeout(resolve, 500 - speed));
    }
  
    while (j < n2) {
      if (signal.aborted) {
        setActiveBars([]);
        return false;
      }
      setActiveBars([m + 1 + j]);
      arr[k] = right[j];
      j++;
      k++;
      setArray([...arr]);
      setActiveBars([]); // Remove the highlight
      await new Promise((resolve) => setTimeout(resolve, 500 - speed));
    }
  
    return true;
  };
  
  export const mergeSort = async (
    arr: number[],
    setArray: React.Dispatch<React.SetStateAction<number[]>>,
    speed: number,
    signal: AbortSignal,
    setActiveBars: React.Dispatch<React.SetStateAction<number[]>>,
    l = 0,
    r = arr.length - 1
  ): Promise<boolean> => {
    if (signal.aborted) {
      setActiveBars([]);
      return false;
    }
    if (l >= r) return true;
    
    const m = Math.floor((l + r) / 2);
    const leftSort = await mergeSort(arr, setArray, speed, signal, setActiveBars, l, m);
    if (!leftSort) return false;
  
    const rightSort = await mergeSort(arr, setArray, speed, signal, setActiveBars, m + 1, r);
    if (!rightSort) return false;
  
    const merged = await merge(arr, l, m, r, setArray, speed, signal, setActiveBars);
    if (!merged) return false;
  
    return true;
  };
  