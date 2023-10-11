// I-Task: arrayning ichidagi 0 index qiymatni arrayning oxiriga qoyib return qilsin

const moveArr = (array) => {
  array.push(array[0]);
  array.shift(array[0]);
  return array;
};

console.log(moveArr(["a", "b", "y", "d", 9]));
