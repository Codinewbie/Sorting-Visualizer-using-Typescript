import React, { useState, useEffect, useRef } from 'react';
import { bubbleSort } from './Algorithms/bubbleSort';
import { mergeSort } from './Algorithms/mergeSort';
import { selectionSort } from './Algorithms/selectionSort';
import { insertionSort } from './Algorithms/insertionSort';
import { quickSort } from './Algorithms/quickSort';
import ArraySizeSlider from './size-and-speed/ArraySizeSlider';
import SpeedSlider from './size-and-speed/SpeedSlider';

const SortingVisualizer: React.FC = () => {
  const [array, setArray] = useState<number[]>([]);
  const [sameArray, setSameArray] = useState<number[]>([]);
  const [arraySize, setArraySize] = useState<number>(50);
  const [speed, setSpeed] = useState<number>(499.99);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [activeBars, setActiveBars] = useState<number[]>([]);
  const [isSorting, setIsSorting] = useState<boolean>(false);
  const [notificationVisible, setNotificationVisible] = useState<boolean>(false);
  const [sortingTime, setSortingTime] = useState<string | null>(null);

  useEffect(() => {
    resetArray();
  }, [arraySize]);

  const resetArray = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort(); 
    }
    abortControllerRef.current = new AbortController();

    const newArray: number[] = [];
    for (let i = 0; i < arraySize; i++) {
      newArray.push(Math.floor(Math.random() * 400) + 10);
    }
    setArray(newArray);
    setSameArray(newArray);
    setIsSorting(false);
    setSortingTime(null);
  };

  const setPreviousArray = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    setArray([...sameArray]);
    setIsSorting(false);
    setSortingTime(null);
  };

  const handleSort = async (sortFunction: Function) => {
    if (isSorting) {
      setNotificationVisible(true);
      setTimeout(() => setNotificationVisible(false), 2000); 
      return;
    } else {
      setIsSorting(true);
      const startTime = performance.now();
      let arr = array.slice();
      try {
        const sorted = await sortFunction(arr, setArray, speed, abortControllerRef.current?.signal, setActiveBars);
        if (sorted) {
          const endTime = performance.now();
          setSortingTime(((endTime - startTime) / 1000).toFixed(2));
          setNotificationVisible(true);
          setTimeout(() => setNotificationVisible(false), 2000); 
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Error during sorting:', error);
        }
      } finally {
        setIsSorting(false);
      }
    }
  };

  const barWidth = 800 / arraySize;
  return (
    <div className="flex flex-col w-full items-center justify-center min-h-screen bg-gray-800 overflow-x-auto">
      <div className="w-full flex space-x-2 justify-center p-4 text-white fixed top-0 z-10">
        <ArraySizeSlider
          min={10}
          max={100}
          value={arraySize}
          onChange={(newSize) => setArraySize(newSize)}
          disabled={isSorting}
        />
        <button onClick={setPreviousArray} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 active:bg-blue-700 focus:outline-none">
          Use Current Array
        </button>
        <button onClick={resetArray} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 active:bg-blue-800 focus:outline-none">
          Create New Array
        </button>
        <button onClick={() => handleSort(bubbleSort)} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 active:bg-green-700 focus:outline-none">
          Bubble Sort
        </button>
        <button onClick={() => handleSort(selectionSort)} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 active:bg-green-700 focus:outline-none">
          Selection Sort
        </button>
        <button onClick={() => handleSort(insertionSort)} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 active:bg-green-700 focus:outline-none">
          Insertion Sort
        </button>
        <button onClick={() => handleSort(mergeSort)} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 active:bg-green-700 focus:outline-none">
          Merge Sort
        </button>
        <button onClick={() => handleSort(quickSort)} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 active:bg-green-700 focus:outline-none">
          Quick Sort
        </button>
        <SpeedSlider
          min={0}
          max={499.999999999999999}
          value={speed}
          onChange={(newSpeed) => setSpeed(newSpeed)}
          disabled={isSorting}
        />
      </div>
      <div className={`flex items-end space-x-1 justify-center flex-grow w-full px-4 ${sortingTime ? 'pb-5' : 'pb-8'} mt-16`}>
        {array.map((value, idx) => (
          <div key={idx}>
            <div className="flex">
              {barWidth > 12 && (
                <span
                  className="mb-[0.05rem] text-center justify-center w-full text-white"
                  style={{ fontSize: `${Math.max(8, barWidth * 0.5)}px` }}
                >
                  {value}
                </span>
              )}
            </div>
            <div
              className={`${activeBars.includes(idx) ? 'bg-yellow-500' : 'bg-red-500'} flex rounded-t justify-center items-end relative`}
              style={{ height: `${value}px`, width: `${barWidth}px`, position: 'relative' }}
              title={value.toString()}
            ></div>
          </div>
        ))}
      </div>
      {sortingTime && (
        <div className="flex justify-center items-center bg-gray-700 text-white py-2 w-full">
          <p>Time Taken: {sortingTime} seconds</p>
        </div>
      )}
      {notificationVisible && (
        <div className={`fixed ${sortingTime ? '' : 'bg-black'} ${isSorting ? 'right-0' : 'left-0'} bottom-1 text-white text-sm px-4 py-2 rounded-lg opacity-80 z-10 transition-opacity duration-300`}>
          {isSorting ? 'Sorting in progress... Please wait!' : `Array gets Sorted`}
        </div>
      )}
    </div>
  );
};

export default SortingVisualizer;
