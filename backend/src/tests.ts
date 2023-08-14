export default {
  add: [
    { addLine: "console.log(add(2, 3))", result: 5 },
    {
      addLine: "console.log(add(3, 3))",
      result: 6,
    },
  ],
  factorial: [
    { addLine: "console.log(factorial(2))", result: 2 },
    { addLine: "console.log(factorial(3))", result: 6 },
    { addLine: "console.log(factorial(5))", result: 120 },
  ],
} as any;
